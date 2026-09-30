"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brainEntries } from "../data/brain";
import { AskMyBrain } from "./AskMyBrain";
import { setVisualState } from "../graphics/state";

export function BrainSection() {
  const [entered, setEntered] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const archiveRef = useRef<HTMLElement>(null);
  const thoughtRef = useRef<HTMLElement>(null);
  const lastEntryRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const thought = thoughtRef.current;
    setVisualState(null);
    if (!activeId || !thought) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisualState(entry.isIntersecting ? "reading" : null);
    }, { threshold: 0.08 });
    observer.observe(thought);
    return () => {
      observer.disconnect();
      setVisualState(null);
    };
  }, [activeId]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const node = activeId ? thoughtRef.current : archiveRef.current;
    node?.focus({ preventScroll: true });
    if (matchMedia("(max-width: 700px)").matches) node?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [open, activeId]);

  const matches = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return brainEntries;
    return brainEntries.filter(entry => [entry.title, entry.type, entry.category, entry.date, entry.dateLabel, ...entry.paragraphs]
      .some(value => value.toLocaleLowerCase().includes(term)));
  }, [query]);
  const activeEntry = brainEntries.find(entry => entry.id === activeId);

  function openThought(id: string) {
    lastEntryRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    setOpen(true);
    setActiveId(id);
  }

  function backToArchive() {
    setActiveId(null);
    requestAnimationFrame(() => lastEntryRef.current?.focus({ preventScroll: true }));
  }

  function closeArchive() {
    setActiveId(null);
    setOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
  }

  return <section ref={sectionRef} id="brain" className={`content-section brain-section${entered ? " is-entered" : ""}${activeId ? " is-reading" : ""}`} aria-labelledby="brain-title">
    <div className="brain-entry">
      <span className="brain-seam brain-seam-left" aria-hidden="true" />
      <span className="brain-seam brain-seam-right" aria-hidden="true" />
      <div className="brain-depth-word" aria-hidden="true">MEMORY</div>
      <svg className="brain-memory-trace" viewBox="0 0 700 280" preserveAspectRatio="none" aria-hidden="true"><path d="M64 208 188 132 328 175 464 82 636 151"/><circle cx="64" cy="208" r="3"/><circle cx="188" cy="132" r="3"/><circle cx="328" cy="175" r="3"/><circle cx="464" cy="82" r="3"/><circle cx="636" cy="151" r="3"/></svg>
      <div className="brain-entry-content">
        <span className="brain-entry-signal" aria-hidden="true">ENTERING MEMORY ARRAY</span>
        <p className="section-index">02 / PERSONAL ARCHIVE</p>
        <h2 id="brain-title" className="section-title">Brain<span className="brain-title-stop">.</span></h2>
        <p className="brain-subtitle">Personal Thought Archive</p>
        <button ref={openerRef} type="button" className="brain-open" onClick={() => setOpen(true)} aria-controls="brain-workspace" aria-expanded={open}>[ Open Archive ] <span aria-hidden="true">↗</span></button>
      </div>
      <span className="brain-entry-code" aria-hidden="true">AN/OS · PUBLIC MEMORY</span>
    </div>

    <div id="brain-workspace" className={`brain-workspace${open ? " has-windows" : ""}${activeEntry ? " has-thought" : ""}`}>
      {!open ? <p className="brain-workspace-hint">{String(brainEntries.length).padStart(2, "0")} ENTRIES / PUBLIC MEMORY</p> : <>
        <div className="brain-workspace-architecture" aria-hidden="true"><span>INDEX</span><span>RETRIEVAL</span><span>READING</span></div>
        <section ref={archiveRef} className="brain-window brain-window-archive" role="region" aria-labelledby="brain-archive-title" tabIndex={-1} inert={Boolean(activeEntry)} onKeyDown={event => { if (event.key === "Escape" && !activeId) { event.stopPropagation(); closeArchive(); } }}>
          <div className="brain-window-bar"><span className="brain-window-path">AN/OS / BRAIN / ARCHIVE</span><button type="button" className="brain-window-close" onClick={closeArchive} aria-label="Close Brain Archive">×</button></div>
          <div className="brain-window-body brain-archive-body">
            <div className="brain-window-heading"><p>PUBLIC MEMORY / 2026—</p><h3 id="brain-archive-title">Brain Archive</h3><span>Thoughts kept as they were.</span></div>
            <AskMyBrain onOpenSource={openThought} />
            <label className="brain-search-label" htmlFor="brain-search">SEARCH ARCHIVE</label>
            <input id="brain-search" className="brain-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search thoughts, text, labels, dates…" autoComplete="off" />
            <p className="brain-result-count" role="status">{matches.length} {matches.length === 1 ? "ENTRY" : "ENTRIES"} FOUND</p>
            <div className="brain-entries">
              {matches.map(thought => <button type="button" key={thought.id} className="brain-entry-row" onClick={() => openThought(thought.id)}>
                <span className="brain-entry-row-index">{String(brainEntries.indexOf(thought) + 1).padStart(2, "0")}</span>
                <span className="brain-entry-row-main"><strong>{thought.title}</strong><small>{thought.dateLabel} · {thought.type} / {thought.category}</small></span>
                <span aria-hidden="true">↗</span>
              </button>)}
              {matches.length === 0 && <p className="brain-no-results">No thoughts match “{query}”.</p>}
            </div>
          </div>
        </section>
        {activeEntry && <section key={activeEntry.id} ref={thoughtRef} className="brain-window brain-window-thought" role="region" aria-labelledby="brain-thought-title" tabIndex={-1} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); backToArchive(); } }}>
          <div className="brain-window-bar"><span className="brain-window-path">AN/OS / BRAIN / {activeEntry.type}</span><button type="button" className="brain-window-back" onClick={backToArchive}>← Archive</button><button type="button" className="brain-window-close" onClick={closeArchive} aria-label={`Close ${activeEntry.title} and archive`}>×</button></div>
          <div className="brain-window-body brain-thought-body">
            <p className="brain-thought-meta"><time dateTime={activeEntry.date}>{activeEntry.dateLabel}</time> · {activeEntry.type} / {activeEntry.category}</p>
            <h3 id="brain-thought-title">{activeEntry.title}</h3>
            <div className="brain-thought-copy">{activeEntry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <p className="brain-thought-end">END OF ENTRY / {activeEntry.date}</p>
          </div>
        </section>}
      </>}
    </div>
  </section>;
}
