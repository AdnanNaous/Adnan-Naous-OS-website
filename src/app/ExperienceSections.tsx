"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { contact, copy, socials } from "@/data/portfolio";
import { getRangeProgress, subscribeMotion } from "@/motion/runtime";
import ContactIncident from "./ContactIncident";

const objectives = [
  { code: "LEARN", title: "Build a strong foundation in computer science and AI.", note: "University study, Java practice, and experiments." },
  { code: "MAKE", title: "Turn what I learn into useful software.", note: "Real projects, tested and revised in public." },
  { code: "CONTRIBUTE", title: "Grow into a role where I can help a team ship better work.", note: "Looking for an internship or junior opportunity." },
];

export function CodexSection() {
  const section = useRef<HTMLElement>(null);
  const cycleElapsed = useRef(0);
  const pointerEngaged = useRef(false);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [engaged, setEngaged] = useState(false);
  useEffect(() => {
    let lastVisible = false;
    let lastReduced = false;
    return subscribeMotion(frame => {
      const nextVisible = frame.chapter === "codex" && !document.hidden;
      if (nextVisible !== lastVisible) { lastVisible = nextVisible; setVisible(nextVisible); }
      if (frame.reduced !== lastReduced) { lastReduced = frame.reduced; setReduced(frame.reduced); }
      section.current?.style.setProperty("--codex-travel", frame.reduced ? "0" : getRangeProgress(section.current, .8, .2).toFixed(4));
    });
  }, []);
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden && document.documentElement.dataset.chapter === "codex");
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    cycleElapsed.current = 0;
    section.current?.style.setProperty("--codex-cycle", "0");
  }, [selected]);
  useEffect(() => {
    if (!visible || !playing || reduced || engaged) return;
    // The shared clock advances only while this record is being viewed. Hover,
    // keyboard focus, tab visibility and manual pause retain the reading phase.
    return subscribeMotion(frame => {
      if (document.hidden || frame.chapter !== "codex" || frame.reduced || frame.quiet) return;
      cycleElapsed.current += frame.delta;
      if (cycleElapsed.current >= 6000) {
        cycleElapsed.current = 0;
        setSelected(index => (index + 1) % objectives.length);
      }
      section.current?.style.setProperty("--codex-cycle", (cycleElapsed.current / 6000).toFixed(4));
    }, { continuous: true });
  }, [visible, playing, reduced, engaged]);
  const objective = objectives[selected];
  return <section ref={section} id="codex" data-objective={selected} className={`content-section codex-section${visible ? " is-live" : ""}${playing && !engaged && !reduced ? " is-playing" : ""}`} aria-labelledby="codex-title">
    <div className="codex-top reveal"><p className="section-index">05 / CODEX · LONG GAME</p><h2 id="codex-title" className="section-title">The long game.</h2><p className="section-lead">A working log of the direction I’m taking, not a finished checklist.</p></div>
    <div className="codex-console reveal" onMouseEnter={() => { pointerEngaged.current = true; setEngaged(true); }} onMouseLeave={event => { pointerEngaged.current = false; setEngaged(event.currentTarget.contains(document.activeElement)); }} onFocus={() => setEngaged(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(pointerEngaged.current); }}>
      <div className="codex-console-head"><span>AN / LONG-RANGE RECORD</span><button type="button" className="codex-play" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "Ⅱ Pause cycle" : "▷ Resume cycle"}</button></div>
      <div className="codex-console-body"><ol className="codex-menu">{objectives.map((item, index) => <li key={item.code}><button type="button" className={selected === index ? "is-selected" : ""} onClick={() => { setSelected(index); setPlaying(false); }} aria-pressed={selected === index} aria-label={`0${index + 1}: ${item.title}`}><span>0{index + 1} / CHAPTER</span><strong>{item.code}</strong><span className="codex-menu-arrow" aria-hidden="true">↗</span></button></li>)}</ol>
        <div className="codex-detail" key={selected}><span className="codex-word" aria-hidden="true">{objective.code}</span><div className="codex-detail-copy"><span className="codex-status">CHAPTER 0{selected + 1} / 03</span><strong>{objective.title}</strong><p>{objective.note}</p><small>A direction I keep working toward.</small></div></div>
      </div><div className="codex-trajectory" aria-hidden="true"><span>FOUNDATION</span><span>USEFUL SOFTWARE</span><span>CONTRIBUTION</span><i /></div>
    </div>
  </section>;
}

const storyLabels = ["THE FIRST PATH", "THE TURN", "THE FIRST BUILD", "THE THREAD"];
const storyCoordinates = ["2023 / MEDICINE", "2025 / COMPUTING", "BUILD / ADNAN OS", "NOW / KEEP GOING"];

export function AboutSection() {
  const section = useRef<HTMLElement>(null);
  const jumpToChapter = useRef<(index: number, focus?: boolean) => void>(() => {});
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const track = node.querySelector<HTMLElement>(".story-track");
    if (!track) return;
    const chapters = Array.from(node.querySelectorAll<HTMLElement>(".story-chapter"));
    const links = Array.from(node.querySelectorAll<HTMLAnchorElement>(".story-chapter-nav a"));
    const count = node.querySelector<HTMLElement>(".story-count-current");
    let enhanced = false;
    const render = (progress: number, reduced: boolean) => {
      const position = Math.min(chapters.length - .00001, progress * chapters.length);
      const current = Math.floor(position);
      node.dataset.storyCurrent = String(current + 1);
      node.style.setProperty("--story-progress", progress.toFixed(4));
      if (count) count.textContent = String(current + 1).padStart(2, "0");
      chapters.forEach((chapter, index) => {
        chapter.dataset.current = String(index === current);
        // Exactly one paragraph is visible; no overlapping text or empty frame.
        if (reduced) { chapter.removeAttribute("aria-hidden"); chapter.inert = false; }
        else { chapter.setAttribute("aria-hidden", String(index !== current)); chapter.inert = index !== current; }
        links[index]?.setAttribute("data-current", String(index === current));
        if (index === current) links[index]?.setAttribute("aria-current", "step");
        else links[index]?.removeAttribute("aria-current");
      });
    };
    jumpToChapter.current = (index, focus = false) => {
      const chapter = chapters[index];
      if (!chapter) return;
      if (!enhanced) { chapter.scrollIntoView({ behavior: "instant", block: "start" }); }
      else {
        // Only explicit links move scroll. Wheel, touch, keys and reverse scroll
        // remain native; the runtime owns the scroll clock and cached ranges.
        const rect = track.getBoundingClientRect();
        const distance = Math.max(1, rect.height - window.innerHeight * .86);
        const progress = (index + .15) / chapters.length;
        render(progress, false);
        window.scrollTo({ top: rect.top + window.scrollY - window.innerHeight * .14 + distance * progress, behavior: "instant" });
      }
      if (focus) chapter.focus({ preventScroll: true });
    };
    const hashChapter = () => {
      const index = chapters.findIndex(chapter => `#${chapter.id}` === window.location.hash);
      if (index >= 0) jumpToChapter.current(index);
    };
    let initialHashHandled = false;
    const unsubscribe = subscribeMotion(frame => {
      enhanced = !frame.reduced;
      node.dataset.storyMotion = frame.reduced ? "reduced" : "active";
      node.dataset.storyQuiet = String(frame.quiet || document.hidden || frame.chapter !== "about");
      const progress = frame.reduced
        ? chapters.reduce((current, chapter, index) => getRangeProgress(chapter, .5, .5) >= .5 ? index / chapters.length : current, 0)
        : getRangeProgress(track, .14, 1);
      render(progress, frame.reduced);
      if (!initialHashHandled) { initialHashHandled = true; hashChapter(); }
    });
    window.addEventListener("hashchange", hashChapter);
    return () => {
      unsubscribe();
      window.removeEventListener("hashchange", hashChapter);
      jumpToChapter.current = () => {};
      delete node.dataset.storyMotion;
      chapters.forEach(chapter => { chapter.removeAttribute("aria-hidden"); chapter.inert = false; });
    };
  }, []);
  const navigate = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(window.history.state, "", `#story-chapter-${index + 1}`);
    jumpToChapter.current(index, event.detail === 0);
  };
  return <section ref={section} id="about" className="content-section about-section" aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">06 / BACKGROUND</p><h2 id="about-title" className="section-title">How I got here.</h2><p className="section-lead">The field changed. The curiosity stayed.</p></div>
    <div className="story-track"><div className="story-stage">
    <nav className="story-chapter-nav" aria-label="Story chapters">
      {storyLabels.map((label, index) => <a key={label} href={`#story-chapter-${index + 1}`} onClick={event => navigate(event, index)} aria-label={`Read chapter ${index + 1}: ${label}`}><span>0{index + 1}</span><span>{label}</span><span aria-hidden="true">↓</span></a>)}
    </nav>
    <div className="story-frame"><div className="story-frame-head" aria-hidden="true"><span>06 / BACKGROUND</span><span className="story-count"><span className="story-count-current">01</span> / {String(copy.en.story.length).padStart(2, "0")}</span></div>
    <div className="story-environment" aria-hidden="true">
      <div className="story-environment-code">{[
        "const origin = 'medicine';", "observe(signal);", "if (curious) keepBuilding();",
        "commit('learn by making');", "const route = ['learn', 'make'];", "return usefulSoftware;",
      ].map(line => <span key={line}>{line}</span>)}</div>
      <svg viewBox="0 0 600 70" preserveAspectRatio="none"><path pathLength="1" d="M0 35H80L100 35L117 15L133 55L150 5L171 65L192 35H257L283 35L308 25L331 35H400L430 35L445 15L468 55L489 35H600"/></svg>
    </div>
    <div className="story-chapters">{copy.en.story.map((beat, index) => <article id={`story-chapter-${index + 1}`} className="story-chapter" key={storyLabels[index]} aria-labelledby={`story-heading-${index + 1}`} tabIndex={-1}>
      <div className="story-chapter-heading"><h3 id={`story-heading-${index + 1}`} className="story-marker">0{index + 1} / {storyLabels[index]}</h3><span className="story-coordinate">{storyCoordinates[index]}</span></div><p>{beat}</p>
    </article>)}</div><div className="story-frame-foot" aria-hidden="true"><span>THE CURIOSITY STAYED.</span><span>↓</span></div><div className="story-progress" aria-hidden="true"><i /></div></div>
    </div></div>
    <div className="about-actions reveal"><button className="command-action command-action-quiet cv-command" type="button" onClick={() => window.dispatchEvent(new CustomEvent("an-os-open-terminal", { detail: "cv" }))}><span>&gt; read_cv.txt</span><span className="action-tail">↗</span></button><span className="cv-note">{"// read the document in the terminal"}</span></div>
  </section>;
}

export function ContactSection() {
  const [incidentOpen, setIncidentOpen] = useState(false);
  const contactChannels = [...socials.filter(social => social.id === "linktree"), ...socials.filter(social => social.id !== "linktree")];
  return <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
    <div className="contact-content reveal"><div className="contact-ending" aria-hidden="true"><span>FOLLOW THE SIGNAL.</span><span>END OF TRANSMISSION / BEGIN A CONVERSATION</span></div><p className="section-index">07 / CONTACT</p><h2 id="contact-title" className="section-title">Let’s <span>talk.</span></h2>
      <div className="contact-transmission"><div className="transmission-head"><span>AN / FINAL TRANSMISSION</span><span>CHANNEL OPEN</span></div>
        <div className="transmission-slot"><a className="contact-action contact-email-button" data-contact-action="email" href={contact.href} onClick={event => { event.preventDefault(); setIncidentOpen(true); }}><span className="contact-action-copy"><small>01 / NEW MESSAGE</small><strong className="contact-glitch">Write an email</strong><span className="contact-action-cue">Open mail channel</span></span><span className="contact-action-arrow" aria-hidden="true">↗</span></a></div>
        <div className="transmission-foot"><span>A note from you starts the next conversation.</span><span>MAIL CHANNEL / OPEN</span></div>
      </div>
      <div className="social-line">{contactChannels.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}{"note" in social && <small>{social.note}</small>}</span><span aria-hidden="true">↗</span></a>)}</div>
      <p className="contact-final-note">I’m still building. There’s room for the next conversation.</p>
    </div>
    {incidentOpen && <ContactIncident emailHref={contact.href} onClose={() => setIncidentOpen(false)} onFix={() => {
      setIncidentOpen(false);
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }} />}
  </section>;
}
