"use client";

import { useCallback, useEffect, useState } from "react";
import VisualEngine from "../graphics/VisualEngine";
import Intro from "./Intro";
import TerminalOverlay from "./TerminalOverlay";
import { AboutSection, CodexSection, ContactSection } from "./ExperienceSections";
import { WorkSectionV2 } from "./WorkSectionV2";
import { NowSectionV2 } from "./NowSectionV2";
import { BrainSection } from "./BrainSection";
import { installConsoleEasterEggs } from "./consoleEasterEggs";
import { subscribeMotion } from "@/motion/runtime";
import { mountObjectPulse } from "@/motion/pulse";

const destinations = ["home", "brain", "work", "now", "codex", "about", "contact"] as const;

export default function Portfolio() {
  const [active, setActive] = useState<(typeof destinations)[number]>("home");
  const [navHidden, setNavHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [terminalDocument, setTerminalDocument] = useState<string | undefined>();
  const [secondsHere, setSecondsHere] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const closeTerminal = useCallback(() => { setSecretOpen(false); setTerminalDocument(undefined); }, []);

  useEffect(() => {
    const enter = () => setBooted(true);
    addEventListener("an-os-booted", enter);
    if (document.querySelector(".intro")?.getAttribute("data-state") === "done") enter();
    return () => removeEventListener("an-os-booted", enter);
  }, []);

  useEffect(() => installConsoleEasterEggs(), []);
  useEffect(() => mountObjectPulse(), []);

  useEffect(() => {
    const openFromAction = (event: Event) => { setTerminalDocument((event as CustomEvent<string>).detail); setSecretOpen(true); };
    addEventListener("an-os-open-terminal", openFromAction);
    return () => removeEventListener("an-os-open-terminal", openFromAction);
  }, []);

  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => setSecondsHere(Math.floor((performance.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const openFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input,textarea,[contenteditable='true']") || document.querySelector("[aria-modal='true']") || document.querySelector(".intro[data-state='loading']")) return;
      event.preventDefault();
      setSecretOpen(true);
    };
    addEventListener("keydown", openFromKeyboard);
    return () => removeEventListener("keydown", openFromKeyboard);
  }, []);

  useEffect(() => {
    let lastScroll = scrollY;
    let upwardTravel = 0;
    return subscribeMotion(frame => {
        const y = frame.scrollY;
        setScrolled(y > 90);
        const delta = y - lastScroll;
        if (y < 90) { upwardTravel = 0; setNavHidden(false); }
        else if (delta > 4) { upwardTravel = 0; setNavHidden(true); }
        else if (delta < -4) { upwardTravel += -delta; if (upwardTravel > 120) setNavHidden(false); }
        lastScroll = y;
        setActive(frame.chapter);
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
    }), { threshold: 0.16, rootMargin: "0px 0px -4% 0px" });
    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
    return () => { observer.disconnect(); root.classList.remove("motion-ready"); };
  }, []);

  const nav = [
    { id: "home", label: "Home" },
    { id: "brain", label: "Brain" },
    { id: "work", label: "Work" },
    { id: "now", label: "Now" },
    { id: "codex", label: "Codex" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ] as const;
  const visitorClock = `${String(Math.floor(secondsHere / 60)).padStart(2, "0")}:${String(secondsHere % 60).padStart(2, "0")}`;

  return <>
    <VisualEngine />
    <div className="world-shade" aria-hidden="true" />
    <Intro />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-nav${navHidden && !menuOpen ? " nav-hidden" : ""}${scrolled ? " nav-scrolled" : ""}${menuOpen ? " menu-open" : ""}`} onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}>
      <div className="nav-inner">
        <a className="wordmark" href="#home" onClick={() => setActive("home")}>Adnan Naous<span className="wordmark-period">.</span></a>
        <button className="nav-toggle" type="button" aria-controls="chapter-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><span>0{destinations.indexOf(active) + 1} / {active}</span><span>{menuOpen ? "Close ×" : "Chapters +"}</span></button>
        <nav id="chapter-navigation" aria-label="Main navigation">
          {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-current" : ""} aria-current={active === item.id ? "location" : undefined} onClick={() => { setActive(item.id); setMenuOpen(false); }}><span className="nav-code" aria-hidden="true">0{index + 1}</span>{item.label}</a>)}
        </nav>
        <div className="visitor-clock" aria-label={`Time on page ${visitorClock}`}><span>SESSION</span><strong>{visitorClock}</strong></div>
      </div>
    </header>
    <aside className="timeline-rail" aria-label="Page timeline" style={{ "--timeline-progress": `${destinations.indexOf(active) / (destinations.length - 1) * 100}%` } as React.CSSProperties}>
      <span className="timeline-progress" aria-hidden="true" />
      {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-label={`${index + 1}. ${item.label}`} aria-current={active === item.id ? "location" : undefined} className={active === item.id ? "is-current" : ""}><span className="timeline-dot"/><span className="timeline-label">0{index + 1} / {item.label}</span></a>)}
    </aside>

    <main id="main">
      <section id="home" className={`hero-section${booted ? " is-booted" : ""}`} aria-labelledby="hero-title">
        <div className="hero-imprint" aria-hidden="true"><span>AN</span><span>/OS</span><small>SOFTWARE / CURIOSITY<br/>WORLDS IN PROGRESS</small></div>
        <div className="hero-content reveal">
          <p className="section-index">01 / SOFTWARE · LEARNING · CURIOSITY</p>
          <h1 id="hero-title" className="hero-title"><span className="hero-name-line" data-word="Adnan">Adnan</span><span className="hero-name-line" data-word="Naous.">Naous.</span></h1>
          <p className="hero-statement">I build to learn. I keep what works.</p>
          <p className="hero-intro">I study Computer Science and AI at Arab Open University. These are the projects I’m learning from now.</p>
          <div className="hero-terminal" aria-label="Welcome message">
            <div className="terminal-head"><span>AN // VISITOR CHANNEL</span><span>● LIVE</span></div>
            <p><span aria-hidden="true">&gt; </span>Welcome. Follow the signal.<span className="terminal-cursor" aria-hidden="true">_</span></p>
            <button type="button" className="terminal-secret" onClick={() => setSecretOpen(true)} aria-expanded={secretOpen} aria-haspopup="dialog" aria-keyshortcuts="/" aria-label="Open AN/OS terminal workspace"><span aria-hidden="true">[ / ]</span><strong>OPEN TERMINAL</strong><span aria-hidden="true">↗</span></button>
          </div>
        </div>
        <div className="hero-coordinate"><span>AN / 2026</span><a href="#brain">Enter the memory array <span aria-hidden="true">↓</span></a></div>
      </section>

      <BrainSection />
      <WorkSectionV2 />
      <NowSectionV2 />
      <CodexSection />
      <AboutSection />
      <ContactSection />
    </main>

    <footer className="site-footer"><div><strong>Adnan Naous.</strong><small>© {new Date().getFullYear()} · All rights reserved</small></div><p>Thanks for spending a moment here.</p><div className="footer-actions"><a href="#home">Back to top ↑</a></div></footer>
    {secretOpen && <TerminalOverlay onClose={closeTerminal} initialDocument={terminalDocument} />}
  </>;
}
