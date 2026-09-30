/** One clock and one cached view of the page for DOM and canvas motion. */
export const chapterIds = ["home", "brain", "work", "now", "codex", "about", "contact"] as const;
export type Chapter = (typeof chapterIds)[number];
export type MotionFrame = {
  time: number; delta: number; scrollY: number; width: number; height: number;
  velocity: number; pointerX: number; pointerY: number; reduced: boolean;
  mobile: boolean; chapter: Chapter; chapterProgress: number;
};
type Subscriber = { callback: (frame: MotionFrame) => void; continuous: boolean; foreground: boolean };
type Bounds = { id: Chapter; top: number; height: number; node: HTMLElement };
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const subscribers = new Set<Subscriber>();
let bounds: Bounds[] = [];
let frame: MotionFrame = {
  time: 0, delta: 0, scrollY: 0, width: 0, height: 0, velocity: 0,
  pointerX: 0, pointerY: 0, reduced: false, mobile: false,
  chapter: "home", chapterProgress: 0,
};
let active = false, dirty = true, raf = 0, paceTimer = 0, lastTick = 0, lastScrollTime = 0;
let pointerX = 0, pointerY = 0, cost = 0, downgrade = 0, quiet = false;
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
  const interval = (mobile ? 50 : 33.3) * (downgrade ? 1.5 : 1);
  if (!dirty && (!continuous || now - lastTick < interval)) {
    if (continuous) schedulePaced(Math.max(1, interval - (now - lastTick)));
    return;
  }
  const started = performance.now();
  const delta = lastTick ? Math.min(80, now - lastTick) : 16;
  const y = window.scrollY;
  const chapter = deriveChapter(y, window.innerHeight);
  const rawVelocity = (y - frame.scrollY) / Math.max(16, now - (lastScrollTime || now - 16));
  const velocity = Math.abs(y - frame.scrollY) > .5 ? Math.max(-3, Math.min(3, rawVelocity)) : frame.velocity * Math.exp(-delta / 95);
  const next: MotionFrame = {
    time: now / 1000, delta, scrollY: y, width: window.innerWidth, height: window.innerHeight,
    velocity, pointerX, pointerY, reduced, mobile,
    chapter: chapter.chapter, chapterProgress: chapter.progress,
  };
  const changed = dirty || chapter.chapter !== frame.chapter || Math.abs(y - frame.scrollY) > .5 || Math.abs(velocity - frame.velocity) > .02;
  frame = next;
  lastTick = now;
  tickCount++;
  dirty = false;
  const root = document.documentElement;
  if (root.dataset.chapter !== next.chapter) root.dataset.chapter = next.chapter;
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
  if (continuous) schedulePaced(interval);
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
function onPointer(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  pointerX = (event.clientX / Math.max(1, window.innerWidth) - .5) * 2;
  pointerY = (event.clientY / Math.max(1, window.innerHeight) - .5) * 2;
  if ([...subscribers].some(subscriber => subscriber.continuous)) schedule();
}
function onVisibility() { if (document.hidden) { cancelAnimationFrame(raf); clearTimeout(paceTimer); raf = paceTimer = 0; } else { lastTick = 0; invalidateMotion(); } }
function start() {
  if (active || typeof window === "undefined") return;
  active = true;
  reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  coarseQuery = matchMedia("(pointer: coarse)");
  sectionObserver = new ResizeObserver(measure);
  mutationObserver = new MutationObserver(() => { if (bounds.length < chapterIds.length) measure(); });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
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
  document.removeEventListener("visibilitychange", onVisibility);
  reducedQuery?.removeEventListener("change", invalidateMotion);
  coarseQuery?.removeEventListener("change", invalidateMotion);
  bounds = [];
  ranges.clear();
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
/** Read-only counters for checking cadence and that hidden tabs stop work. */
export function getMotionDiagnostics() {
  return { active, hidden: typeof document === "undefined" ? true : document.hidden,
    quiet, ticks: tickCount, callbacks: callbackCount, lastFrameTime: lastTick,
    targetFps: frame.reduced || quiet ? 0 : frame.mobile ? (downgrade ? 13 : 20) : (downgrade ? 20 : 30) };
}
