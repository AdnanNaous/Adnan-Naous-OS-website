"use client";

import { useEffect, useRef, useState } from "react";
import { contact, copy, socials } from "@/data/portfolio";
import ContactIncident from "./ContactIncident";

export function CodexSection() {
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const firstCycle = useRef(true);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const target = node.querySelector(".codex-console") ?? node;
    const observer = new IntersectionObserver(entries => {
      const inView = entries[0]?.isIntersecting ?? false;
      if (inView && !node.classList.contains("is-live")) { firstCycle.current = true; setSelected(0); }
      setVisible(inView);
    }, { threshold: 0.08, rootMargin: "0px 0px -12% 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => { firstCycle.current = false; setSelected(index => (index + 1) % 3); }, firstCycle.current ? 1700 : 3600);
    return () => window.clearTimeout(timer);
  }, [visible, selected]);
  const objectives = [
    { code: "LEARN", title: "Build a strong foundation in computer science and AI.", note: "University study, Java practice, and experiments." },
    { code: "MAKE", title: "Turn what I learn into useful software.", note: "Real projects, tested and revised in public." },
    { code: "CONTRIBUTE", title: "Grow into a role where I can help a team ship better work.", note: "Looking for an internship or junior opportunity." },
  ];
  const objective = objectives[selected];
  return <section id="codex" ref={section} className={`content-section codex-section${visible ? " is-live" : ""}`} aria-labelledby="codex-title">
    <div className="codex-top reveal"><p className="section-index">04 / CODEX · LONG GAME</p><h2 id="codex-title" className="section-title">The long game.</h2><p className="section-lead">A working log of the direction I’m taking, not a finished checklist.</p></div>
    <div className="codex-console reveal"><div className="codex-console-head"><span>AN / LONG-RANGE RECORD</span><span>AUTO CYCLE · SELECT ANY CHAPTER</span></div>
      <div className="codex-console-body"><ol className="codex-menu">{objectives.map((item, index) => <li key={item.code}><button type="button" className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`0${index + 1}: ${item.title}`}><span>0{index + 1} / CHAPTER</span><strong>{item.code}</strong></button></li>)}</ol>
      <div className="codex-detail" key={selected}><div className="codex-detail-copy"><span className="codex-status">CHAPTER 0{selected + 1} / 03</span><strong>{objective.title}</strong><p>{objective.note}</p><small>A direction I keep working toward.</small></div></div></div>
    </div>
  </section>;
}

export function AboutSection() {
  const [step, setStep] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const labels = ["THE FIRST PATH", "THE TURN", "THE FIRST BUILD", "THE THREAD"];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track.current || !stage.current) return;
        const rect = track.current.getBoundingClientRect();
        const travel = Math.max(1, rect.height - innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / travel));
        setStep(Math.min(3, Math.floor(progress * 4)));
        stage.current.style.setProperty("--beacon-position", `${8 + progress * 84}%`);
        stage.current.style.setProperty("--story-fill", `${progress * 100}%`);
        stage.current.style.setProperty("--story-code-opacity", `${Math.max(0, .36 * (1 - Math.max(0, (progress - .42) / .58))).toFixed(3)}`);
        stage.current.style.setProperty("--story-code-shift", `${Math.round(progress * -38)}px`);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
  }, []);

  return <section id="about" className="content-section about-section" aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">05 / BACKGROUND</p><h2 id="about-title" className="section-title">How I got here.</h2></div>
    <div className="story-track" ref={track}><div className="story-stage" ref={stage}>
      <div className="story-code-field" aria-hidden="true">{[
        "const origin = 'medicine';", "observe(signal);", "01 / a new direction", "if (curious) keepBuilding();",
        "read(path[0]);", "// the first build", "trace(root, next);", "commit('learn by making');",
        "for (const question of questions)", "  test(question);", "const work = revise(idea);", "signal += practice;",
        "while (learning) experiment();", "open('new chapter');", "// systems / people / craft", "return usefulSoftware;",
        "const route = ['learn','make'];", "measure(progress);", "// nothing is finished", "render(nextStep);",
        "await findOpportunity();", "const path = choose('computing');", "// from one field to another", "continue();",
      ].map((line, index) => <span key={index}>{line}</span>)}</div>
      <div className="story-orbit" aria-hidden="true"><span className="story-beacon"/></div>
      <div className="story-progress" aria-hidden="true"><span/></div>
      {copy.en.story.map((beat, index) => <div className={`story-panel${step === index ? " is-active" : ""}`} key={index}><span className="story-marker">0{index + 1} / {labels[index]}</span><p>{beat}</p></div>)}
      <span className="story-count" aria-hidden="true">0{step + 1} / 04</span>
    </div></div>
    <div className="about-actions reveal"><button className="command-action command-action-quiet cv-command" type="button" onClick={() => window.dispatchEvent(new CustomEvent("an-os-open-terminal", { detail: "cv" }))}><span>&gt; read_cv.txt</span><span className="action-tail">↗</span></button><span className="cv-note">{"// read the document in the terminal"}</span></div>
  </section>;
}

export function ContactSection() {
  const section = useRef<HTMLElement>(null);
  const [signal, setSignal] = useState<"ready" | "lost">("ready");
  const [incidentOpen, setIncidentOpen] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node || signal === "lost" || matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const action = node.querySelector<HTMLAnchorElement>(".contact-action");
    if (!action) return;
    let timer: number | null = null;
    let entered = false;
    const clear = () => { if (timer !== null) clearTimeout(timer); timer = null; };
    const schedule = () => { if (!entered) return; clear(); timer = window.setTimeout(() => { if (!action.matches(":hover, :focus")) setSignal("lost"); }, 12000); };
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { entered = true; schedule(); observer.disconnect(); } }, { threshold: 0.4 });
    observer.observe(node);
    action.addEventListener("pointerenter", clear);
    action.addEventListener("pointerleave", schedule);
    action.addEventListener("focus", clear);
    action.addEventListener("blur", schedule);
    return () => { clear(); observer.disconnect(); action.removeEventListener("pointerenter", clear); action.removeEventListener("pointerleave", schedule); action.removeEventListener("focus", clear); action.removeEventListener("blur", schedule); };
  }, [signal]);

  return <section id="contact" ref={section} className="content-section contact-section" aria-labelledby="contact-title">
    <div className="contact-content reveal"><p className="section-index">07 / CONTACT</p><h2 id="contact-title" className="section-title">Let’s talk.</h2>
      <div className="contact-transmission"><div className="transmission-head"><span>AN / FINAL TRANSMISSION</span><span>{signal === "ready" ? "CHANNEL OPEN" : "SIGNAL PAUSED"}</span></div>
        <div className="transmission-slot">{signal === "ready" ? <a className="contact-action" href={contact.href} onClick={event => { event.preventDefault(); setIncidentOpen(true); }}><span className="contact-action-copy"><small>01 / NEW MESSAGE</small><strong className="contact-glitch">Write an email</strong></span><span className="contact-action-arrow" aria-hidden="true">↗</span></a> : <button className="contact-recall" type="button" onClick={() => setSignal("ready")}><span className="contact-action-copy"><small>01 / CHANNEL PAUSED</small><strong>Reopen email</strong></span><span className="contact-action-arrow" aria-hidden="true">↻</span></button>}</div>
        <div className="transmission-foot"><span>A note from you starts the next conversation.</span><span>MAIL CHANNEL / OPEN</span></div>
      </div>
      <div className="social-line">{socials.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}</span><span aria-hidden="true">↗</span></a>)}</div>
    </div>
    {incidentOpen && <ContactIncident emailHref={contact.href} onClose={() => setIncidentOpen(false)} onFix={() => {
      setSignal("ready");
      setIncidentOpen(false);
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        const homeTitle = document.getElementById("hero-title");
        if (homeTitle) { homeTitle.tabIndex = -1; homeTitle.focus({ preventScroll: true }); }
      });
    }} />}
  </section>;
}
