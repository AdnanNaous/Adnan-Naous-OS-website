import { invalidateMotion, setMotionQuiet, setMotionVisualChapter, subscribeMotion, type MotionFrame } from "../motion/runtime";
import { VISUAL_STATE_EVENT, type VisualState } from "./state";
import { paintChapter, paintFinish, paintSignal, type SceneInput } from "./scenes";

/** The canvas is a film set behind HTML. Every frame comes from the shared motion clock. */
export function mountEngine(host: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) { host.dataset.fallback = "true"; return () => {}; }
  let width = 0, height = 0, dpr = 1, override: VisualState | null = null;
  let failed = false;
  let paintedChapter: MotionFrame["visualChapter"] | null = null;
  let blendStarted = 0;
  const outgoing = document.createElement("canvas");
  const outgoingContext = outgoing.getContext("2d", { alpha: false });
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
      if (paintedChapter !== null && chapter !== paintedChapter && outgoingContext && !frame.reduced && !frame.quiet) {
        // Retarget from the currently painted image, including an unfinished dissolve.
        if (outgoing.width !== canvas.width || outgoing.height !== canvas.height) {
          outgoing.width = canvas.width; outgoing.height = canvas.height;
        }
        outgoingContext.drawImage(canvas, 0, 0);
        blendStarted = frame.time;
      }
      if (frame.reduced || frame.quiet) blendStarted = 0;
      paintedChapter = chapter;
      const nextDpr = Math.max(.65, Math.min(window.devicePixelRatio || 1, frame.mobile || constrained ? 1 : 1.5, Math.sqrt(3200000 / Math.max(1, frame.width * frame.height))));
      if (frame.width !== width || frame.height !== height || nextDpr !== dpr) {
        width = frame.width; height = frame.height; dpr = nextDpr;
        canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
        canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      }
      host.dataset.chapter = chapter;
      host.dataset.state = override || chapter;
      host.dataset.quality = frame.reduced ? "reduced" : constrained ? "low" : frame.mobile ? "mobile" : "desktop";
      host.dataset.renderer = "canvas2d";
      const input: SceneInput = {
        time: frame.reduced || override === "reading" ? 0 : frame.time,
        progress: chapter === frame.chapter ? frame.chapterProgress : 0, velocity: frame.reduced ? 0 : frame.velocity,
        pointerX: frame.reduced || frame.mobile ? 0 : frame.pointerX * 18,
        pointerY: frame.reduced || frame.mobile ? 0 : frame.pointerY * 12,
        pointerForce: frame.pointerForce, pointerVelocityX: frame.pointerVelocityX, pointerVelocityY: frame.pointerVelocityY,
        viewportAspect: width / Math.max(1, height),
        mobile: frame.mobile, reduced: frame.reduced, quiet: frame.quiet,
      };
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#070808"; ctx!.fillRect(0, 0, width, height);
      const elapsed = blendStarted ? Math.max(0, Math.min(1, (frame.time - blendStarted) / .52)) : 1;
      const blend = elapsed * elapsed * (3 - 2 * elapsed);
      if (blend < 1 && outgoing.width) ctx!.drawImage(outgoing, 0, 0, width, height);
      else blendStarted = 0;
      ctx!.save(); ctx!.scale(width / 1200, height / 800);
      paintChapter(ctx!, chapter, input, blend);
      ctx!.globalAlpha = blend;
      paintSignal(ctx!, input, 0);
      paintFinish(ctx!, input);
      ctx!.restore();
      if (grain) { ctx!.globalAlpha = (frame.reduced ? .18 : .4) * blend; ctx!.fillStyle = grain; ctx!.fillRect(0, 0, width, height); ctx!.globalAlpha = 1; }
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
  return () => { unsubscribe(); setMotionQuiet(false); setMotionVisualChapter(null); window.removeEventListener(VISUAL_STATE_EVENT, visualState); outgoing.width = outgoing.height = 0; noise.width = noise.height = 0; grain = null; canvas.width = canvas.height = 0; };
}
