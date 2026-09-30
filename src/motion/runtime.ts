/** One clock and one cached view of the page for DOM and canvas motion. */
export const chapterIds = ["home", "brain", "work", "now", "codex", "about", "contact"] as const;
export type Chapter = (typeof chapterIds)[number];
export type MotionFrame = {
  time: number; delta: number; scrollY: number; width: number; height: number;
  velocity: number; pointerX: number; pointerY: number;
  pointerVelocityX: number; pointerVelocityY: number; pointerForce: number;
  reduced: boolean; quiet: boolean; mobile: boolean; chapter: Chapter; chapterProgress: number;
  visualChapter: Chapter;
};
type Subscriber = { callback: (frame: MotionFrame) => void; continuous: boolean; foreground: boolean };
type Bounds = { id: Chapter; top: number; height: number; node: HTMLElement };
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const subscribers = new Set<Subscriber>();
let visualOverride: Chapter | null = null;
let bounds: Bounds[] = [];
let frame: MotionFrame = {
  time: 0, delta: 0, scrollY: 0, width: 0, height: 0, velocity: 0,
  pointerX: 0, pointerY: 0, pointerVelocityX: 0, pointerVelocityY: 0, pointerForce: 0,
  reduced: false, quiet: false, mobile: false, chapter: "home", chapterProgress: 0,
  visualChapter: "home",
};
let active = false, dirty = true, raf = 0, paceTimer = 0, lastTick = 0, lastScrollTime = 0;
let pointerTargetX = 0, pointerTargetY = 0, pointerInputVelocityX = 0, pointerInputVelocityY = 0;
let lastPointerTime = 0, pointerInside = false;
let contactPointerId: number | null = null;
let cost = 0, downgrade = 0, quiet = false;
const pointerPhysics = { positionDamping: 115, velocityDamping: 90, forceAttack: 65, forceRelease: 260, restDelay: 1300, restDamping: 700 };
const ranges = new Map<HTMLElement, { top: number; height: number }>();
const observedNodes = new Set<HTMLElement>();
let tickCount = 0, callbackCount = 0;
let sectionObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;
let reducedQuery: MediaQueryList | undefined;
let coarseQuery: MediaQueryList | undefined;

function measure() {
  if (!active) return;
  const y = window.scrollY;
  bounds = chapterIds.flatMap(id => {
    const node = document.getElementById(id);
    if (!node) return [];
    const rect = node.getBoundingClientRect();
    return [{ id, top: rect.top + y, height: Math.max(1, rect.height), node }];
  });
  const nextNodes = new Set(bounds.map(item => item.node));
  for (const [node] of ranges) {
    if (!node.isConnected) { ranges.delete(node); continue; }
    const rect = node.getBoundingClientRect();
    ranges.set(node, { top: rect.top + y, height: Math.max(1, rect.height) });
    nextNodes.add(node);
  }
  for (const node of observedNodes) if (!nextNodes.has(node)) {
    sectionObserver?.unobserve(node);
    observedNodes.delete(node);
  }
  for (const node of nextNodes) if (!observedNodes.has(node)) {
    sectionObserver?.observe(node);
    observedNodes.add(node);
  }
  dirty = true;
  schedule();
}

function deriveChapter(y: number, height: number): { chapter: Chapter; progress: number } {
  const focus = y + height * .42;
  let current = bounds[0];
  for (const item of bounds) if (focus >= item.top) current = item;
  if (!current) return { chapter: "home", progress: 0 };
  return { chapter: current.id, progress: clamp((focus - current.top) / current.height) };
}

function tick(now: number) {
  raf = 0;
  if (!active || document.hidden) return;
  const mobile = window.innerWidth < 700 || !!coarseQuery?.matches;
  const reduced = !!reducedQuery?.matches;
  const continuous = !reduced && [...subscribers].some(subscriber => subscriber.continuous && (!quiet || subscriber.foreground));
  const interval = 33.3 * (downgrade ? 1.5 : 1);
  // Input bursts share the capped clock without blocking page content.
  if (lastTick && now - lastTick < interval) {
    schedulePaced(Math.max(1, interval - (now - lastTick)));
    return;
  }
  if (!dirty && !continuous && !pointerNeedsFrame(now) && Math.abs(frame.velocity) <= .025) {
    return;
  }
  const started = performance.now();
  const delta = lastTick ? Math.min(80, now - lastTick) : 16;
  const y = window.scrollY;
  const chapter = deriveChapter(y, window.innerHeight);
  const visualChapter = visualOverride ?? chapter.chapter;
  const pointer = advancePointer(now, delta, reduced);
  const rawVelocity = (y - frame.scrollY) / Math.max(16, now - (lastScrollTime || now - 16));
  const velocity = Math.abs(y - frame.scrollY) > .5 ? Math.max(-3, Math.min(3, rawVelocity)) : frame.velocity * Math.exp(-delta / 95);
  const next: MotionFrame = {
    time: now / 1000, delta, scrollY: y, width: window.innerWidth, height: window.innerHeight,
    velocity, ...pointer, reduced, quiet, mobile, visualChapter,
    chapter: chapter.chapter, chapterProgress: chapter.progress,
  };
  const changed = dirty || chapter.chapter !== frame.chapter || Math.abs(y - frame.scrollY) > .5 || Math.abs(velocity - frame.velocity) > .02
    || visualChapter !== frame.visualChapter
    || pointer.pointerX !== frame.pointerX || pointer.pointerY !== frame.pointerY
    || pointer.pointerVelocityX !== frame.pointerVelocityX || pointer.pointerVelocityY !== frame.pointerVelocityY
    || pointer.pointerForce !== frame.pointerForce;
  frame = next;
  lastTick = now;
  tickCount++;
  dirty = false;
  const root = document.documentElement;
  if (root.dataset.chapter !== next.chapter) root.dataset.chapter = next.chapter;
  root.dataset.visualChapter = next.visualChapter;
  if (changed) {
    root.style.setProperty("--scene-progress", next.chapterProgress.toFixed(4));
    root.style.setProperty("--scene-velocity", next.velocity.toFixed(3));
    for (const item of bounds) {
      const progress = clamp((y + next.height * .42 - item.top) / item.height);
      item.node.style.setProperty("--chapter-progress", progress.toFixed(4));
    }
  }
  for (const subscriber of subscribers) if ((continuous && subscriber.continuous && (!quiet || subscriber.foreground)) || changed) {
    subscriber.callback(next);
    callbackCount++;
  }
  cost = cost * .9 + (performance.now() - started) * .1;
  downgrade = cost > 24 ? 1 : cost < 13 ? 0 : downgrade;
  if (continuous || pointerNeedsFrame(now)) schedulePaced(interval);
  else if (Math.abs(velocity) > .025) schedulePaced(33);
}

function schedule() {
  if (!active || document.hidden) return;
  clearTimeout(paceTimer); paceTimer = 0;
  if (!raf) raf = requestAnimationFrame(tick);
}
function schedulePaced(delay: number) {
  if (!active || document.hidden || raf || paceTimer) return;
  paceTimer = window.setTimeout(() => { paceTimer = 0; schedule(); }, delay);
}
function onScroll() { lastScrollTime = performance.now(); dirty = true; schedule(); }
function pointerNeedsFrame(now: number) {
  if (frame.reduced) return false;
  const resting = !pointerInside || now - lastPointerTime > pointerPhysics.restDelay;
  return (!resting && (frame.pointerX !== 0 || frame.pointerY !== 0))
    || frame.pointerForce !== 0 || frame.pointerVelocityX !== 0 || frame.pointerVelocityY !== 0
    || Math.abs(frame.pointerX - (resting ? 0 : pointerTargetX)) + Math.abs(frame.pointerY - (resting ? 0 : pointerTargetY)) > .00005;
}
function advancePointer(now: number, delta: number, disabled: boolean) {
  if (disabled) return { pointerX: 0, pointerY: 0, pointerVelocityX: 0, pointerVelocityY: 0, pointerForce: 0 };
  const age = now - lastPointerTime;
  const relaxation = pointerInside ? Math.exp(-Math.max(0, age - pointerPhysics.restDelay) / pointerPhysics.restDamping) : 0;
  const positionMix = 1 - Math.exp(-delta / pointerPhysics.positionDamping);
  const velocityMix = 1 - Math.exp(-delta / pointerPhysics.velocityDamping);
  const impulseDecay = pointerInside ? Math.exp(-Math.max(0, age - 35) / 90) : 0;
  const vx = pointerInputVelocityX * impulseDecay;
  const vy = pointerInputVelocityY * impulseDecay;
  const force = clamp(Math.hypot(vx, vy) / 3.5);
  const forceMix = 1 - Math.exp(-delta / (force > frame.pointerForce ? pointerPhysics.forceAttack : pointerPhysics.forceRelease));
  const settle = (value: number) => Math.abs(value) < .00005 ? 0 : value;
  return {
    pointerX: settle(frame.pointerX + (pointerTargetX * relaxation - frame.pointerX) * positionMix),
    pointerY: settle(frame.pointerY + (pointerTargetY * relaxation - frame.pointerY) * positionMix),
    pointerVelocityX: settle(frame.pointerVelocityX + (vx - frame.pointerVelocityX) * velocityMix),
    pointerVelocityY: settle(frame.pointerVelocityY + (vy - frame.pointerVelocityY) * velocityMix),
    pointerForce: settle(frame.pointerForce + (force - frame.pointerForce) * forceMix),
  };
}
function onPointer(event: PointerEvent) {
  if (event.isPrimary === false) return;
  if (event.pointerType === "touch" && contactPointerId !== event.pointerId) return;
  if (contactPointerId !== null && contactPointerId !== event.pointerId) return;
  const now = performance.now();
  const x = Math.max(-1, Math.min(1, (event.clientX / Math.max(1, window.innerWidth) - .5) * 2));
  const y = Math.max(-1, Math.min(1, (event.clientY / Math.max(1, window.innerHeight) - .5) * 2));
  const elapsed = Math.max(8, now - lastPointerTime) / 1000;
  // Re-entry establishes position without turning time spent outside the viewport into an impulse.
  pointerInputVelocityX = pointerInside ? Math.max(-4, Math.min(4, (x - pointerTargetX) / elapsed)) : 0;
  pointerInputVelocityY = pointerInside ? Math.max(-4, Math.min(4, (y - pointerTargetY) / elapsed)) : 0;
  pointerTargetX = x; pointerTargetY = y; lastPointerTime = now; pointerInside = true;
  dirty = true;
  schedule();
}
function onPointerDown(event: PointerEvent) {
  if (event.isPrimary === false) return;
  if (event.pointerType === "touch" || event.pointerType === "pen") {
    if (contactPointerId !== null && contactPointerId !== event.pointerId) return;
    pointerInside = false;
    contactPointerId = event.pointerId;
  }
  onPointer(event);
}
function onPointerRelease(event: PointerEvent) {
  if (contactPointerId === event.pointerId) onPointerLeave();
}
function onPointerLeave() { contactPointerId = null; pointerInside = false; pointerInputVelocityX = pointerInputVelocityY = 0; dirty = true; schedule(); }
function onPointerOut(event: PointerEvent) { if (!event.relatedTarget) onPointerLeave(); }
function onVisibility() {
  if (document.hidden) { cancelAnimationFrame(raf); clearTimeout(paceTimer); raf = paceTimer = 0; onPointerLeave(); }
  else { lastTick = 0; invalidateMotion(); }
}
function start() {
  if (active || typeof window === "undefined") return;
  active = true;
  lastTick = 0;
  reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  coarseQuery = matchMedia("(pointer: coarse)");
  sectionObserver = new ResizeObserver(measure);
  mutationObserver = new MutationObserver(() => { if (bounds.length < chapterIds.length) measure(); });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerRelease, { passive: true });
  window.addEventListener("pointercancel", onPointerRelease, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("blur", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", invalidateMotion);
  coarseQuery.addEventListener("change", invalidateMotion);
  measure();
}
function stop() {
  active = false;
  cancelAnimationFrame(raf); clearTimeout(paceTimer); raf = paceTimer = 0;
  sectionObserver?.disconnect(); mutationObserver?.disconnect();
  observedNodes.clear();
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", measure);
  window.removeEventListener("pointermove", onPointer);
  window.removeEventListener("pointerdown", onPointerDown);
  window.removeEventListener("pointerup", onPointerRelease);
  window.removeEventListener("pointercancel", onPointerRelease);
  window.removeEventListener("pointerout", onPointerOut);
  window.removeEventListener("blur", onPointerLeave);
  document.removeEventListener("visibilitychange", onVisibility);
  reducedQuery?.removeEventListener("change", invalidateMotion);
  coarseQuery?.removeEventListener("change", invalidateMotion);
  bounds = [];
  ranges.clear();
  contactPointerId = null; pointerInside = false; pointerInputVelocityX = pointerInputVelocityY = 0;
  visualOverride = null;
}

export function subscribeMotion(callback: (frame: MotionFrame) => void, options: { continuous?: boolean; foreground?: boolean } = {}) {
  const subscriber = { callback, continuous: !!options.continuous, foreground: !!options.foreground };
  subscribers.add(subscriber);
  start();
  dirty = true;
  schedule();
  return () => { subscribers.delete(subscriber); if (!subscribers.size) stop(); };
}
export function invalidateMotion() { dirty = true; schedule(); }
export function getSectionProgress(id: string, viewportOffset = .42) {
  const item = bounds.find(section => section.id === id);
  return item ? clamp((frame.scrollY + frame.height * viewportOffset - item.top) / item.height) : 0;
}
/** Progress across a tall track, from its top reaching start offset to its bottom reaching end offset. */
export function getRangeProgress(element: HTMLElement, viewportOffset = 0, endViewportOffset = 1) {
  let range = ranges.get(element);
  if (!range) {
    const rect = element.getBoundingClientRect();
    range = { top: rect.top + window.scrollY, height: Math.max(1, rect.height) };
    ranges.set(element, range);
    if (!observedNodes.has(element)) {
      sectionObserver?.observe(element);
      observedNodes.add(element);
    }
  }
  const distance = range.height - frame.height * (endViewportOffset - viewportOffset);
  return clamp((frame.scrollY + frame.height * viewportOffset - range.top) / Math.max(1, distance));
}
/** Reading a thought stops autonomous scene frames; scroll and state changes still render. */
export function setMotionQuiet(value: boolean) {
  if (quiet === value) return;
  quiet = value;
  invalidateMotion();
}
/** Archive intent affects only the background. Null restores scroll intent. */
export function setMotionVisualChapter(value: Chapter | null) {
  if (visualOverride === value) return;
  visualOverride = value;
  invalidateMotion();
}
/** Read-only counters for checking cadence and that hidden tabs stop work. */
export function getMotionDiagnostics() {
  return { active, hidden: typeof document === "undefined" ? true : document.hidden,
    quiet, ticks: tickCount, callbacks: callbackCount, lastFrameTime: lastTick,
    visualChapter: frame.visualChapter,
    targetFps: (frame.reduced || quiet) && !pointerNeedsFrame(performance.now()) ? 0 : (downgrade ? 20 : 30) };
}
