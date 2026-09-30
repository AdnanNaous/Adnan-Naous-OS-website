"use client";

import { useEffect, useRef } from "react";
import "./visual-engine.css";

export default function VisualEngine() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const ready = () => window.dispatchEvent(new Event("portfolio-scene-ready"));
    import("./engine").then(({ mountEngine }) => {
      if (disposed || !host.current || !canvas.current) return;
      try { cleanup = mountEngine(host.current, canvas.current); }
      catch { host.current.dataset.fallback = "true"; }
      ready();
    }).catch(() => { if (!disposed && host.current) { host.current.dataset.fallback = "true"; ready(); } });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <div ref={host} className="live-world visual-engine" data-chapter="home" data-state="home" aria-hidden="true"><canvas ref={canvas} /></div>;
}
