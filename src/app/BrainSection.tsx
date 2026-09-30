"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brainEntries } from "../data/brain";
import { AskMyBrain } from "./AskMyBrain";
import { setVisualState } from "../graphics/state";

export function BrainSection() {
  const [entered, setEntered] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const windowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setVisualState(activeWindow && activeWindow !== "archive" ? "reading" : null);
    return () => setVisualState(null);
  }, [activeWindow]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.13 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const window = windowRef.current;
    if (!activeWindow || !window || typeof IntersectionObserver === "undefined") return;

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = undefined;
        setIsLeaving(false);
      } else if (!closeTimer) {
        setIsLeaving(true);
        closeTimer = setTimeout(() => setActiveWindow(null), 5000);
      }
    });
    observer.observe(window);
    return () => {
      observer.disconnect();
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [activeWindow]);

  const openWindow = (id: string) => {
    setEntered(true);
    setIsLeaving(false);
    setActiveWindow(id);
    requestAnimationFrame(() => windowRef.current?.focus({ preventScroll: !matchMedia("(max-width: 700px)").matches }));
  };
  const closeWindow = () => {
    setActiveWindow(null);
    setIsLeaving(false);
    requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
  };

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return brainEntries;
    return brainEntries.filter(entry => [entry.title, entry.type, entry.category, entry.date, entry.dateLabel, ...entry.paragraphs]
      .some(value => value.toLocaleLowerCase().includes(term)));
  }, [query]);

  return <section ref={sectionRef} id="brain" className={`content-section brain-section${entered ? " is-entered" : ""}`} aria-labelledby="brain-title">
    <div className="brain-entry">
      <span className="brain-seam brain-seam-left" aria-hidden="true" />
      <span className="brain-seam brain-seam-right" aria-hidden="true" />
      <svg className="brain-memory-trace" viewBox="0 0 700 280" preserveAspectRatio="none" aria-hidden="true"><path d="M64 208 188 132 328 175 464 82 636 151"/><circle cx="64" cy="208" r="3"/><circle cx="188" cy="132" r="3"/><circle cx="328" cy="175" r="3"/><circle cx="464" cy="82" r="3"/><circle cx="636" cy="151" r="3"/></svg>
      <div className="brain-entry-content">
        <span className="brain-entry-signal" aria-hidden="true">ENTERING MEMORY ARRAY</span>
        <p className="section-index">02 / PERSONAL ARCHIVE</p>
        <h2 id="brain-title" className="section-title">Brain<span className="brain-title-stop">.</span></h2>
        <p className="brain-subtitle">Personal Thought Archive</p>
        <button ref={openerRef} type="button" className="brain-open" onClick={() => openWindow("archive")} aria-controls="brain-workspace" aria-expanded={activeWindow !== null}>[ Open Archive ] <span aria-hidden="true">↗</span></button>
      </div>
      <span className="brain-entry-code" aria-hidden="true">AN/OS · PUBLIC MEMORY</span>
    </div>

    <div id="brain-workspace" className={`brain-workspace${activeWindow ? " has-windows" : ""}`} aria-label="Brain archive window">
      {!activeWindow && <p className="brain-workspace-hint">THREE ENTRIES / 28 SEP 2026</p>}
      {activeWindow && (() => {
        const isArchive = activeWindow === "archive";
        const entry = isArchive ? undefined : brainEntries.find(thought => thought.id === activeWindow);
        if (!isArchive && !entry) return null;
        const titleId = `brain-window-title-${activeWindow}`;
        return <section
          key={activeWindow}
          ref={windowRef}
          className={`brain-window brain-window-${isArchive ? "archive" : "thought"}${isLeaving ? " is-leaving" : ""}`}
          role="region"
          aria-labelledby={titleId}
          tabIndex={0}
          onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); closeWindow(); } }}
        >
          <div className="brain-window-bar">
            <span className="brain-window-path">AN/OS / BRAIN / {isArchive ? "ARCHIVE" : entry?.type}</span>
            {!isArchive && <button type="button" className="brain-window-back" onClick={() => openWindow("archive")}>← Archive</button>}
            <button type="button" className="brain-window-close" onClick={closeWindow} aria-label={`Close ${isArchive ? "Brain Archive" : entry?.title} window`}>×</button>
          </div>
          {isArchive ? <div className="brain-window-body brain-archive-body">
            <div className="brain-window-heading"><p>PUBLIC MEMORY / 2026—</p><h3 id={titleId}>Brain Archive</h3><span>Thoughts kept as they were.</span></div>
            <AskMyBrain onOpenSource={openWindow} />
            <label className="brain-search-label" htmlFor="brain-search">SEARCH ARCHIVE</label>
            <input id="brain-search" className="brain-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search thoughts, text, labels, dates…" autoComplete="off" />
            <p className="brain-result-count" role="status">{matches.length} {matches.length === 1 ? "ENTRY" : "ENTRIES"} FOUND</p>
            <div className="brain-entries">
              {matches.map(thought => <button type="button" key={thought.id} className="brain-entry-row" onClick={() => openWindow(thought.id)}>
                <span className="brain-entry-row-index">{String(brainEntries.indexOf(thought) + 1).padStart(2, "0")}</span>
                <span className="brain-entry-row-main"><strong>{thought.title}</strong><small>{thought.dateLabel} · {thought.type} / {thought.category}</small></span>
                <span aria-hidden="true">↗</span>
              </button>)}
              {matches.length === 0 && <p className="brain-no-results">No thoughts match “{query}”.</p>}
            </div>
          </div> : entry && <div className="brain-window-body brain-thought-body">
            <p className="brain-thought-meta"><time dateTime={entry.date}>{entry.dateLabel}</time> · {entry.type} / {entry.category}</p>
            <h3 id={titleId}>{entry.title}</h3>
            <div className="brain-thought-copy">{entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <p className="brain-thought-end">END OF ENTRY / {entry.date}</p>
          </div>}
        </section>;
      })()}
    </div>
  </section>;
}
