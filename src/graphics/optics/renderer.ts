import { chapterIds, invalidateMotion, subscribeMotion, type Chapter, type MotionFrame } from "../../motion/runtime";
import { advanceMaterial, createMaterialState, materials, titleIds, type MaterialState } from "./materials";
import { captureGlyphs, type GlyphCapture } from "./raster";
import { opticalFragment, opticalVertex } from "./shaders";

type Title = { node: HTMLElement; chapter: Chapter; capture: GlyphCapture; texture: WebGLTexture; state: MaterialState };
const uniformNames = ["u_rect", "u_resolution", "u_glyph", "u_environment", "u_texel", "u_pointer", "u_velocity", "u_energy", "u_front", "u_mode", "u_refraction", "u_environmentReady"] as const;
type Uniforms = Record<(typeof uniformNames)[number], WebGLUniformLocation | null>;
type Resources = { program: WebGLProgram; quad: WebGLBuffer; environment: WebGLTexture; uniforms: Uniforms; position: number };

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Optical shader allocation failed");
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Optical shader compilation: ${message}`);
  }
  return shader;
}

function texture(gl: WebGLRenderingContext) {
  const result = gl.createTexture();
  if (!result) throw new Error("Optical texture allocation failed");
  gl.bindTexture(gl.TEXTURE_2D, result);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return result;
}

function createResources(gl: WebGLRenderingContext): Resources {
  const vertex = compile(gl, gl.VERTEX_SHADER, opticalVertex);
  let fragment: WebGLShader | null = null;
  let program: WebGLProgram | null = null;
  let quad: WebGLBuffer | null = null;
  let environment: WebGLTexture | null = null;
  try {
    fragment = compile(gl, gl.FRAGMENT_SHADER, opticalFragment);
    program = gl.createProgram();
    if (!program) throw new Error("Optical program allocation failed");
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`Optical program link: ${gl.getProgramInfoLog(program)}`);
    quad = gl.createBuffer();
    if (!quad) throw new Error("Optical geometry allocation failed");
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    environment = texture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 8, 8, 255]));
    const uniforms = Object.fromEntries(uniformNames.map(name => [name, gl!.getUniformLocation(program!, name)])) as Uniforms;
    return { program, quad, environment, uniforms, position: gl.getAttribLocation(program, "a_position") };
  } catch (error) {
    if (program) gl.deleteProgram(program);
    if (quad) gl.deleteBuffer(quad);
    if (environment) gl.deleteTexture(environment);
    throw error;
  } finally {
    gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  }
}

/** One GL context, one shared clock, seven small cached glyph textures.
 * The existing environment canvas is sampled directly, with reusable texture storage.
 */
export function mountOpticalTitles(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) { canvas.dataset.state = "fallback"; return () => {}; }
  let resources: Resources | null = null;
  let titles: Title[] = [];
  let disposed = false, lost = false, failed = false, readyToCapture = false, layoutDirty = true, capturePending = false;
  let width = 0, height = 0, density = 1, layoutTimer = 0, environmentWidth = 1, environmentHeight = 1;
  let environmentSource: HTMLCanvasElement | null = null;
  let lastChapter: Chapter = "home";
  const observed = new Set<HTMLElement>();
  const clearReady = () => titles.forEach(title => { delete title.node.dataset.opticalReady; });
  const releaseTitles = () => {
    clearReady();
    for (const title of titles) {
      if (!lost) gl.deleteTexture(title.texture);
      title.capture.source.width = title.capture.source.height = 0;
    }
    titles = [];
  };
  const releaseResources = () => {
    releaseTitles();
    if (resources && !lost) {
      gl.deleteTexture(resources.environment); gl.deleteBuffer(resources.quad); gl.deleteProgram(resources.program);
    }
    resources = null;
  };
  const fail = (error: unknown) => {
    failed = true;
    clearReady();
    if (!lost) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    canvas.dataset.state = "fallback";
    // Preserve an actionable diagnostic without making successful frames noisy.
    canvas.dataset.error = error instanceof Error ? error.message : "Optical rendering unavailable";
  };
  const invalidateLayout = () => {
    if (disposed) return;
    capturePending = true;
    clearReady();
    if (!lost && !failed) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    clearTimeout(layoutTimer);
    // Reveal geometry may settle in CSS; font/size changes need one coherent recapture.
    layoutTimer = window.setTimeout(() => { layoutDirty = true; capturePending = false; invalidateMotion(); }, 100);
  };
  const sizeObserver = new ResizeObserver(invalidateLayout);
  const mutationObserver = new MutationObserver(records => {
    if (records.some(record => record.type === "characterData" || record.type === "childList" || record.attributeName === "class")) invalidateLayout();
  });
  function capture() {
    const old = new Map(titles.map(title => [title.chapter, title]));
    const next: Title[] = [];
    const maxTextureSize = Math.min(4096, gl!.getParameter(gl!.MAX_TEXTURE_SIZE) as number);
    for (const chapter of chapterIds) {
      const node = document.getElementById(titleIds[chapter]);
      if (!node) continue;
      if (!observed.has(node)) {
        observed.add(node); sizeObserver.observe(node);
        mutationObserver.observe(node, { characterData: true, childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
        if (node.parentElement) mutationObserver.observe(node.parentElement, { attributes: true, attributeFilter: ["class"] });
      }
      const glyph = captureGlyphs(node, density, maxTextureSize);
      const previous = old.get(chapter);
      if (!glyph) {
        delete node.dataset.opticalReady;
        if (previous) { gl!.deleteTexture(previous.texture); previous.capture.source.width = previous.capture.source.height = 0; }
        old.delete(chapter);
        continue;
      }
      const image = previous?.texture || texture(gl!);
      gl!.activeTexture(gl!.TEXTURE0); gl!.bindTexture(gl!.TEXTURE_2D, image);
      if (previous && previous.capture.source.width === glyph.source.width && previous.capture.source.height === glyph.source.height) {
        gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, glyph.source);
      } else gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, glyph.source);
      next.push({ node, chapter, capture: glyph, texture: image, state: previous?.state || createMaterialState() });
      if (previous) previous.capture.source.width = previous.capture.source.height = 0;
      old.delete(chapter);
    }
    for (const previous of old.values()) {
      delete previous.node.dataset.opticalReady;
      gl!.deleteTexture(previous.texture); previous.capture.source.width = previous.capture.source.height = 0;
    }
    titles = next;
    layoutDirty = false;
    canvas.dataset.captured = String(titles.length);
  }

  function render(frame: MotionFrame) {
    if (disposed || lost || failed || !resources || !readyToCapture || capturePending) return;
    try {
      const nextDensity = Math.min(window.devicePixelRatio || 1, frame.mobile ? 1.5 : 2, Math.sqrt(4000000 / Math.max(1, frame.width * frame.height)));
      if (width !== frame.width || height !== frame.height || density !== nextDensity) {
        width = frame.width; height = frame.height; density = nextDensity;
        canvas.width = Math.ceil(width * density); canvas.height = Math.ceil(height * density);
        gl!.viewport(0, 0, canvas.width, canvas.height);
        layoutDirty = true;
      }
      if (layoutDirty) capture();
      gl!.clearColor(0, 0, 0, 0); gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(resources.program);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, resources.quad);
      const attribute = resources.position;
      gl!.enableVertexAttribArray(attribute); gl!.vertexAttribPointer(attribute, 2, gl!.FLOAT, false, 0, 0);
      gl!.enable(gl!.BLEND); gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      const u = resources.uniforms;
      gl!.uniform2f(u.u_resolution, width, height);
      gl!.uniform1i(u.u_glyph, 0); gl!.uniform1i(u.u_environment, 1);
      const visible = titles.filter(title => title.capture.top - frame.scrollY < height + 70 && title.capture.top + title.capture.height - frame.scrollY > -70);
      const chapterChanged = lastChapter !== frame.visualChapter;
      const px = (frame.pointerX * .5 + .5) * width;
      const py = (frame.pointerY * .5 + .5) * height;
      for (const title of titles) {
        if (!visible.includes(title)) { title.state.visible = false; continue; }
        const box = title.capture;
        const y = box.top - frame.scrollY;
        const nearby = Math.exp(-Math.pow((px - box.left - box.width * .5) / (box.width * .8), 2) - Math.pow((py - y - box.height * .5) / (box.height * 1.2), 2));
        const entering = !title.state.visible || (chapterChanged && title.chapter === frame.visualChapter);
        advanceMaterial(title.state, title.chapter, frame, nearby, entering);
        title.state.visible = true;
      }
      environmentSource ||= document.querySelector<HTMLCanvasElement>(".visual-engine canvas");
      let environmentReady = environmentWidth > 1;
      const refracting = visible.some(title => title.state.energy > .004 || title.state.pulse < 1);
      if (refracting && environmentSource && environmentSource.width && environmentSource.height) {
        gl!.activeTexture(gl!.TEXTURE1); gl!.bindTexture(gl!.TEXTURE_2D, resources.environment);
        if (environmentWidth !== environmentSource.width || environmentHeight !== environmentSource.height) {
          environmentWidth = environmentSource.width; environmentHeight = environmentSource.height;
          gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, environmentSource);
        } else gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, environmentSource);
        environmentReady = true;
      }
      gl!.uniform1f(u.u_environmentReady, environmentReady ? 1 : 0);
      for (const title of visible) {
        const box = title.capture;
        const y = box.top - frame.scrollY;
        const profile = materials[title.chapter];
        gl!.activeTexture(gl!.TEXTURE0); gl!.bindTexture(gl!.TEXTURE_2D, title.texture);
        gl!.uniform4f(u.u_rect, box.left, y, box.width, box.height);
        gl!.uniform2f(u.u_texel, 1 / box.source.width, 1 / box.source.height);
        gl!.uniform2f(u.u_pointer, (px - box.left) / box.width, (py - y) / box.height);
        gl!.uniform2f(u.u_velocity, frame.pointerVelocityX, frame.pointerVelocityY + frame.velocity * .2);
        gl!.uniform1f(u.u_energy, title.state.energy * (frame.mobile ? .65 : 1));
        gl!.uniform1f(u.u_front, title.state.pulse);
        gl!.uniform1f(u.u_mode, profile.mode);
        gl!.uniform1f(u.u_refraction, profile.refraction);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
        title.node.dataset.opticalReady = "true";
      }
      lastChapter = frame.visualChapter;
      canvas.dataset.state = frame.reduced ? "reduced" : frame.quiet ? "quiet" : "ready";
      canvas.dataset.visible = String(visible.length);
      canvas.dataset.energy = Math.max(0, ...visible.map(title => title.state.energy)).toFixed(3);
    } catch (error) { fail(error); }
  }

  function initialize() {
    try {
      resources = createResources(gl!);
      failed = false; layoutDirty = true; environmentWidth = environmentHeight = 1;
      delete canvas.dataset.error;
      invalidateMotion();
    } catch (error) { fail(error); }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    clearReady(); releaseResources();
    canvas.dataset.state = "context-lost";
  }
  function contextRestored() { lost = false; initialize(); }
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  const booted = () => {
    for (const title of titles) { title.state.visible = false; title.state.lastTrigger = -10; }
    invalidateLayout();
  };
  window.addEventListener("resize", invalidateLayout, { passive: true });
  window.addEventListener("an-os-booted", booted);
  document.fonts.addEventListener("loadingdone", invalidateLayout);
  const main = document.getElementById("main");
  if (main) sizeObserver.observe(main);
  initialize();
  document.fonts.ready.then(() => {
    if (disposed) return;
    readyToCapture = true; layoutDirty = true; invalidateMotion();
  });
  const unsubscribe = subscribeMotion(render, { continuous: true });
  return () => {
    disposed = true;
    unsubscribe(); clearTimeout(layoutTimer);
    sizeObserver.disconnect(); mutationObserver.disconnect(); observed.clear();
    window.removeEventListener("resize", invalidateLayout);
    window.removeEventListener("an-os-booted", booted);
    document.fonts.removeEventListener("loadingdone", invalidateLayout);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.removeEventListener("webglcontextrestored", contextRestored);
    releaseResources();
    canvas.width = canvas.height = 0;
  };
}
