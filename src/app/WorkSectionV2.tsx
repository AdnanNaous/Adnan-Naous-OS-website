"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import { getSectionProgress, subscribeMotion } from "@/motion/runtime";

const trace = [
  "> select --work",
  "01 index windows-maintenance",
  "02 index personal-portfolio",
  "03 index learning-journey",
] as const;

const motifs = ["diagnostic", "viewport", "chronology"] as const;

function ProjectMotif({ index }: { index: number }) {
  if (index === 0) return <div className="work-motif work-motif-diagnostic" aria-hidden="true"><span>CHECK</span><span>CLEAN</span><span>REPAIR</span><span>REPORT</span><i /></div>;
  if (index === 1) return <div className="work-motif work-motif-viewport" aria-hidden="true"><span>AN/OS</span><b>01</b><i /><em>VIEWPORT / INTERFACE</em></div>;
  return <div className="work-motif work-motif-chronology" aria-hidden="true"><span>STUDY</span><span>TRY</span><span>CORRECT</span><span>BUILD</span></div>;
}

export function WorkSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => subscribeMotion(frame => {
    const next = frame.reduced ? 1 : Math.min(1, Math.max(0, getSectionProgress("work", .65) * 2.3));
    setProgress(previous => Math.abs(previous - next) > .016 || next === 0 || next === 1 ? next : previous);
  }), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const records = Array.from(section.querySelectorAll<HTMLElement>(".project-entry"));
    const visible = new Set<Element>();
    const updateActivity = () => {
      section.dataset.motionActive = String(visible.has(section) && !document.hidden);
      records.forEach(record => { record.dataset.recordActive = String(visible.has(record) && !document.hidden); });
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible.add(entry.target);
          if (entry.target !== section) (entry.target as HTMLElement).dataset.recordArrived = "true";
        } else visible.delete(entry.target);
      });
      updateActivity();
    }, { threshold: .08 });
    observer.observe(section);
    records.forEach(record => observer.observe(record));
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, []);

  const totalCharacters = trace.reduce((sum, line) => sum + line.length, 0);
  const visibleCharacters = Math.round(progress * totalCharacters);

  function toggle(index: number) {
    setExpanded(current => current === index ? null : index);
  }

  return <section ref={sectionRef} id="work" className={`content-section work-section work-v2${progress > .05 ? " is-indexing" : ""}${progress >= .95 ? " is-indexed" : ""}`} aria-labelledby="work-title">
    <div className="section-head reveal">
      <p className="section-index">03 / SELECTED WORK</p>
      <h2 id="work-title" className="section-title">Built, tested, revised.</h2>
      <p className="section-lead">Three projects in progress. Open a dossier to see what each one is becoming.</p>
    </div>
    <div className="work-build-track"><div className="work-compiler">
      <div className="work-command" dir="ltr" lang="en" aria-hidden="true">
        <span className="work-command-kicker">AN.OS / SELECTED WORK</span>
        {trace.map((line, index) => {
          const before = trace.slice(0, index).reduce((sum, item) => sum + item.length, 0);
          const count = Math.min(line.length, Math.max(0, visibleCharacters - before));
          return <code key={line}>{line.slice(0, count)}{progress < 1 && count < line.length && visibleCharacters >= before && <span className="work-v2-caret">▍</span>}</code>;
        })}
      </div>
      <div className="work-index-figure" aria-hidden="true"><span className="work-index-orbit work-index-orbit-a"/><span className="work-index-orbit work-index-orbit-b"/><span className="work-index-orbit work-index-orbit-c"/><b>03</b><small>ACTIVE RECORDS</small></div>
      <div className="work-compile-control"><span>INDEX / {String(Math.round(progress * 100)).padStart(3, "0")}%</span><a href="#work-projects">Explore projects ↓</a></div>
      <div className="work-build-progress" aria-hidden="true"><span style={{ width: `${progress * 100}%` }} /></div>
    </div></div>
    <div id="work-projects" className="project-list">
      {projects.map((project, index) => <article className={`project-entry project-entry-${motifs[index]}${expanded === index ? " is-open" : ""}`} key={project.slug} style={{ "--build-order": index } as React.CSSProperties}>
        <button className="project-trigger" type="button" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => toggle(index)}>
          <span className="project-number">0{index + 1} / {project.category.en}</span>
          <span className="project-main"><strong>{project.title.en}</strong><span>{project.summary.en}</span></span>
          <ProjectMotif index={index} />
          <span className="project-verb">{expanded === index ? "CLOSE −" : "OPEN DOSSIER ↗"}</span>
        </button>
        <div id={`project-detail-${index}`} className="project-detail" hidden={expanded !== index}>
          <div className="project-dossier-heading"><span>AN/OS / WORK / 0{index + 1}</span><strong>{project.title.en}</strong><span>{project.category.en}</span></div>
          <div className="project-dossier-content"><ProjectMotif index={index} /><div className="project-detail-grid">{project.sections.map(item => <div key={item.title.en}><h3>{item.title.en}</h3><p>{item.body.en}</p></div>)}<a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">View code on GitHub ↗</a></div></div>
        </div>
      </article>)}
    </div>
  </section>;
}
