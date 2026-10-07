import { invalidateMotion, setMotionQuiet, setMotionVisualChapter, subscribeMotion, type MotionFrame } from "../motion/runtime";
import { VISUAL_STATE_EVENT, type VisualState } from "./state";
import { paintChapter, paintFinish, paintSignal, type SceneInput } from "./scenes";
import { chapterCamera, createGpuScene, storyCamera } from "./gpu-scene";

/** The canvas is a film set behind HTML. Every frame comes from the shared motion clock. */
export function mountEngine(host: HTMLElement, canvas: HTMLCanvasElement) {
  // Keep a separate 2D surface available: a WebGL context cannot become a 2D context.
  const gpuCanvas = document.createElement("canvas");
  let ctx: CanvasRenderingContext2D | null = null;
  let usingGpu = false;
  const state = (key: string, value: string) => { if (host.dataset[key] !== value) host.dataset[key] = value; };
  const fallback = () => {
    if (usingGpu) { gpuCanvas.replaceWith(canvas); usingGpu = false; }
    ctx ??= canvas.getContext("2d", { alpha: false, desynchronized: true });
    host.dataset.renderer = "canvas2d";
    if (!ctx) host.dataset.fallback = "true";
    invalidateMotion();
  };
  const activateGpu = () => {
    if (!usingGpu) { canvas.replaceWith(gpuCanvas); usingGpu = true; }
    delete host.dataset.fallback;
    invalidateMotion();
  };
  const gpu = createGpuScene(gpuCanvas, fallback, activateGpu);
  if (gpu) activateGpu(); else fallback();
  if (!gpu && !ctx) return () => {};
  let width = 0, height = 0, dpr = 1, override: VisualState | null = null;
  let failed = false;
  let sceneTime = 0, exposure = .82;
  const camera = [...chapterCamera.home];
  let shot = "home", cut = 0;
  const about = document.getElementById("about");
  const caption = host.querySelector<HTMLElement>(".scene-caption");
  let grain: CanvasPattern | null = null;
  const noise = document.createElement("canvas");
  noise.width = noise.height = 96;
  const noiseContext = noise.getContext("2d");
  if (noiseContext) {
    const pixels = noiseContext.createImageData(96, 96);
    let seed = 1138;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 210;
      pixels.data[i + 3] = seed % 8;
    }
    noiseContext.putImageData(pixels, 0, 0);
    // Only the fallback uses a CPU noise tile.
  }
  function render(frame: MotionFrame) {
    if (failed) return;
    try {
      const chapter = frame.visualChapter;
      if (!frame.reduced && !frame.quiet) sceneTime += frame.delta / 1000;
      const targetExposure = chapter === "contact" ? .55 : .82;
      exposure = frame.reduced ? targetExposure : exposure + (targetExposure - exposure) * (1 - Math.exp(-frame.delta / 550));
      const nextDpr = Math.min(window.devicePixelRatio || 1, constrained ? 1 : 1.25, Math.sqrt(1500000 / Math.max(1, frame.width * frame.height)));
      if (frame.width !== width || frame.height !== height || nextDpr !== dpr) {
        width = frame.width; height = frame.height; dpr = nextDpr;
        canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
        gpuCanvas.width = canvas.width; gpuCanvas.height = canvas.height;
        gpuCanvas.style.width = `${width}px`; gpuCanvas.style.height = `${height}px`;
      }
      state("chapter", chapter);
      state("state", override || chapter);
      state("quality", frame.reduced ? "reduced" : constrained ? "low" : frame.mobile ? "mobile" : "desktop");
      state("renderer", usingGpu ? "webgl" : "canvas2d");
      state("depthLayers", "10");
      const story = Math.max(0, Math.min(3, Number(about?.dataset.storyCurrent || 1) - 1));
      const nextShot = chapter === "about" ? `story-${story + 1}` : chapter;
      const target = frame.reduced ? chapterCamera.home : chapter === "about" ? storyCamera[story] : chapterCamera[chapter];
      if (nextShot !== shot) {
        shot = nextShot; cut = frame.reduced ? 0 : 1;
        host.dataset.shot = shot;
        if (caption) caption.textContent = chapter === "about" ? `ORIGIN / 0${story + 1} — 04` : `${chapter.toUpperCase()} / CONTINUOUS SIGNAL`;
      }
      const cameraMix = frame.reduced ? 1 : 1 - Math.exp(-frame.delta / 650);
      camera.forEach((value, i) => { camera[i] = value + (target[i] - value) * cameraMix; });
      cut *= Math.exp(-frame.delta / 280);
      const input: SceneInput = {
        time: frame.reduced ? 0 : sceneTime,
        exposure,
        progress: chapter === frame.chapter ? frame.chapterProgress : 0, velocity: frame.reduced ? 0 : frame.velocity,
        pointerX: frame.reduced ? 0 : frame.pointerX * 18,
        pointerY: frame.reduced ? 0 : frame.pointerY * 12,
        pointerForce: frame.pointerForce, pointerVelocityX: frame.pointerVelocityX, pointerVelocityY: frame.pointerVelocityY,
        viewportAspect: width / Math.max(1, height),
        mobile: frame.mobile, reduced: frame.reduced, quiet: frame.quiet,
      };
      if (usingGpu && gpu) {
        if (gpu.render(input, camera, cut)) { state("ready", "true"); return; }
        fallback();
      }
      if (!ctx) return;
      grain ??= ctx.createPattern(noise, "repeat");
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#070808"; ctx!.fillRect(0, 0, width, height);
      ctx!.save(); ctx!.scale(width / 1200, height / 800);
      // One continuous landscape survives chapter changes; only its exposure eases.
      paintChapter(ctx!, chapter, input, 1);
      paintSignal(ctx!, input, 0);
      paintFinish(ctx!, input);
      ctx!.restore();
      if (grain) { ctx!.globalAlpha = frame.reduced ? .18 : .4; ctx!.fillStyle = grain; ctx!.fillRect(0, 0, width, height); ctx!.globalAlpha = 1; }
      state("ready", "true");
    } catch { failed = true; host.dataset.fallback = "true"; }
  }
  const constrained = (navigator.hardwareConcurrency || 4) <= 2;
  function visualState(event: Event) {
    const value = (event as CustomEvent<unknown>).detail;
    if (value === null || value === "home" || value === "brain" || value === "reading") {
      override = value;
      setMotionVisualChapter(value === "home" ? "home" : value === "brain" || value === "reading" ? "brain" : null);
      setMotionQuiet(value === "reading");
      invalidateMotion();
    }
  }
  window.addEventListener(VISUAL_STATE_EVENT, visualState);
  const unsubscribe = subscribeMotion(render, { continuous: true });
  return () => { unsubscribe(); gpu?.dispose(); if (usingGpu) gpuCanvas.replaceWith(canvas); setMotionQuiet(false); setMotionVisualChapter(null); window.removeEventListener(VISUAL_STATE_EVENT, visualState); noise.width = noise.height = 0; grain = null; canvas.width = canvas.height = 0; gpuCanvas.width = gpuCanvas.height = 0; };
}
