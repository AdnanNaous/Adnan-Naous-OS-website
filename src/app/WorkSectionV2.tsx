"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Language } from "@/data/portfolio";

type Phase = "idle" | "typing" | "ready";
const trace = [
  "> select --work",
  "01 index windows-maintenance",
  "02 index personal-portfolio",
] as const;

export function WorkSectionV2({ lang }: { lang: Language }) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const section = useRef<HTMLElement>(null);
  const started = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState(0);
  const [position, setPosition] = useState({ line: 0, count: 0 });
  const [expanded, setExpanded] = useState<number | null>(null);

  const run = useCallback(() => {
    started.current = true;
    setPosition({ line: 0, count: 0 });
    setRunId(value => value + 1);
    setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "ready" : "typing");
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      started.current = true;
      const reveal = window.setTimeout(() => setPhase("ready"), 0);
      return () => window.clearTimeout(reveal);
    }
    const node = section.current;
    if (!node) return;
    if (!window.IntersectionObserver) {
      const start = window.setTimeout(run, 0);
      return () => window.clearTimeout(start);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !started.current) {
        run();
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: "0px 0px 80px 0px" });
    observer.observe(node);
    // A missed intersection must never leave the project links inaccessible.
    const fallback = window.setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setPhase("ready");
      }
    }, 8000);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [run]);

  useEffect(() => {
    if (phase !== "typing") return;
    let line = 0;
    let count = 0;
    let timeout: number;
    const advance = () => {
      if (count < trace[line].length) {
        count += 1;
        setPosition({ line, count });
        timeout = window.setTimeout(advance, 37);
      } else if (line < trace.length - 1) {
        line += 1;
        count = 0;
        setPosition({ line, count });
        timeout = window.setTimeout(advance, 190);
      } else {
        timeout = window.setTimeout(() => setPhase("ready"), 330);
      }
    };
    timeout = window.setTimeout(advance, 220);
    return () => window.clearTimeout(timeout);
  }, [phase, runId]);

  const skip = () => setPhase("ready");

  return <section id="work" ref={section} className={`content-section work-section work-v2 work-v2-${phase}`} aria-labelledby="work-title">
    <div className="section-head reveal">
      <p className="section-index">02 / {text("SELECTED WORK", "أعمال مختارة")}</p>
      <h2 id="work-title" className="section-title">{text("Built, tested, revised.", "أبني، أجرّب، وأحسّن.")}</h2>
      <p className="section-lead">{text("Two projects in progress. A short index trace introduces them below.", "مشروعان قيد التطوير. تظهر فهرستهما القصيرة ثم تفاصيلهما أدناه.")}</p>
    </div>
    <div className="work-compiler" aria-label={text("Project index trace", "فهرسة المشاريع")}>
      <div className="work-command" dir="ltr" lang="en" aria-hidden="true">
        <span className="work-command-kicker">AN.OS / SELECTED WORK</span>
        {trace.map((line, index) => <code key={line}>{phase === "ready" ? line : phase === "typing" && index <= position.line ? line.slice(0, index === position.line ? position.count : line.length) : ""}{phase === "typing" && index === position.line && <span className="work-v2-caret">▍</span>}</code>)}
      </div>
      <div className="work-compile-control">
        <span role="status" aria-live="polite">{phase === "idle" ? text("Waiting to index", "بانتظار الفهرسة") : phase === "typing" ? text("Indexing two projects…", "تجري فهرسة مشروعين…") : text("Two projects ready", "مشروعان جاهزان")}</span>
        <div className="work-v2-actions">
          {phase === "typing" && <button className="work-v2-skip" type="button" onClick={skip}>{text("Skip animation", "تخطَّ الحركة")}</button>}
          {phase === "ready" && <button className="script-button" type="button" onClick={run}>{text("REPLAY ↻", "أعِد العرض ↻")}</button>}
        </div>
      </div>
    </div>
    <div className="project-list" hidden={phase !== "ready"}>
      {projects.map((project, index) => <article className="project-entry" key={project.slug}>
        <button className="project-trigger" type="button" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
          <span className="project-number">0{index + 1} / {project.category[lang]}</span>
          <span className="project-main"><strong>{project.title[lang]}</strong><span>{project.summary[lang]}</span></span>
          <svg className="project-schematic" viewBox="0 0 170 90" aria-hidden="true"><path d={index === 0 ? "M8 45H48V17H108V45H160M8 61H74V77H138" : "M8 19H58V45H114V72H160M8 71H44V45H87"}/><circle cx={index === 0 ? 108 : 114} cy={index === 0 ? 45 : 72} r="4"/><circle cx="8" cy={index === 0 ? 45 : 19} r="4"/></svg>
          <span className="project-verb">{expanded === index ? text("CLOSE −", "أغلق −") : text("OPEN +", "افتح +")}</span>
        </button>
        <div id={`project-detail-${index}`} className="project-detail" hidden={expanded !== index}>
          <div className="project-detail-grid">{project.sections.map(item => <div key={item.title.en}><h3>{item.title[lang]}</h3><p>{item.body[lang]}</p></div>)}</div>
          <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">{text("View code on GitHub ↗", "شاهد الكود على GitHub ↗")}</a>
        </div>
      </article>)}
    </div>
  </section>;
}
