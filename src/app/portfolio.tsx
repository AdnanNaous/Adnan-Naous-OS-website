"use client";

import { useCallback, useEffect, useState } from "react";
import LiveWorld from "./LiveWorld";
import Intro from "./Intro";
import TerminalOverlay from "./TerminalOverlay";
import { AboutSection, CodexSection, ContactSection } from "./ExperienceSections";
import { WorkSectionV2 } from "./WorkSectionV2";
import { NowSectionV2 } from "./NowSectionV2";
import { BrainSection } from "./BrainSection";

const destinations = ["home", "work", "now", "codex", "about", "brain", "contact"] as const;

export default function Portfolio() {
  const [active, setActive] = useState<(typeof destinations)[number]>("home");
  const [navHidden, setNavHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [terminalDocument, setTerminalDocument] = useState<string | undefined>();
  const [secondsHere, setSecondsHere] = useState(0);
  const closeTerminal = useCallback(() => setSecretOpen(false), []);

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
      if (target?.closest("input,textarea,[contenteditable='true']") || document.querySelector("[aria-modal='true']")) return;
      event.preventDefault();
      setSecretOpen(true);
    };
    addEventListener("keydown", openFromKeyboard);
    return () => removeEventListener("keydown", openFromKeyboard);
  }, []);

  useEffect(() => {
    const sections = destinations.map(id => document.getElementById(id)).filter((section): section is HTMLElement => !!section);
    let lastScroll = scrollY;
    let upwardTravel = 0;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY;
        setScrolled(y > 90);
        const delta = y - lastScroll;
        if (y < 90) { upwardTravel = 0; setNavHidden(false); }
        else if (delta > 4) { upwardTravel = 0; setNavHidden(true); }
        else if (delta < -4) { upwardTravel += -delta; if (upwardTravel > 120) setNavHidden(false); }
        lastScroll = y;
        const line = innerHeight * 0.42;
        const current = sections.find(section => {
          const rect = section.getBoundingClientRect();
          return rect.top <= line && rect.bottom > line;
        }) ?? sections.reduce((nearest, section) =>
          Math.abs(section.getBoundingClientRect().top - line) < Math.abs(nearest.getBoundingClientRect().top - line) ? section : nearest, sections[0]);
        if (current) setActive(current.id as (typeof destinations)[number]);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
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

  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let lastY = scrollY;
    let lastTime = performance.now();
    let frame = 0;
    let settle = 0;
    const clear = () => {
      root.style.removeProperty("--motion-shift");
      root.style.removeProperty("--motion-skew");
    };
    const update = () => {
      if (reduced.matches || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        const y = scrollY;
        const speed = Math.max(-1, Math.min(1, ((y - lastY) / Math.max(16, now - lastTime)) * 1000 / 1800));
        const touch = matchMedia("(pointer: coarse)").matches;
        root.style.setProperty("--motion-shift", `${(speed * (touch ? 1 : 2)).toFixed(2)}px`);
        root.style.setProperty("--motion-skew", `${(touch ? 0 : speed * .65).toFixed(3)}deg`);
        lastY = y;
        lastTime = now;
        window.clearTimeout(settle);
        settle = window.setTimeout(clear, 140);
      });
    };
    addEventListener("scroll", update, { passive: true });
    return () => { removeEventListener("scroll", update); cancelAnimationFrame(frame); window.clearTimeout(settle); clear(); };
  }, []);

  const nav = [
    { id: "home", label: "Home" },
    { id: "work", label: "Work" },
    { id: "now", label: "Now" },
    { id: "codex", label: "Codex" },
    { id: "about", label: "About" },
    { id: "brain", label: "Brain" },
    { id: "contact", label: "Contact" },
  ] as const;
  const visitorClock = `${String(Math.floor(secondsHere / 60)).padStart(2, "0")}:${String(secondsHere % 60).padStart(2, "0")}`;

  return <>
    <LiveWorld />
    <div className="world-shade" aria-hidden="true" />
    <div className="world-schematic" aria-hidden="true">
      <span>AN / MEMORY ARRAY &nbsp; 0001—2048</span><span>CORE 01 · SIGNAL ACTIVE</span>
      <span>route.compute(learning);</span><span>01 00 11 10 · 01 01 11</span>
      <svg viewBox="0 0 1480 760" preserveAspectRatio="none"><path d="M0 565H170L275 450H415M1480 225H1310L1200 360H1060M0 610H235L358 510H480M1480 180H1285L1180 310H1030"/><circle cx="415" cy="450" r="3"/><circle cx="1060" cy="360" r="3"/></svg>
    </div>
    <div className="world-manga" aria-hidden="true">
      <svg viewBox="0 0 1280 800" preserveAspectRatio="none">
        <g className="manga-speed-lines">
          <path d="M1280 47 899 228M1280 89 946 242M1280 124 983 254M1280 657 917 529M1280 698 961 545M1280 737 1004 560" />
          <path d="M0 88 278 236M0 121 242 252M0 678 258 564M0 716 308 546" />
        </g>
        <g className="manga-ink-edges">
          <path d="M1248 0 1165 154 1280 129M0 692 115 613 42 800M1025 0 962 94M1280 408 1175 435" />
          <path d="M1190 163 1219 157M84 628 110 622M956 98 972 82" />
        </g>
      </svg>
      <span className="manga-flare manga-flare-primary" />
      <span className="manga-flare manga-flare-secondary" />
    </div>
    <Intro />
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`site-nav${navHidden ? " nav-hidden" : ""}${scrolled ? " nav-scrolled" : ""}`} style={scrolled ? { backdropFilter: "blur(22px) saturate(.55)" } : undefined}>
      <div className="nav-inner">
        <a className="wordmark" href="#home" onClick={() => setActive("home")}>Adnan Naous<span className="wordmark-period">.</span></a>
        <nav aria-label="Main navigation">
          {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-current" : ""} aria-current={active === item.id ? "location" : undefined} onClick={() => setActive(item.id)}><span className="nav-code" aria-hidden="true">0{index + 1}</span>{item.label}</a>)}
        </nav>
        <div className="visitor-clock" aria-label={`Time on page ${visitorClock}`}><span>SESSION</span><strong>{visitorClock}</strong></div>
      </div>
    </header>
    <aside className="timeline-rail" aria-label="Page timeline" style={{ "--timeline-progress": `${destinations.indexOf(active) / (destinations.length - 1) * 100}%` } as React.CSSProperties}>
      <span className="timeline-progress" aria-hidden="true" />
      {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-label={`${index + 1}. ${item.label}`} aria-current={active === item.id ? "location" : undefined} className={active === item.id ? "is-current" : ""}><span className="timeline-dot"/><span className="timeline-label">0{index + 1} / {item.label}</span></a>)}
    </aside>

    <main id="main">
      <section id="home" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content reveal">
          <p className="section-index">01 / SOFTWARE · LEARNING · CURIOSITY</p>
          <h1 id="hero-title" className="hero-title"><span className="hero-name-line">Adnan</span><span className="hero-name-line">Naous.</span></h1>
          <p className="hero-statement">I build to learn. I keep what works.</p>
          <p className="hero-intro">I study Computer Science and AI at Arab Open University. These are the projects I’m learning from now.</p>
          <div className="hero-terminal" aria-label="Welcome message">
            <div className="terminal-head"><span>AN // VISITOR CHANNEL</span><span>● LIVE</span></div>
            <p><span aria-hidden="true">&gt; </span>Welcome. Follow the signal.<span className="terminal-cursor" aria-hidden="true">_</span></p>
            <button type="button" className="terminal-secret" onClick={() => setSecretOpen(true)} aria-expanded={secretOpen} aria-haspopup="dialog" aria-keyshortcuts="/" aria-label="Open AN/OS terminal workspace"><span aria-hidden="true">[ / ]</span><strong>OPEN TERMINAL</strong><span aria-hidden="true">↗</span></button>
          </div>
        </div>
        <div className="hero-coordinate" aria-hidden="true"><span>AN / 2026</span></div>
      </section>

      <WorkSectionV2 />
      <NowSectionV2 />
      <CodexSection />
      <AboutSection />
      <BrainSection />
      <ContactSection />
    </main>

    <footer className="site-footer"><div><strong>Adnan Naous.</strong><small>© {new Date().getFullYear()} · All rights reserved</small></div><p>Thanks for spending a moment here.</p><div className="footer-actions"><a href="#home">Back to top ↑</a></div></footer>
    {secretOpen && <TerminalOverlay onClose={() => { closeTerminal(); setTerminalDocument(undefined); }} initialDocument={terminalDocument} />}
  </>;
}
