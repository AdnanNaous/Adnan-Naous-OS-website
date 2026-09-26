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

    const start = performance.now();
    let sceneReady = document.querySelector(".live-world")?.getAttribute("data-ready") === "true";
    let fontReady = false;
    let closed = false;
    let closeTimer: ReturnType<typeof setTimeout>;
    const complete = () => {
      if (closed || !sceneReady || !fontReady) return;
      closeTimer = setTimeout(() => {
        if (!closed) el.dataset.state = "done";
      }, Math.max(0, 1600 - (performance.now() - start)));
    };
    const onSceneReady = () => { sceneReady = true; complete(); };
    addEventListener("portfolio-scene-ready", onSceneReady);
    document.fonts.ready.then(() => { fontReady = true; complete(); });
    const failSafe = setTimeout(() => { if (!closed) el.dataset.state = "done"; }, 4500);
    return () => {
      closed = true;
      removeEventListener("portfolio-scene-ready", onSceneReady);
      clearTimeout(closeTimer);
      clearTimeout(failSafe);
    };
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
