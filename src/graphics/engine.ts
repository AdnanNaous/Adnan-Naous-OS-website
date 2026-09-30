import { createComposition, type Composition } from "./composition";
import { chapters, clamp, smooth, VISUAL_STATE_EVENT, type VisualState } from "./state";

/** Only this module owns browser lifecycle and high-frequency state. */
export function mountEngine(host: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) { host.dataset.fallback = "true"; return () => {}; }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(pointer: coarse)");
  let composition: Composition | undefined;
  let grain: CanvasPattern | null = null;
  let width = 0, height = 0, dpr = 1, mobile = false;
  let frame = 0, timer = 0, disposed = false, visible = !document.hidden, relevant = true;
  let failed = false, override: VisualState | null = null;
  let targetX = 0, targetY = 0, x = 0, y = 0, depth = 0, targetDepth = 0;
  let quiet = 0, targetQuiet = 0, contact = 0, targetContact = 0, phase = 0, breath = 0;
  let anchors: { id: string; top: number }[] = [];
  let lastTime = 0;
  const constrained = (navigator.hardwareConcurrency || 4) <= 2;
  const canMove = () => !reduced.matches && !constrained;
  const cancel = () => { cancelAnimationFrame(frame); frame = 0; clearTimeout(timer); timer = 0; };
  const fail = () => { failed = true; cancel(); host.dataset.fallback = "true"; composition?.dispose(); composition = undefined; };

  function schedule() {
    if (!disposed && !failed && visible && relevant && !frame) frame = requestAnimationFrame(draw);
  }
  function idle() {
    clearTimeout(timer);
    // Sparse, bounded breathing bursts. Mobile, reading and reduced-motion sleep fully.
    if (canMove() && !mobile && targetQuiet < .1 && visible && relevant) {
      timer = window.setTimeout(() => { phase += .6; breath = Math.sin(phase) * .45; schedule(); }, 4200);
    }
  }
  function draw(now: number) {
    frame = 0;
    if (disposed || failed || !visible || !relevant || !composition || !ctx) return;
    try {
      const moving = canMove();
      const delta = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      const ease = moving ? 1 - Math.exp(-delta / 125) : 1;
      const px = moving && !mobile ? targetX + breath : 0;
      const py = moving && !mobile ? targetY : 0;
      x += (px - x) * ease; y += (py - y) * ease;
      depth += (targetDepth - depth) * ease; quiet += (targetQuiet - quiet) * ease;
      contact += (targetContact - contact) * ease;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1; ctx.fillStyle = "#090909"; ctx.fillRect(0, 0, width, height);
      for (const p of composition.plates) {
        const separation = p.depth * depth * (mobile ? 14 : 38);
        const offsetX = x * p.depth * (1 + depth * .4) * (1 - quiet) + separation;
        const offsetY = y * p.depth * (1 - quiet) - separation * .25;
        const overscan = 14 + depth * p.depth * 16;
        ctx.globalAlpha = p.opacity * (1 - quiet * .64);
        ctx.drawImage(p.image, -overscan + offsetX, -overscan + offsetY, width + overscan * 2, height + overscan * 2);
      }
      // A shadow crossing the right-hand strata makes entry feel like passing a layer.
      const crossing = Math.sin(depth * Math.PI) * .2 * (1 - quiet);
      ctx.globalAlpha = crossing; ctx.fillStyle = "#050606";
      ctx.fillRect(width * (.91 - depth * .19), 0, width * .15, height);
      if (contact > .001) {
        ctx.globalAlpha = contact * .34;
        ctx.fillStyle = "#beb7a2"; ctx.fillRect(width * .815, height * .21, Math.max(2, width * .003), height * .5);
        ctx.globalAlpha = contact * .07; ctx.fillRect(width * .818, height * .21, width * .08, height * .5);
      }
      if (grain) { ctx.globalAlpha = .65 * (1 - quiet); ctx.fillStyle = grain; ctx.fillRect(0, 0, width, height); }
      ctx.globalAlpha = 1;
      host.dataset.ready = "true";
      const unsettled = Math.abs(x - px) + Math.abs(y - py) + Math.abs(depth - targetDepth) * 20 + Math.abs(quiet - targetQuiet) * 20 + Math.abs(contact - targetContact) * 20 > .025;
      if (moving && unsettled) schedule(); else idle();
    } catch { fail(); }
  }
  function measure() {
    anchors = chapters.flatMap((id) => {
      const section = document.getElementById(id);
      return section ? [{ id, top: section.getBoundingClientRect().top + scrollY }] : [];
    }).sort((a, b) => a.top - b.top);
    readScroll();
  }
  function readScroll() {
    const focus = scrollY + height * .42;
    let chapter = "home";
    for (const anchor of anchors) if (focus >= anchor.top) chapter = anchor.id;
    const brain = anchors.find((a) => a.id === "brain");
    const next = brain && anchors.find((a) => a.top > brain.top);
    const entering = brain ? smooth((scrollY + height - brain.top) / Math.max(1, height * .8)) : 0;
    const leaving = next ? smooth((focus - (next.top - height * .4)) / Math.max(1, height * .65)) : 0;
    targetDepth = entering * (1 - leaving);
    if (override === "home") targetDepth = 0;
    if (override === "brain" || override === "reading") targetDepth = 1;
    const state = override || (chapter === "brain" ? "brain" : "home");
    targetQuiet = state === "reading" ? 1 : chapter === "home" || chapter === "brain" ? 0 : .3;
    targetContact = chapter === "contact" ? 1 : 0;
    host.dataset.chapter = chapter; host.dataset.state = state;
    schedule();
  }
  function resize() {
    if (disposed || failed) return;
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    const nextMobile = w < 700 || coarse.matches;
    // Cap backing-store area as well as DPR on very large desktop displays.
    const ratio = Math.min(devicePixelRatio || 1, nextMobile || constrained ? 1 : 1.5, Math.sqrt(3500000 / (w * h)));
    if (w !== width || h !== height || ratio !== dpr || nextMobile !== mobile) {
      width = w; height = h; dpr = ratio; mobile = nextMobile;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      composition?.dispose(); composition = undefined;
      try { composition = createComposition(w, h, mobile); grain = ctx!.createPattern(composition.grain, "repeat"); }
      catch { fail(); return; }
      host.dataset.quality = reduced.matches ? "reduced" : constrained ? "low" : mobile ? "mobile" : "desktop";
      host.dataset.renderer = "canvas2d";
    }
    measure();
  }
  const pointer = (event: PointerEvent) => {
    if (!canMove() || mobile || event.pointerType !== "mouse" || targetQuiet > .9) return;
    targetX = (clamp(event.clientX / width) - .5) * 7;
    targetY = (clamp(event.clientY / height) - .5) * 4; schedule();
  };
  const resetPointer = () => { targetX = targetY = 0; schedule(); };
  const visibility = () => { visible = !document.hidden; cancel(); if (visible) { lastTime = 0; measure(); } };
  const motion = () => { cancel(); breath = 0; host.dataset.quality = reduced.matches ? "reduced" : constrained ? "low" : mobile ? "mobile" : "desktop"; readScroll(); };
  const state = (event: Event) => {
    const value = (event as CustomEvent<unknown>).detail;
    if (value !== null && value !== "home" && value !== "brain" && value !== "reading") return;
    override = value; clearTimeout(timer); readScroll();
  };
  const lost = (event: Event) => { event.preventDefault(); fail(); };
  const restored = () => { failed = false; delete host.dataset.fallback; width = 0; resize(); };
  const observer = new ResizeObserver(resize);
  const contentObserver = new ResizeObserver(measure);
  const intersection = new IntersectionObserver(([entry]) => { relevant = entry.isIntersecting; if (!relevant) cancel(); else schedule(); });
  observer.observe(host); contentObserver.observe(document.documentElement); intersection.observe(host);
  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", pointer, { passive: true });
  window.addEventListener("blur", resetPointer);
  window.addEventListener(VISUAL_STATE_EVENT, state);
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", motion); coarse.addEventListener("change", resize);
  canvas.addEventListener("contextlost", lost); canvas.addEventListener("contextrestored", restored);
  resize();
  return () => {
    disposed = true; cancel(); composition?.dispose(); grain = null;
    observer.disconnect(); contentObserver.disconnect(); intersection.disconnect();
    window.removeEventListener("scroll", readScroll); window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", pointer); window.removeEventListener("blur", resetPointer);
    window.removeEventListener(VISUAL_STATE_EVENT, state); document.removeEventListener("visibilitychange", visibility);
    reduced.removeEventListener("change", motion); coarse.removeEventListener("change", resize);
    canvas.removeEventListener("contextlost", lost); canvas.removeEventListener("contextrestored", restored);
    canvas.width = canvas.height = 0;
  };
}
