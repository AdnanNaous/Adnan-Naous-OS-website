"use client";

import { useEffect, useRef } from "react";

export default function Intro({ ar }: { ar: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "skip";
      return;
    }

    let cancelled = false;
    let closeTimer: ReturnType<typeof setTimeout>;
    el.dataset.visible = "true";
    const start = performance.now();
    const image = new Image();
    image.src = "/art/ivory-tree.webp";
    const ready = Promise.allSettled([document.fonts.ready, image.decode()]);
    const finish = () => {
      if (cancelled) return;
      el.dataset.visible = "done";
    };
    const failSafe = setTimeout(finish, 6500);
    ready.then(() => {
      if (cancelled) return;
      closeTimer = setTimeout(finish, Math.max(0, 2600 - (performance.now() - start)));
    });
    return () => { cancelled = true; clearTimeout(closeTimer); clearTimeout(failSafe); };
  }, []);

  return <div className="intro signal-intro" ref={root} aria-hidden="true">
    <div className="intro-shutter"/>
    <div className="intro-center">
      <span className="intro-overline">AN / FIELD NOTES · 2026</span>
      <div className="intro-orbit"><i/><i/><i/><b/></div>
      <span className="intro-word">{ar ? "إشارة جديدة" : "A new signal"}</span>
      <div className="intro-line"/>
      <span className="intro-loading">{ar ? "تحميل المشهد والمواد" : "LOADING SCENE & MATERIALS"}</span>
      <span className="intro-footnote">{ar ? "استعد للاستكشاف" : "PREPARE TO EXPLORE"}</span>
    </div>
  </div>;
}
