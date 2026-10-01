import { chapterIds, getRangeProgress, subscribeMotion } from "./runtime";

/** The existing set shares the scene clock; only its visible objects receive input. */
export function mountObjectPulse() {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const root = document.documentElement;
  const sections = chapterIds.flatMap(id => {
    const element = document.getElementById(id);
    return element ? [{ id, element, visible: false }] : [];
  });
  const headings = [...document.querySelectorAll<HTMLElement>("main .section-title")];
  const rail = document.querySelector<HTMLElement>(".timeline-rail");
  const textSelector = ".hero-title,.section-title,.hero-statement,.hero-intro,.section-lead,.story-chapter > p,.project-main strong,.project-main > span,.now-v2-feature h3,.brain-window-heading h3,.codex-detail-copy strong";
  const interactiveText = new Set(document.querySelectorAll<HTMLElement>(textSelector));
  interactiveText.forEach(element => element.classList.add("text-reactive"));
  let hoveredText: HTMLElement | null = null;
  const nameDisplacement = document.getElementById("an-name-displace");
  const nameLines = [...document.querySelectorAll<HTMLElement>(".hero-name-line")];
  let nameRects: DOMRect[] = [];
  let pointerClientX = 0, pointerClientY = 0;
  const trackNamePointer = (event: PointerEvent) => { pointerClientX = event.clientX; pointerClientY = event.clientY; };
  const measureName = () => { nameRects = nameLines.map(line => line.getBoundingClientRect()); };
  const trackText = (event: PointerEvent) => {
    const target = event.type === "pointerout" ? event.relatedTarget : event.target;
    const next = target instanceof Element ? target.closest<HTMLElement>(textSelector) : null;
    if (next === hoveredText) return;
    if (hoveredText) { delete hoveredText.dataset.textHover; hoveredText.style.removeProperty("--text-energy"); }
    hoveredText = next;
    if (next?.classList.contains("hero-title")) { measureName(); trackNamePointer(event); }
    if (next) { next.classList.add("text-reactive"); interactiveText.add(next); next.dataset.textHover = "true"; }
  };
  document.addEventListener("pointerover", trackText, { passive: true });
  document.addEventListener("pointerout", trackText, { passive: true });
  document.addEventListener("pointerdown", trackText, { passive: true });
  document.addEventListener("pointermove", trackNamePointer, { passive: true });
  window.addEventListener("resize", measureName, { passive: true });
  const releaseText = (event: PointerEvent) => {
    if (event.pointerType === "mouse" || !hoveredText) return;
    delete hoveredText.dataset.textHover;
    hoveredText.style.removeProperty("--text-energy");
    hoveredText = null;
  };
  document.addEventListener("pointerup", releaseText, { passive: true });
  document.addEventListener("pointercancel", releaseText, { passive: true });
  const write = (element: HTMLElement, name: string, value: string) => {
    if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
  };
  root.classList.add("pulse-ready");
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const section = sections.find(item => item.element === element);
      if (section) {
        section.visible = entry.isIntersecting;
        element.dataset.pulseVisible = String(section.visible);
      } else if (entry.isIntersecting) {
        element.dataset.pulseArrived = "true";
        observer.unobserve(element);
      }
    }
  }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
  sections.forEach(item => observer.observe(item.element));
  headings.forEach(heading => observer.observe(heading));
  const visibility = () => { root.dataset.pulsePaused = String(document.hidden); };
  document.addEventListener("visibilitychange", visibility);
  visibility();
  const unsubscribe = subscribeMotion(frame => {
    root.dataset.pulseReduced = String(frame.reduced);
    root.dataset.pulseQuiet = String(frame.quiet);
    if (hoveredText) write(hoveredText, "--text-energy", frame.reduced || frame.quiet ? "0" : Math.min(1, frame.pointerForce).toFixed(3));
    const nameActive = hoveredText?.classList.contains("hero-title") && sections[0]?.visible && !frame.reduced && !frame.quiet;
    const scale = nameActive ? (4 + Math.min(1, frame.pointerForce) * 14).toFixed(2) : "0";
    if (nameDisplacement?.getAttribute("scale") !== scale) nameDisplacement?.setAttribute("scale", scale);
    if (nameActive) nameLines.forEach((line, i) => {
      const rect = nameRects[i]; if (!rect) return;
      write(line, "--name-light-x", `${(pointerClientX - rect.left).toFixed(1)}px`);
      write(line, "--name-light-y", `${(pointerClientY - rect.top).toFixed(1)}px`);
    });
    for (const { id, element, visible } of sections) {
      if (!visible && id !== frame.chapter) continue;
      const progress = getRangeProgress(element, 1, 0);
      const still = frame.reduced || frame.quiet;
      write(element, "--object-progress", progress.toFixed(3));
      write(element, "--object-x", still ? "0px" : `${(frame.pointerX * 2.2).toFixed(2)}px`);
      write(element, "--object-y", still ? "0px" : `${(frame.pointerY * 1.6).toFixed(2)}px`);
      write(element, "--object-depth", still ? "0px" : `${((progress - .5) * 18).toFixed(2)}px`);
      if (id === "brain") write(element, "--memory-draw", (frame.reduced ? 1 : Math.min(1, Math.max(0, (progress - .1) * 2.7))).toFixed(3));
    }
    if (rail) {
      const index = chapterIds.indexOf(frame.chapter);
      write(rail, "--timeline-progress", `${(Math.min(1, (index + frame.chapterProgress) / (chapterIds.length - 1)) * 100).toFixed(2)}%`);
    }
  });
  return () => {
    unsubscribe(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility);
    document.removeEventListener("pointerover", trackText); document.removeEventListener("pointerout", trackText);
    document.removeEventListener("pointerdown", trackText); document.removeEventListener("pointerup", releaseText); document.removeEventListener("pointercancel", releaseText);
    document.removeEventListener("pointermove", trackNamePointer); window.removeEventListener("resize", measureName);
    nameDisplacement?.setAttribute("scale", "0");
    nameLines.forEach(line => { line.style.removeProperty("--name-light-x"); line.style.removeProperty("--name-light-y"); });
    interactiveText.forEach(element => { element.classList.remove("text-reactive"); delete element.dataset.textHover; element.style.removeProperty("--text-energy"); });
    root.classList.remove("pulse-ready"); delete root.dataset.pulsePaused; delete root.dataset.pulseReduced; delete root.dataset.pulseQuiet;
    sections.forEach(({ element }) => { delete element.dataset.pulseVisible; });
  };
}
