"use client";

import { useEffect, useState } from "react";
import { contact, copy, socials } from "@/data/portfolio";
import { subscribeMotion } from "@/motion/runtime";
import ContactIncident from "./ContactIncident";

const objectives = [
  { code: "LEARN", title: "Build a strong foundation in computer science and AI.", note: "University study, Java practice, and experiments." },
  { code: "MAKE", title: "Turn what I learn into useful software.", note: "Real projects, tested and revised in public." },
  { code: "CONTRIBUTE", title: "Grow into a role where I can help a team ship better work.", note: "Looking for an internship or junior opportunity." },
];

export function CodexSection() {
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [engaged, setEngaged] = useState(false);
  useEffect(() => subscribeMotion(frame => {
    setVisible(frame.chapter === "codex" && !document.hidden);
    setReduced(frame.reduced);
  }), []);
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden && document.documentElement.dataset.chapter === "codex");
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (!visible || !playing || reduced || engaged) return;
    const timer = window.setTimeout(() => setSelected(index => (index + 1) % objectives.length), 6000);
    return () => window.clearTimeout(timer);
  }, [visible, selected, playing, reduced, engaged]);
  const objective = objectives[selected];
  return <section id="codex" data-objective={selected} className={`content-section codex-section${visible ? " is-live" : ""}${playing && !engaged && !reduced ? " is-playing" : ""}`} aria-labelledby="codex-title">
    <div className="codex-top reveal"><p className="section-index">05 / CODEX · LONG GAME</p><h2 id="codex-title" className="section-title">The long game.</h2><p className="section-lead">A working log of the direction I’m taking, not a finished checklist.</p></div>
    <div className="codex-console reveal" onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocus={() => setEngaged(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }}>
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
  return <section id="about" className="content-section about-section" aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">06 / BACKGROUND</p><h2 id="about-title" className="section-title">How I got here.</h2><p className="section-lead">The field changed. The curiosity stayed.</p></div>
    <div className="story-environment" aria-hidden="true">
      <div className="story-environment-code">{[
        "const origin = 'medicine';", "observe(signal);", "if (curious) keepBuilding();",
        "commit('learn by making');", "const route = ['learn', 'make'];", "return usefulSoftware;",
      ].map(line => <span key={line}>{line}</span>)}</div>
      <svg viewBox="0 0 600 70" preserveAspectRatio="none"><path d="M0 35H80L100 35L117 15L133 55L150 5L171 65L192 35H257L283 35L308 25L331 35H400L430 35L445 15L468 55L489 35H600"/></svg>
    </div>
    <nav className="story-chapter-nav" aria-label="Story chapters">
      {storyLabels.map((label, index) => <a key={label} href={`#story-chapter-${index + 1}`} aria-label={`Read chapter ${index + 1}: ${label}`}><span>0{index + 1}</span><span>{label}</span><span aria-hidden="true">↓</span></a>)}
    </nav>
    <div className="story-chapters">{copy.en.story.map((beat, index) => <article id={`story-chapter-${index + 1}`} className="story-chapter" key={storyLabels[index]} aria-labelledby={`story-heading-${index + 1}`} tabIndex={-1}>
      <div className="story-chapter-heading"><h3 id={`story-heading-${index + 1}`} className="story-marker">0{index + 1} / {storyLabels[index]}</h3><span className="story-coordinate">{storyCoordinates[index]}</span></div><p>{beat}</p>
    </article>)}</div>
    <div className="about-actions reveal"><button className="command-action command-action-quiet cv-command" type="button" onClick={() => window.dispatchEvent(new CustomEvent("an-os-open-terminal", { detail: "cv" }))}><span>&gt; read_cv.txt</span><span className="action-tail">↗</span></button><span className="cv-note">{"// read the document in the terminal"}</span></div>
  </section>;
}

export function ContactSection() {
  const [incidentOpen, setIncidentOpen] = useState(false);
  return <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
    <div className="contact-content reveal"><div className="contact-ending" aria-hidden="true"><span>FOLLOW THE SIGNAL.</span><span>END OF TRANSMISSION / BEGIN A CONVERSATION</span></div><p className="section-index">07 / CONTACT</p><h2 id="contact-title" className="section-title">Let’s <span>talk.</span></h2>
      <div className="contact-transmission"><div className="transmission-head"><span>AN / FINAL TRANSMISSION</span><span>CHANNEL OPEN</span></div>
        <div className="transmission-slot"><a className="contact-action" href={contact.href} onClick={event => { event.preventDefault(); setIncidentOpen(true); }}><span className="contact-action-copy"><small>01 / NEW MESSAGE</small><strong className="contact-glitch">Write an email</strong></span><span className="contact-action-arrow" aria-hidden="true">↗</span></a></div>
        <div className="transmission-foot"><span>A note from you starts the next conversation.</span><span>MAIL CHANNEL / OPEN</span></div>
      </div>
      <div className="social-line">{socials.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}{"note" in social && <small>{social.note}</small>}</span><span aria-hidden="true">↗</span></a>)}</div>
      <p className="contact-final-note">I’m still building. There’s room for the next conversation.</p>
    </div>
    {incidentOpen && <ContactIncident emailHref={contact.href} onClose={() => setIncidentOpen(false)} onFix={() => {
      setIncidentOpen(false);
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }} />}
  </section>;
}
