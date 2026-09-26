"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import HeroTree from "./HeroTree";

export default function HeroWorld() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let visible = true;
    let pointerX = 0, pointerY = 0;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      element.style.setProperty("--scene-x", `${pointerX * 18}px`);
      element.style.setProperty("--scene-y", `${pointerY * 12}px`);
      element.style.setProperty("--scene-scroll", `${Math.max(-62, Math.min(0, -scrollY * .075))}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPointer = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX / innerWidth - .5;
      pointerY = event.clientY / innerHeight - .5;
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); }, { threshold: 0 });
    observer.observe(element);
    addEventListener("pointermove", onPointer, {passive:true});
    addEventListener("scroll", schedule, {passive:true});
    addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("pointermove", onPointer);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return <div className="hero-world" ref={root} aria-hidden="true">
    <Image className="hero-landscape" src="/art/alien-estuary.webp" alt="" fill priority sizes="100vw"/>
    <div className="hero-atmosphere"/>
    <div className="hero-tree-placement"><HeroTree/></div>
    <div className="hero-ground-haze"/>
    <div className="hero-embers">{Array.from({length:15},(_,i)=><i key={i} style={{"--seed":i,"--x":`${46 + i * 3.1}%`,"--y":`${25 + (i * 13) % 49}%`} as React.CSSProperties}/>)}</div>
  </div>;
}
