import type { Chapter, MotionFrame } from "../../motion/runtime";

export const titleIds: Record<Chapter, string> = {
  home: "hero-title", brain: "brain-title", work: "work-title", now: "now-title",
  codex: "codex-title", about: "about-title", contact: "contact-title",
};

/** Mode controls geometry, while response controls the force and relaxation law. */
export const materials: Record<Chapter, { mode: number; force: number; relaxation: number; duration: number; refraction: number }> = {
  home: { mode: 0, force: .65, relaxation: 7, duration: 1.2, refraction: .22 },
  brain: { mode: 1, force: 1.15, relaxation: 3.8, duration: 1.6, refraction: .57 },
  work: { mode: 2, force: .62, relaxation: 10, duration: .9, refraction: .18 },
  now: { mode: 3, force: .95, relaxation: 6.5, duration: 1.05, refraction: .36 },
  codex: { mode: 4, force: .83, relaxation: 9, duration: 1.15, refraction: .38 },
  about: { mode: 5, force: .52, relaxation: 4.5, duration: 1.5, refraction: .12 },
  contact: { mode: 6, force: .92, relaxation: 5.5, duration: 1.4, refraction: .44 },
};

export type MaterialState = { energy: number; inertia: number; pulse: number; lastTrigger: number; visible: boolean };
export const createMaterialState = (): MaterialState => ({ energy: 0, inertia: 0, pulse: 2, lastTrigger: -10, visible: false });

/** A bounded traveling front receives input, then resolves. Nothing oscillates at rest. */
export function advanceMaterial(state: MaterialState, chapter: Chapter, frame: MotionFrame, nearby: number, entered: boolean) {
  if (frame.reduced || frame.quiet) {
    state.energy = state.inertia = 0;
    state.pulse = 2;
    return;
  }
  const profile = materials[chapter];
  const dt = Math.min(.064, frame.delta / 1000);
  const transitionForce = frame.transitionState.phase === "closing" ? frame.transitionState.coverage * .3 : 0;
  const force = Math.min(1, frame.pointerForce * nearby + Math.abs(frame.velocity) * .2 + transitionForce);
  if ((entered || force > .22) && frame.time - state.lastTrigger > profile.duration * .8) {
    state.pulse = 0;
    state.lastTrigger = frame.time;
    state.inertia += entered ? (chapter === "brain" ? 2.3 : 1.2) : force * 2.1;
  }
  const target = force * profile.force;
  state.inertia += (target - state.energy) * 28 * dt;
  state.inertia *= Math.exp(-profile.relaxation * dt);
  state.energy = Math.max(0, Math.min(1, state.energy + state.inertia * dt));
  if (force < .005 && state.energy < .002) state.energy = state.inertia = 0;
  state.pulse = Math.min(2, state.pulse + dt / profile.duration);
}
