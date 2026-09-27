"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";

const trace = [
  "> select --work",
  "01 index windows-maintenance",
  "02 index personal-portfolio",
] as const;

export function WorkSectionV2() {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const node = track.current;
        if (!node) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(1); return; }
        const rect = node.getBoundingClientRect();
        const travel = Math.max(1, rect.height - innerHeight * .72);
        const next = Math.min(1, Math.max(0, -rect.top / travel));
        setProgress(previous => Math.abs(previous - next) >= .005 || next === 0 || next === 1 ? next : previous);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
  }, []);

  const totalCharacters = trace.reduce((sum, line) => sum + line.length, 0);
  const visibleCharacters = Math.round(progress * totalCharacters);
  const phase = progress === 0 ? "idle" : progress < 1 ? "typing" : "ready";
  const skip = () => document.getElementById("work-projects")?.scrollIntoView({ behavior: "smooth" });

  return <section id="work" className={`content-section work-section work-v2 work-v2-${phase}`} aria-labelledby="work-title">
    <div className="section-head reveal">
      <p className="section-index">02 / SELECTED WORK</p>
      <h2 id="work-title" className="section-title">Built, tested, revised.</h2>
      <p className="section-lead">Two projects in progress. A short index trace introduces them below.</p>
    </div>
    <div className="work-build-track" ref={track}><div className="work-compiler" aria-label="Project index trace">
      <div className="work-command" dir="ltr" lang="en" aria-hidden="true">
        <span className="work-command-kicker">AN.OS / SELECTED WORK</span>
        {trace.map((line, index) => {
          const before = trace.slice(0, index).reduce((sum, item) => sum + item.length, 0);
          const count = Math.min(line.length, Math.max(0, visibleCharacters - before));
          return <code key={line}>{line.slice(0, count)}{phase === "typing" && count < line.length && visibleCharacters >= before && <span className="work-v2-caret">▍</span>}</code>;
        })}
      </div>
      <div className="work-compile-control">
        <span role="status" aria-live="polite">{phase === "ready" ? "Two projects ready" : "Building index"}<span aria-hidden="true"> · {Math.round(progress * 100)}%</span></span>
        <div className="work-v2-actions">
          {phase !== "ready" && <button className="work-v2-skip" type="button" onClick={skip}>Skip to projects ↓</button>}
        </div>
      </div>
      <div className="work-build-progress" role="progressbar" aria-label="Project index build" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${progress * 100}%` }} /></div>
    </div></div>
    <div id="work-projects" className="project-list" inert={phase !== "ready"}>
      {projects.map((project, index) => <article className="project-entry reveal" key={project.slug}>
        <button className="project-trigger" type="button" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
          <span className="project-number">0{index + 1} / {project.category.en}</span>
          <span className="project-main"><strong>{project.title.en}</strong><span>{project.summary.en}</span></span>
          <svg className="project-schematic" viewBox="0 0 170 90" aria-hidden="true"><path d={index === 0 ? "M8 45H48V17H108V45H160M8 61H74V77H138" : "M8 19H58V45H114V72H160M8 71H44V45H87"}/><circle cx={index === 0 ? 108 : 114} cy={index === 0 ? 45 : 72} r="4"/><circle cx="8" cy={index === 0 ? 45 : 19} r="4"/></svg>
          <span className="project-verb">{expanded === index ? "CLOSE −" : "OPEN +"}</span>
        </button>
        <div id={`project-detail-${index}`} className="project-detail" hidden={expanded !== index}>
          <div className="project-detail-grid">{project.sections.map(item => <div key={item.title.en}><h3>{item.title.en}</h3><p>{item.body.en}</p></div>)}</div>
          <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">View code on GitHub ↗</a>
        </div>
      </article>)}
    </div>
  </section>;
}
