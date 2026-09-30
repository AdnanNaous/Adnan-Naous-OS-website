"use client";

import { useEffect, useRef, useState } from "react";
import { contact, copy, socials } from "@/data/portfolio";
import { getRangeProgress, invalidateMotion, subscribeMotion } from "@/motion/runtime";
import { createSceneTransition } from "@/motion/transition";
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
  const [active, setActive] = useState(0);
  const manual = useRef<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);
  const historyMaterial = useRef(createSceneTransition<string>("0", ["0", "1", "2", "3"]));
  useEffect(() => subscribeMotion(frame => {
    if (!track.current || !stage.current) return;
    setReduced(frame.reduced);
    const progress = getRangeProgress(track.current);
    if (Math.abs(frame.scrollY - lastScroll.current) > 6) manual.current = null;
    lastScroll.current = frame.scrollY;
    const destination = String(manual.current ?? Math.min(3, Math.floor(progress * 4)));
    const history = historyMaterial.current.advance(destination, frame.delta, frame.reduced);
    setActive(frame.reduced ? Number(destination) : Number(history.visualChapter));
    stage.current.style.setProperty("--history-cover", frame.reduced ? "0" : String(history.transitionState.coverage));
    stage.current.dataset.historyPhase = history.transitionState.phase;
    stage.current.style.setProperty("--story-fill", `${progress * 100}%`);
    stage.current.style.setProperty("--beacon-position", `${8 + progress * 84}%`);
    stage.current.style.setProperty("--story-code-opacity", `${Math.max(0, .22 * (1 - progress * 1.5))}`);
    stage.current.style.setProperty("--story-code-shift", `${progress * -40}px`);
  }, { continuous: true }), []);
  return <section id="about" className={`content-section about-section${reduced ? " story-reduced" : ""}`} aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">06 / BACKGROUND</p><h2 id="about-title" className="section-title">How I got here.</h2><p className="section-lead">The field changed. The curiosity stayed.</p></div>
    <div className="story-track" ref={track}><div className="story-stage" ref={stage} data-story={active}>
      <div className="story-code-field" aria-hidden="true">{[
        "const origin = 'medicine';", "observe(signal);", "01 / a new direction", "if (curious) keepBuilding();",
        "read(path[0]);", "// the first build", "trace(root, next);", "commit('learn by making');",
        "for (const question of questions)", "  test(question);", "const work = revise(idea);", "signal += practice;",
        "while (learning) experiment();", "open('new chapter');", "// systems / people / craft", "return usefulSoftware;",
        "const route = ['learn','make'];", "measure(progress);", "// nothing is finished", "render(nextStep);",
        "await findOpportunity();", "const path = choose('computing');", "// from one field to another", "continue();",
      ].map((line, index) => <span key={index}>{line}</span>)}</div>
      <div className="story-memory" aria-hidden="true"><span>{storyCoordinates[active]}</span><svg viewBox="0 0 600 110" preserveAspectRatio="none"><path className="story-pulse" d="M0 58H80L100 58L117 28L133 86L150 8L171 101L192 58H257L283 58L308 44L331 58H400L430 58L445 32L468 82L489 58H600"/><path className="story-route" d="M0 58H80L117 58L150 8H230V58H308V90H400V32H489V58H600"/></svg></div>
      <div className="story-progress" aria-hidden="true"><span/></div>
      <div className="story-narrative">{copy.en.story.map((beat, index) => <div className={`story-panel${active === index ? " is-active" : ""}`} key={index} aria-hidden={!reduced && active !== index}><span className="story-marker">0{index + 1} / {storyLabels[index]}</span><p>{beat}</p></div>)}<div className="story-history-mask" aria-hidden="true"><i/><i/></div></div>
      <div className="story-navigation"><div className="story-controls" aria-label="Story chapters">{storyLabels.map((label, index) => <button key={label} type="button" aria-label={`Read chapter ${index + 1}: ${label}`} aria-pressed={active === index} onClick={() => { lastScroll.current = window.scrollY; manual.current = index; invalidateMotion(); }}>0{index + 1}</button>)}</div>
      <span className="story-count" aria-hidden="true">0{active + 1} / 04</span></div>
    </div></div>
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
