export type TransitionPhase = "idle" | "closing" | "covered" | "opening";
export type TransitionState<T extends string> = {
  phase: TransitionPhase;
  coverage: number;
  from: T;
  to: T;
  direction: -1 | 0 | 1;
};

/** Milliseconds for the material to close/open; reduced motion keeps only the protected cut. */
export const transitionTiming = { closing: 260, opening: 390, reducedClosing: 24, reducedOpening: 24 };

/** A single reversible shutter. Call once per delivered/rendered frame, never per scroll event. */
export function createSceneTransition<T extends string>(initial: T, order: readonly T[]) {
  let visualChapter = initial;
  let state: TransitionState<T> = { phase: "idle", coverage: 0, from: initial, to: initial, direction: 0 };
  const directionTo = (to: T): -1 | 0 | 1 => Math.sign(order.indexOf(to) - order.indexOf(visualChapter)) as -1 | 0 | 1;

  function advance(destination: T, delta: number, reduced = false) {
    // Copy snapshots: later controller work must never mutate an already delivered frame.
    state = { ...state };
    const elapsed = Math.max(0, Math.min(80, Number.isFinite(delta) ? delta : 0));
    if (state.phase === "idle") {
      if (destination === visualChapter) return snapshot();
      state = { phase: "closing", coverage: 0, from: visualChapter, to: destination, direction: directionTo(destination) };
    } else if (state.phase === "closing" || state.phase === "opening") {
      state.to = destination;
      if (destination === visualChapter) state.phase = "opening";
      else {
        state.phase = "closing";
        state.from = visualChapter;
        state.direction = directionTo(destination);
      }
    }

    if (state.phase === "closing") {
      state.coverage = Math.min(1, state.coverage + elapsed / (reduced ? transitionTiming.reducedClosing : transitionTiming.closing));
      if (state.coverage === 1) state.phase = "covered";
    } else if (state.phase === "covered") {
      state.to = destination;
      // Arrival at coverage=1 was delivered on the previous frame. Only now may the scene change.
      if (destination !== visualChapter) {
        state.from = visualChapter;
        state.direction = directionTo(destination);
        visualChapter = destination;
      } else {
        // The new world has spent a rendered frame behind black; retain coverage=1 for this frame too.
        state.phase = "opening";
      }
    } else if (state.phase === "opening") {
      state.coverage = Math.max(0, state.coverage - elapsed / (reduced ? transitionTiming.reducedOpening : transitionTiming.opening));
      if (state.coverage === 0) state = { phase: "idle", coverage: 0, from: visualChapter, to: visualChapter, direction: 0 };
    }
    return snapshot();
  }

  function snapshot() { return { visualChapter, transitionState: { ...state } }; }
  return { advance, snapshot, get active() { return state.phase !== "idle"; } };
}
