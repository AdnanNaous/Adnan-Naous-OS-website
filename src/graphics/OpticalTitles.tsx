"use client";

import { useEffect, useRef } from "react";
import "./optical-titles.css";

/** Accessible headings remain in the DOM. The GPU only replaces their painted glyphs. */
export default function OpticalTitles() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let disposed = false;
    let release: (() => void) | undefined;
    import("./optics/renderer").then(({ mountOpticalTitles }) => {
      if (!disposed && canvas.current) release = mountOpticalTitles(canvas.current);
    }).catch(() => { /* The ordinary DOM titles are already the fallback. */ });
    return () => { disposed = true; release?.(); };
  }, []);
  return <canvas ref={canvas} className="optical-titles" aria-hidden="true" />;
}
