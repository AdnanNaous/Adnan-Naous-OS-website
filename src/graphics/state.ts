export type VisualState = "home" | "brain" | "reading";
export const VISUAL_STATE_EVENT = "anos:visual-state";

/** UI expresses intent; content and callers never import the renderer. */
export function setVisualState(state: VisualState | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(VISUAL_STATE_EVENT, { detail: state }));
  }
}

export const chapters = ["home", "brain", "work", "now", "codex", "about", "contact"] as const;
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const smooth = (n: number) => { const v = clamp(n); return v * v * (3 - 2 * v); };
