"use client";

import { useCallback, useEffect, useRef } from "react";

const SESSION_KEY = "an-os-booted";

export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const background = useRef<{ element: HTMLElement; wasInert: boolean }[]>([]);
  const restoreBackground = useCallback(() => {
    background.current.forEach(({ element, wasInert }) => { element.inert = wasInert; });
    background.current = [];
  }, []);
  const close = useCallback(() => {
    const el = root.current;
    if (!el || el.dataset.state === "done") return;
    el.dataset.state = "done";
    el.inert = true;
    restoreBackground();
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* private browsing */ }
    document.documentElement.dataset.anBoot = "done";
    window.dispatchEvent(new Event("an-os-booted"));
    const title = document.getElementById("hero-title");
    if (title) {
      const previousTabIndex = title.getAttribute("tabindex");
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
      title.addEventListener("blur", () => {
        if (previousTabIndex === null) title.removeAttribute("tabindex");
        else title.setAttribute("tabindex", previousTabIndex);
      }, { once: true });
    }
  }, [restoreBackground]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (el.dataset.state === "done" || document.documentElement.dataset.anBoot === "skip" || document.documentElement.dataset.anBoot === "done" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      restoreBackground();
      el.dataset.state = "done";
      el.inert = true;
      document.documentElement.dataset.anBoot = "done";
      window.dispatchEvent(new Event("an-os-booted"));
      return;
    }
    background.current = Array.from(document.querySelectorAll<HTMLElement>("#main, .site-nav, .timeline-rail, .site-footer, .skip-link"))
      .map(element => ({ element, wasInert: element.inert }));
    background.current.forEach(({ element }) => { element.inert = true; });
    if (matchMedia("(min-width: 701px)").matches) {
      el.querySelector<HTMLElement>(".intro-retro-start")?.focus({ preventScroll: true });
    }
    const timers = [
      window.setTimeout(() => { el.dataset.stage = "signal"; }, 760),
      window.setTimeout(() => { el.dataset.stage = "ready"; }, 1530),
      window.setTimeout(close, 3040),
    ];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || el.dataset.state === "done") return;
      const controls = Array.from(el.querySelectorAll<HTMLButtonElement>("button"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", onKeyDown);
      restoreBackground();
    };
  }, [close, restoreBackground]);

  return <>
    <script dangerouslySetInnerHTML={{ __html: 'try{if(sessionStorage.getItem("an-os-booted")==="1")document.documentElement.dataset.anBoot="skip"}catch(e){}' }} />
    <div className="intro intro-retro" data-state="loading" data-stage="memory" ref={root} aria-label="AN/OS startup">
      <div className="intro-retro-frame" aria-hidden="true"><span>AN/OS</span><span>001 / MEMORY ARRAY</span></div>
      <div className="intro-retro-stage" aria-hidden="true">
        <div className="intro-retro-beat intro-retro-beat-memory"><span className="intro-retro-overline">AN / MEMORY ARRAY</span><strong>AN<span>/</span>OS</strong><span className="intro-retro-under">ADNAN NAOUS · 2026</span></div>
        <div className="intro-retro-beat intro-retro-beat-signal"><span className="intro-retro-overline">02 / INPUT FOUND</span><strong>SIGNAL<br />ACQUIRED<span>.</span></strong><span className="intro-retro-under">FOLLOW THE SIGNAL →</span></div>
        <div className="intro-retro-beat intro-retro-beat-ready"><span className="intro-retro-overline">03 / SYSTEM READY</span><strong>PRESS<br />START<span>.</span></strong><span className="intro-retro-under">READY &gt; run portfolio.exe</span></div>
      </div>
      <div className="intro-retro-rail" aria-hidden="true"><i /><i /><i /></div>
      <div className="intro-retro-actions">
        <button type="button" className="intro-retro-start" onClick={close}>START <span aria-hidden="true">↗</span></button>
        <button type="button" className="intro-retro-skip" onClick={close}>SKIP INTRO →</button>
      </div>
      <span className="intro-retro-bottom" aria-hidden="true">AN/OS · BOOT SEQUENCE</span>
    </div>
  </>;
}
