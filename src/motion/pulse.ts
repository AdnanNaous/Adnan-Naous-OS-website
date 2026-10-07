import { chapterIds, getRangeProgress, subscribeMotion } from "./runtime";
import { mountSceneCursor } from "./cursor";

/** The existing set shares the scene clock; only its visible objects receive input. */
export function mountObjectPulse() {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const root = document.documentElement;
  const disposeCursor = mountSceneCursor();
  const sections = chapterIds.flatMap(id => {
    const element = document.getElementById(id);
    return element ? [{ id, element, visible: false,
      objects: [...element.querySelectorAll<HTMLElement>(".section-title,.hero-title,.hero-imprint,.brain-depth-word,.brain-memory-trace,.contact-ending")],
      trace: element.querySelector<SVGElement>(".brain-memory-trace"),
    }] : [];
  });
  const headings = [...document.querySelectorAll<HTMLElement>("main .section-title")];
  const rail = document.querySelector<HTMLElement>(".timeline-rail");
  const textSelector = ".hero-title,.section-title,.hero-statement,.hero-intro,.section-lead,.story-chapter > p,.project-main strong,.project-main > span,.now-v2-feature h3,.now-v2-origin strong,.brain-window-heading h3,.codex-detail-copy strong,.codex-menu strong";
  const interactiveText = new Set(document.querySelectorAll<HTMLElement>(textSelector));
  interactiveText.forEach(element => element.classList.add("text-reactive"));
  let hoveredText: HTMLElement | null = null;
  const nameDisplacement = document.getElementById("an-name-displace");
  const nameLines = [...document.querySelectorAll<HTMLElement>(".hero-name-line")];
  nameLines.forEach(line => { line.dataset.holoText = line.textContent || ""; });
  let nameRects: DOMRect[] = [];
  let pointerClientX = 0, pointerClientY = 0;
  let smoothX = 0, smoothY = 0, textRect: DOMRect | null = null, measuredScroll = 0;
  const opticalCopies = new Map<HTMLElement, HTMLElement>();
  const trackNamePointer = (event: PointerEvent) => { pointerClientX = event.clientX; pointerClientY = event.clientY; };
  const measureName = () => {
    nameRects = nameLines.map(line => line.getBoundingClientRect());
    if (hoveredText) { textRect = hoveredText.getBoundingClientRect(); measuredScroll = window.scrollY; }
  };
  const trackText = (event: PointerEvent) => {
    const target = event.type === "pointerout" ? event.relatedTarget : event.target;
    const next = target instanceof Element ? target.closest<HTMLElement>(textSelector) : null;
    if (next === hoveredText) return;
    opticalCopies.forEach((copy, element) => { if (!element.isConnected) { copy.remove(); opticalCopies.delete(element); interactiveText.delete(element); } });
    if (hoveredText) { delete hoveredText.dataset.textHover; hoveredText.style.removeProperty("--text-energy"); }
    hoveredText = next;
    if (next) {
      trackNamePointer(event); smoothX = pointerClientX; smoothY = pointerClientY;
      textRect = next.getBoundingClientRect(); measuredScroll = window.scrollY;
      if (next.classList.contains("hero-title")) measureName();
      else if (!opticalCopies.has(next)) {
        const copy = document.createElement("span");
        copy.className = "text-optical-copy"; copy.setAttribute("aria-hidden", "true");
        copy.textContent = next.textContent;
        next.append(copy); opticalCopies.set(next, copy);
      }
      next.classList.add("text-reactive"); interactiveText.add(next); next.dataset.textHover = "true";
    }
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
  const write = (element: HTMLElement | SVGElement, name: string, value: string) => {
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
    if (root.dataset.pulseReduced !== String(frame.reduced)) root.dataset.pulseReduced = String(frame.reduced);
    if (root.dataset.pulseQuiet !== String(frame.quiet)) root.dataset.pulseQuiet = String(frame.quiet);
    if (hoveredText) write(hoveredText, "--text-energy", frame.reduced || frame.quiet ? "0" : Math.min(1, frame.pointerForce).toFixed(3));
    const mix = 1 - Math.exp(-frame.delta / 55);
    smoothX += (pointerClientX - smoothX) * mix; smoothY += (pointerClientY - smoothY) * mix;
    if (hoveredText && frame.scrollY !== measuredScroll) measureName();
    if (hoveredText && textRect) {
      write(hoveredText, "--text-light-x", `${(smoothX - textRect.left).toFixed(1)}px`);
      write(hoveredText, "--text-light-y", `${(smoothY - textRect.top + frame.scrollY - measuredScroll).toFixed(1)}px`);
    }
    const nameActive = hoveredText?.classList.contains("hero-title") && sections[0]?.visible && !frame.reduced && !frame.quiet;
    const scale = nameActive ? (4 + Math.min(1, frame.pointerForce) * 14).toFixed(2) : "0";
    if (nameDisplacement?.getAttribute("scale") !== scale) nameDisplacement?.setAttribute("scale", scale);
    if (nameActive) nameLines.forEach((line, i) => {
      const rect = nameRects[i]; if (!rect) return;
      write(line, "--name-light-x", `${(smoothX - rect.left).toFixed(1)}px`);
      write(line, "--name-light-y", `${(smoothY - rect.top + frame.scrollY - measuredScroll).toFixed(1)}px`);
      write(line, "--holo-x", `${(frame.pointerX * 7).toFixed(2)}px`);
      write(line, "--holo-y", `${(frame.pointerY * 4).toFixed(2)}px`);
      write(line, "--holo-tilt", `${(frame.pointerX * 7).toFixed(2)}deg`);
    });
    for (const { id, element, visible, objects, trace } of sections) {
      if (!visible && id !== frame.chapter) continue;
      const progress = getRangeProgress(element, 1, 0);
      const still = frame.reduced || frame.quiet;
      // Restrict inherited pointer variables to the objects which consume them.
      // Updating a whole section used to restyle every card and control on each move.
      for (const object of objects) {
        write(object, "--object-x", still ? "0px" : `${(frame.pointerX * 2.2).toFixed(2)}px`);
        write(object, "--object-y", still ? "0px" : `${(frame.pointerY * 1.6).toFixed(2)}px`);
        write(object, "--object-depth", still ? "0px" : `${((progress - .5) * 18).toFixed(2)}px`);
      }
      if (id === "brain" && trace) write(trace, "--memory-draw", (frame.reduced ? 1 : Math.min(1, Math.max(0, (progress - .1) * 2.7))).toFixed(3));
    }
    if (rail) {
      const index = chapterIds.indexOf(frame.chapter);
      write(rail, "--timeline-progress", `${(Math.min(1, (index + frame.chapterProgress) / (chapterIds.length - 1)) * 100).toFixed(2)}%`);
    }
  });
  return () => {
    unsubscribe(); disposeCursor(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility);
    document.removeEventListener("pointerover", trackText); document.removeEventListener("pointerout", trackText);
    document.removeEventListener("pointerdown", trackText); document.removeEventListener("pointerup", releaseText); document.removeEventListener("pointercancel", releaseText);
    document.removeEventListener("pointermove", trackNamePointer); window.removeEventListener("resize", measureName);
    nameDisplacement?.setAttribute("scale", "0");
    nameLines.forEach(line => { delete line.dataset.holoText; ["--name-light-x","--name-light-y","--holo-x","--holo-y","--holo-tilt"].forEach(name => line.style.removeProperty(name)); });
    opticalCopies.forEach(copy => copy.remove());
    interactiveText.forEach(element => { element.classList.remove("text-reactive"); delete element.dataset.textHover; ["--text-energy","--text-light-x","--text-light-y"].forEach(name => element.style.removeProperty(name)); });
    root.classList.remove("pulse-ready"); delete root.dataset.pulsePaused; delete root.dataset.pulseReduced; delete root.dataset.pulseQuiet;
    sections.forEach(({ element }) => { delete element.dataset.pulseVisible; });
  };
}
