"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brainEntries } from "../data/brain";

type BrainWindow = { id: string; slot: number; z: number };

export function BrainSection() {
  const [entered, setEntered] = useState(false);
  const [windows, setWindows] = useState<BrainWindow[]>([]);
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const windowRefs = useRef<Map<string, HTMLElement>>(new Map());
  const nextZ = useRef(1);

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

  const focusWindow = (id: string) => requestAnimationFrame(() => windowRefs.current.get(id)?.focus({ preventScroll: !matchMedia("(max-width: 700px)").matches }));
  const raiseWindow = (id: string) => {
    setWindows(current => current.map(item => item.id === id ? { ...item, z: ++nextZ.current } : item));
  };
  const openWindow = (id: string) => {
    setEntered(true);
    setWindows(current => {
      const existing = current.find(item => item.id === id);
      if (existing) return current.map(item => item.id === id ? { ...item, z: ++nextZ.current } : item);
      const used = new Set(current.map(item => item.slot));
      const slot = id === "archive" ? 0 : [1, 2, 3].find(value => !used.has(value)) ?? 1;
      return [...current, { id, slot, z: ++nextZ.current }];
    });
    focusWindow(id);
  };
  const closeWindow = (id: string) => {
    setWindows(current => {
      const remaining = current.filter(item => item.id !== id);
      const next = [...remaining].sort((a, b) => b.z - a.z)[0];
      requestAnimationFrame(() => (next ? windowRefs.current.get(next.id) : openerRef.current)?.focus({ preventScroll: true }));
      return remaining;
    });
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
      <div className="brain-entry-content">
        <p className="section-index">06 / PERSONAL ARCHIVE</p>
        <h2 id="brain-title" className="section-title">Brain<span className="brain-title-stop">.</span></h2>
        <p className="brain-subtitle">Personal Thought Archive</p>
        <button ref={openerRef} type="button" className="brain-open" onClick={() => openWindow("archive")} aria-controls="brain-workspace" aria-expanded={windows.some(item => item.id === "archive")}>[ Open Archive ] <span aria-hidden="true">↗</span></button>
      </div>
      <span className="brain-entry-code" aria-hidden="true">AN/OS · PUBLIC MEMORY</span>
    </div>

    <div id="brain-workspace" className={`brain-workspace${windows.length ? " has-windows" : ""}`} aria-label="Brain archive windows">
      {windows.length === 0 && <p className="brain-workspace-hint">THREE ENTRIES / 28 SEP 2026</p>}
      {windows.map(item => {
        const isArchive = item.id === "archive";
        const entry = isArchive ? undefined : brainEntries.find(thought => thought.id === item.id);
        if (!isArchive && !entry) return null;
        const titleId = `brain-window-title-${item.id}`;
        return <section
          key={item.id}
          ref={node => { if (node) windowRefs.current.set(item.id, node); else windowRefs.current.delete(item.id); }}
          className={`brain-window brain-window-${isArchive ? "archive" : "thought"} brain-slot-${item.slot}`}
          style={{ zIndex: item.z, order: item.slot }}
          role="region"
          aria-labelledby={titleId}
          tabIndex={0}
          onPointerDown={() => raiseWindow(item.id)}
          onFocusCapture={() => raiseWindow(item.id)}
          onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); closeWindow(item.id); } }}
        >
          <div className="brain-window-bar">
            <span className="brain-window-path">AN/OS / BRAIN / {isArchive ? "ARCHIVE" : entry?.type}</span>
            <button type="button" className="brain-window-close" onClick={() => closeWindow(item.id)} aria-label={`Close ${isArchive ? "Brain Archive" : entry?.title} window`}>×</button>
          </div>
          {isArchive ? <div className="brain-window-body brain-archive-body">
            <div className="brain-window-heading"><p>PUBLIC MEMORY / 2026—</p><h3 id={titleId}>Brain Archive</h3><span>Thoughts kept as they were.</span></div>
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
      })}
    </div>
  </section>;
}
