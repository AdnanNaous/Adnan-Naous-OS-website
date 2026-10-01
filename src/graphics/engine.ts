import { invalidateMotion, setMotionQuiet, setMotionVisualChapter, subscribeMotion, type MotionFrame } from "../motion/runtime";
import { VISUAL_STATE_EVENT, type VisualState } from "./state";
import { paintChapter, paintFinish, paintSignal, type SceneInput } from "./scenes";

/** The canvas is a film set behind HTML. Every frame comes from the shared motion clock. */
export function mountEngine(host: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) { host.dataset.fallback = "true"; return () => {}; }
  let width = 0, height = 0, dpr = 1, override: VisualState | null = null;
  let failed = false;
  let sceneTime = 0, exposure = .7;
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
    grain = ctx.createPattern(noise, "repeat");
  }
  function render(frame: MotionFrame) {
    if (failed) return;
    try {
      const chapter = frame.visualChapter;
      if (!frame.reduced && !frame.quiet) sceneTime += frame.delta / 1000;
      const targetExposure = chapter === "contact" ? .3 : .7;
      exposure = frame.reduced ? targetExposure : exposure + (targetExposure - exposure) * (1 - Math.exp(-frame.delta / 550));
      const nextDpr = Math.max(.65, Math.min(window.devicePixelRatio || 1, constrained ? 1 : 1.5, Math.sqrt(3200000 / Math.max(1, frame.width * frame.height))));
      if (frame.width !== width || frame.height !== height || nextDpr !== dpr) {
        width = frame.width; height = frame.height; dpr = nextDpr;
        canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      }
      host.dataset.chapter = chapter;
      host.dataset.state = override || chapter;
      host.dataset.quality = frame.reduced ? "reduced" : constrained ? "low" : frame.mobile ? "mobile" : "desktop";
      host.dataset.renderer = "canvas2d";
      host.dataset.depthLayers = "10";
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
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#070808"; ctx!.fillRect(0, 0, width, height);
      ctx!.save(); ctx!.scale(width / 1200, height / 800);
      // One continuous landscape survives chapter changes; only its exposure eases.
      paintChapter(ctx!, chapter, input, 1);
      paintSignal(ctx!, input, 0);
      paintFinish(ctx!, input);
      ctx!.restore();
      if (grain) { ctx!.globalAlpha = frame.reduced ? .18 : .4; ctx!.fillStyle = grain; ctx!.fillRect(0, 0, width, height); ctx!.globalAlpha = 1; }
      host.dataset.ready = "true";
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
  return () => { unsubscribe(); setMotionQuiet(false); setMotionVisualChapter(null); window.removeEventListener(VISUAL_STATE_EVENT, visualState); noise.width = noise.height = 0; grain = null; canvas.width = canvas.height = 0; };
}
