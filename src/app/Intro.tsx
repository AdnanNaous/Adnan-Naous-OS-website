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

    // The page opens on a fixed clock, independent of fonts, WebGL, or CSS events.
    const closeTimer = window.setTimeout(() => { el.dataset.state = "done"; }, 1750);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") el.dataset.state = "done";
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(closeTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return <div className="intro intro-retro" data-state="loading" ref={root}>
    <div className="intro-retro-halo" aria-hidden="true" />
    <div className="intro-retro-set">
      <div className="intro-retro-bezel">
        <div className="intro-retro-screen">
          <div className="intro-retro-top" aria-hidden="true">
            <span>AN/OS <span className="intro-retro-led">●</span> 01</span>
            <span>CH 01 / 2026</span>
          </div>
          <div className="intro-retro-content">
            <button className="intro-retro-prompt" type="button" onClick={() => { if (root.current) root.current.dataset.state = "done"; }}>&gt; {ar ? "اضغط للبدء" : "PRESS START"}<span className="intro-retro-caret" aria-hidden="true">_</span></button>
            <strong className="intro-retro-name">{ar ? <>عدنان<br />نعوس.</> : <>Adnan<br />Naous.</>}</strong>
            <span className="intro-retro-tagline">{ar ? "برمجة • فضول • عوالم قيد البناء" : "CODE  /  CURIOSITY  /  WORLDS IN PROGRESS"}</span>
          </div>
          <div className="intro-retro-bottom" aria-hidden="true">
            <span>READY &gt; run portfolio.exe</span>
            <span>● REC</span>
          </div>
        </div>
      </div>
      <div className="intro-retro-chassis" aria-hidden="true">
        <span>ADNAN NAOUS / PERSONAL COMPUTER</span>
        <span className="intro-retro-controls"><i /><i /><i /></span>
      </div>
    </div>
    <button className="intro-retro-skip" type="button" onClick={() => { if (root.current) root.current.dataset.state = "done"; }}>
      {ar ? "تخطّ المقدمة ←" : "SKIP INTRO →"}
    </button>
  </div>;
}
