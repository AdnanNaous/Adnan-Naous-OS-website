"use client";

import { useEffect, useRef } from "react";

/** Sparse live notation tied to the same scroll input as the 3D scene. */
export default function TechField() {
  const root = useRef<HTMLDivElement>(null);
  const phase = useRef<HTMLOutputElement>(null);
  const vector = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const host = root.current;
    const display = phase.current;
    if (!host || !display) return;
    let frame = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const progress = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
        display.textContent = progress.toFixed(3);
        if (vector.current) vector.current.textContent = Math.sin(progress * Math.PI * 2).toFixed(3);
        host.style.setProperty("--tech-travel", `${reduced ? 0 : Math.round(progress * -95)}px`);
        host.style.setProperty("--tech-turn", `${reduced ? 0 : Math.round(progress * 22)}deg`);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="tech-field" ref={root} aria-hidden="true">
    <svg className="tech-orbit" viewBox="0 0 600 600" fill="none">
      <circle cx="300" cy="300" r="252" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 12" />
      <ellipse cx="300" cy="300" rx="275" ry="122" transform="rotate(-27 300 300)" stroke="currentColor" strokeWidth=".75" />
      <path d="M300 20v64m0 432v64M20 300h64m432 0h64" stroke="currentColor" strokeWidth="1" />
      <path d="M292 300h16m-8-8v16" stroke="currentColor" strokeWidth=".8" />
      <circle cx="514" cy="158" r="3" fill="currentColor" />
    </svg>
    <div className="tech-script tech-script-a"><span>AN / ORBITAL STUDY</span><code>r = 3.15<br/>x = r · cos θ<br/>y = r · sin θ</code></div>
    <div className="tech-script tech-script-b"><span>SCROLL PHASE</span><code>φ = <output ref={phase}>0.000</output><br/>Δscene = f(φ)</code></div>
    <div className="tech-script tech-script-c"><span>VECTOR / LIVE</span><code>v(φ) = sin(2πφ)<br/>v = <output ref={vector}>0.000</output><br/>∂signal / ∂time</code></div>
  </div>;
}
