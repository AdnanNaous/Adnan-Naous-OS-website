import { subscribeMotion } from "./runtime";

/** A non-interactive sight follows input on the existing scene clock. */
export function mountSceneCursor() {
  const root = document.documentElement;
  const sight = document.createElement("div");
  sight.className = "scene-sight";
  sight.setAttribute("aria-hidden", "true");
  sight.innerHTML = '<i class="sight-x"></i><i class="sight-y"></i><i class="sight-mark"></i>';
  document.body.append(sight);
  let x = 0, y = 0, targetX = 0, targetY = 0, inside = false, placed = false;
  const move = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    targetX = event.clientX; targetY = event.clientY;
    if (!placed) { x = targetX; y = targetY; placed = true; }
    inside = true;
    root.dataset.scenePointer = event.pointerType;
    const target = event.target instanceof Element ? event.target : null;
    sight.dataset.control = String(!!target?.closest("a,button,[role=button]"));
    sight.dataset.editing = String(!!target?.closest('input,textarea,[contenteditable="true"]'));
  };
  const leave = () => { inside = false; delete root.dataset.scenePointer; };
  const out = (event: PointerEvent) => { if (!event.relatedTarget) leave(); };
  const release = (event: PointerEvent) => { if (event.pointerType !== "mouse") leave(); };
  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerdown", move, { passive: true });
  document.addEventListener("pointerout", out, { passive: true });
  document.addEventListener("pointerup", release, { passive: true });
  document.addEventListener("pointercancel", leave, { passive: true });
  window.addEventListener("blur", leave);
  const unsubscribe = subscribeMotion(frame => {
    const mix = frame.reduced ? 1 : 1 - Math.exp(-frame.delta / 38);
    x += (targetX - x) * mix; y += (targetY - y) * mix;
    sight.style.setProperty("--sight-x", `${x.toFixed(1)}px`);
    sight.style.setProperty("--sight-y", `${y.toFixed(1)}px`);
    sight.dataset.active = String(inside && !document.hidden);
  });
  return () => {
    unsubscribe(); sight.remove(); leave();
    document.removeEventListener("pointermove", move); document.removeEventListener("pointerdown", move);
    document.removeEventListener("pointerout", out); document.removeEventListener("pointerup", release);
    document.removeEventListener("pointercancel", leave); window.removeEventListener("blur", leave);
  };
}
