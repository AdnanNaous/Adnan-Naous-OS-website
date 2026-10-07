// Keep the physical hotspot through scene teardown/recovery, even without a new move.
const pointer = { x: 0, y: 0, type: "mouse", inside: false };
const editingSelector = 'input,textarea,[contenteditable]:not([contenteditable="false"])';

/** A non-interactive sight tracks physical input independently of scene pacing. */
export function mountSceneCursor() {
  const root = document.documentElement;
  const sight = document.createElement("div");
  sight.className = "scene-sight";
  sight.setAttribute("aria-hidden", "true");
  sight.innerHTML = '<i class="sight-x"></i><i class="sight-y"></i><i class="sight-mark"></i>';
  document.body.append(sight);

  // The Contact portal uses the maximum z-index. A manual popover paints above
  // it without taking focus or participating in hit testing.
  let topLayer = false;
  if (typeof sight.showPopover === "function") {
    try {
      sight.popover = "manual";
      sight.showPopover();
      topLayer = true;
    } catch { sight.removeAttribute("popover"); }
  }
  const portals = new MutationObserver(() => {
    if (!topLayer && document.body.lastElementChild !== sight) document.body.append(sight);
    if (pointer.inside) render(document.elementFromPoint(pointer.x, pointer.y));
  });
  portals.observe(document.body, { childList: true });

  const render = (target: Element | null) => {
    sight.style.setProperty("--sight-x", `${pointer.x}px`);
    sight.style.setProperty("--sight-y", `${pointer.y}px`);
    sight.dataset.pointer = pointer.type;
    sight.dataset.control = String(!!target?.closest("a,button,[role=button]"));
    sight.dataset.editing = String(!!target?.closest(editingSelector));
    const active = pointer.inside && !document.hidden;
    sight.dataset.active = String(active);
    if (active && root.dataset.scenePointer !== pointer.type) root.dataset.scenePointer = pointer.type;
    else if (!active) delete root.dataset.scenePointer;
  };
  const move = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    pointer.x = event.clientX; pointer.y = event.clientY;
    pointer.type = event.pointerType; pointer.inside = true;
    render(event.target instanceof Element ? event.target : null);
  };
  const leave = () => { pointer.inside = false; render(null); };
  const out = (event: PointerEvent) => { if (!event.relatedTarget) leave(); };
  const release = (event: PointerEvent) => { if (event.pointerType !== "mouse") leave(); };
  const visibility = () => { if (document.hidden) leave(); };
  // Capture preserves tracking when an editor/control stops propagation.
  document.addEventListener("pointermove", move, { passive: true, capture: true });
  document.addEventListener("pointerover", move, { passive: true, capture: true });
  document.addEventListener("pointerdown", move, { passive: true, capture: true });
  document.addEventListener("pointerout", out, { passive: true, capture: true });
  document.addEventListener("pointerup", release, { passive: true, capture: true });
  document.addEventListener("pointercancel", leave, { passive: true, capture: true });
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("blur", leave);
  render(pointer.inside ? document.elementFromPoint(pointer.x, pointer.y) : null);
  return () => {
    portals.disconnect(); sight.remove(); delete root.dataset.scenePointer;
    document.removeEventListener("pointermove", move, true); document.removeEventListener("pointerover", move, true);
    document.removeEventListener("pointerdown", move, true); document.removeEventListener("pointerout", out, true);
    document.removeEventListener("pointerup", release, true); document.removeEventListener("pointercancel", leave, true);
    document.removeEventListener("visibilitychange", visibility); window.removeEventListener("blur", leave);
  };
}
