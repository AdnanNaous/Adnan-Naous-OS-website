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
    for (const { id, element, visible } of sections) {
      if (!visible && id !== frame.chapter) continue;
      const progress = getRangeProgress(element, 1, 0);
      const still = frame.reduced || frame.quiet;
      write(element, "--object-progress", progress.toFixed(3));
      write(element, "--object-x", still || frame.mobile ? "0px" : `${(frame.pointerX * 2.2).toFixed(2)}px`);
      write(element, "--object-y", still || frame.mobile ? "0px" : `${(frame.pointerY * 1.6).toFixed(2)}px`);
      write(element, "--object-depth", still ? "0px" : `${((progress - .5) * (frame.mobile ? 8 : 18)).toFixed(2)}px`);
      if (id === "brain") write(element, "--memory-draw", (frame.reduced ? 1 : Math.min(1, Math.max(0, (progress - .1) * 2.7))).toFixed(3));
    }
    if (rail) {
      const index = chapterIds.indexOf(frame.chapter);
      write(rail, "--timeline-progress", `${(Math.min(1, (index + frame.chapterProgress) / (chapterIds.length - 1)) * 100).toFixed(2)}%`);
    }
  });
  return () => {
    unsubscribe(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility);
    root.classList.remove("pulse-ready"); delete root.dataset.pulsePaused; delete root.dataset.pulseReduced;
    sections.forEach(({ element }) => { delete element.dataset.pulseVisible; });
  };
}
