"use client";

import { useCallback, useEffect, useRef } from "react";

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    const el = root.current;
    if (!el || el.dataset.state !== "loading") return;
    el.dataset.state = "done";
    el.inert = true;
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.state = "skip";
      el.inert = true;
      return;
    }

    // Keep the already-visible first frame on screen long enough after hydration.
    // A slow device should never jump straight from the opening frame to Home.
    const closeTimer = window.setTimeout(close, Math.max(900, 1500 - performance.now()));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(closeTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return <div className="intro intro-retro" data-state="loading" ref={root}>
    <div className="intro-retro-set">
        <div className="intro-retro-screen">
          <div className="intro-retro-glass" aria-hidden="true" />
          <div className="intro-retro-top" aria-hidden="true">
            <span>AN/OS <span className="intro-retro-led">●</span> 01</span>
            <span>INPUT 01 &nbsp;·&nbsp; 2026</span>
          </div>
          <div className="intro-retro-content">
            <span className="intro-retro-signal" aria-hidden="true">SIGNAL ACQUIRED &nbsp; / &nbsp; 001</span>
            <button className="intro-retro-prompt" type="button" onClick={close}>&gt; PRESS START<span className="intro-retro-caret" aria-hidden="true">_</span></button>
            <strong className="intro-retro-name">Adnan<br />Naous.</strong>
            <span className="intro-retro-tagline">CODE  /  CURIOSITY  /  WORLDS IN PROGRESS</span>
          </div>
          <div className="intro-retro-bottom" aria-hidden="true">
            <span>READY &gt; run portfolio.exe</span>
            <span>● LIVE</span>
          </div>
        </div>
    </div>
    <button className="intro-retro-skip" type="button" onClick={close}>
      SKIP INTRO →
    </button>
  </div>;
}
