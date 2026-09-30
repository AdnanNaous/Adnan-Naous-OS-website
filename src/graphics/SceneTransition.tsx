"use client";

import { useEffect, useRef } from "react";
import { subscribeMotion } from "../motion/runtime";
import "./scene-transition.css";

/** Foreground black material conceals the scene commit; it never intercepts navigation. */
export default function SceneTransition() {
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => subscribeMotion(frame => {
    const node = surface.current;
    if (!node) return;
    const transition = frame.transitionState;
    const coverage = transition.coverage;
    // Smoothstep changes the shutter's acceleration, while the controller retains reversible distance.
    const material = coverage * coverage * (3 - 2 * coverage);
    node.style.setProperty("--occlusion", material.toFixed(5));
    node.dataset.phase = transition.phase;
    node.dataset.direction = String(transition.direction);
    node.dataset.covered = coverage === 1 ? "true" : "false";
    node.dataset.from = transition.from;
    node.dataset.to = transition.to;
    node.dataset.reduced = String(frame.reduced);
  }), []);
  return <div ref={surface} className="scene-transition" data-phase="idle" aria-hidden="true">
    <div className="scene-transition-plane scene-transition-plane--near" />
    <div className="scene-transition-plane scene-transition-plane--far" />
  </div>;
}
