"use client";

import { useEffect, useRef } from "react";

export default function Intro({ ar }: { ar: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.state = "skip";
      return;
    }

    // The scan lasts 1.5s in CSS. Start fading at a fixed point so loading
    // fonts or the decorative WebGL scene cannot hold the page behind the intro.
    const closeTimer = setTimeout(() => { el.dataset.state = "done"; }, 1600);
    return () => clearTimeout(closeTimer);
  }, []);

  return <div className="intro" data-state="loading" ref={root} aria-hidden="true">
    <div className="intro-center">
      <span className="intro-index">AN / 2026</span>
      <strong className="intro-title">{ar ? "شيء جديد قيد التكوين" : "Something is taking shape."}</strong>
      <div className="intro-rule" />
      <span className="intro-note">{ar ? "تهيئة المشهد" : "INITIALIZING SCENE"}</span>
    </div>
  </div>;
}
