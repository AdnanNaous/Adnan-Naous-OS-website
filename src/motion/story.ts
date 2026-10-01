/** Resolve one chapter at a time, keeping the outgoing text until it fades. */
export function createStoryTransition(chapters: HTMLElement[]) {
  let active = -1;
  let target = -1;
  let reduced = false;
  let revision = 0;
  let animation: Animation | undefined;
  let focusTarget = -1;

  const stop = () => {
    const chapter = chapters[active];
    const opacity = chapter ? getComputedStyle(chapter).opacity : "1";
    animation?.cancel();
    animation = undefined;
    if (chapter) chapter.style.opacity = opacity;
  };
  const commit = (index: number) => {
    active = index;
    chapters.forEach((chapter, chapterIndex) => {
      const current = chapterIndex === index;
      chapter.dataset.current = String(current);
      if (reduced) chapter.removeAttribute("aria-hidden");
      else chapter.setAttribute("aria-hidden", String(!current));
      chapter.inert = !reduced && !current;
      chapter.style.removeProperty("opacity");
    });
    if (focusTarget === index) {
      chapters[index]?.focus({ preventScroll: true });
      focusTarget = -1;
    }
  };
  const setCurrent = (index: number, nextReduced: boolean) => {
    if (index === target && nextReduced === reduced) return;
    const modeChanged = nextReduced !== reduced;
    target = index;
    if (focusTarget !== index) focusTarget = -1;
    reduced = nextReduced;
    const token = ++revision;
    stop();
    if (active < 0 || modeChanged || reduced || document.hidden || !chapters[active]?.animate) {
      commit(index);
      return;
    }
    if (index === active) {
      const chapter = chapters[index];
      animation = chapter.animate([{ opacity: chapter.style.opacity || "1" }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
      chapter.style.opacity = "1";
      return;
    }
    const outgoing = chapters[active];
    animation = outgoing.animate([{ opacity: outgoing.style.opacity || "1" }, { opacity: 0 }], { duration: 140, easing: "ease-in", fill: "forwards" });
    void animation.finished.then(() => {
      if (token !== revision) return;
      animation?.cancel();
      commit(index);
      const incoming = chapters[index];
      animation = incoming.animate([{ opacity: 0, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    }).catch(() => { /* Superseded by a newer native scroll position. */ });
  };
  return {
    setCurrent,
    focus(index: number) {
      if (index === active || reduced) chapters[index]?.focus({ preventScroll: true });
      else focusTarget = index;
    },
    dispose() {
      ++revision;
      animation?.cancel();
      chapters.forEach(chapter => chapter.style.removeProperty("opacity"));
    },
  };
}
