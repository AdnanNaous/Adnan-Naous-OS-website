"use client";

import { useEffect, useState } from "react";
import LiveWorld from "./LiveWorld";
import TechField from "./TechField";
import Intro from "./Intro";
import { AboutSection, CodexSection, ContactSection, NowSection, WorkSection } from "./ExperienceSections";
import { contact, type Language } from "@/data/portfolio";

const destinations = ["home", "work", "now", "codex", "about", "contact"] as const;

export default function Portfolio({ initialLanguage }: { initialLanguage: Language }) {
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [active, setActive] = useState<(typeof destinations)[number]>("home");
  const [navHidden, setNavHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.cookie = `portfolio-language=${lang};path=/;max-age=31536000;SameSite=Lax`;
  }, [lang, ar]);

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

  const nav = [
    { id: "home", en: "Home", ar: "البداية" },
    { id: "work", en: "Work", ar: "الأعمال" },
    { id: "now", en: "Now", ar: "الآن" },
    { id: "codex", en: "Codex", ar: "السجل" },
    { id: "about", en: "About", ar: "عني" },
    { id: "contact", en: "Contact", ar: "تواصل" },
  ] as const;

  return <>
    <LiveWorld />
    <div className="world-shade" aria-hidden="true" />
    <TechField />
    <Intro ar={ar} />
    <a className="skip-link" href="#main">{text("Skip to content", "انتقل إلى المحتوى")}</a>
    <header className={`site-nav${navHidden ? " nav-hidden" : ""}${scrolled ? " nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="wordmark" href="#home" onClick={() => setActive("home")}>Adnan Naous<span className="wordmark-period">.</span></a>
        <nav aria-label={text("Main navigation", "التنقل الرئيسي")}>
          {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-current" : ""} aria-current={active === item.id ? "location" : undefined} onClick={() => setActive(item.id)}><span className="nav-code" aria-hidden="true">0{index + 1}</span>{item[lang]}</a>)}
        </nav>
        <button className="language-toggle" type="button" onClick={() => setLang(ar ? "en" : "ar")} aria-label={text("Switch to Arabic", "Switch to English")}>{ar ? "EN" : "AR"}</button>
      </div>
    </header>
    <aside className="timeline-rail" aria-label={text("Page timeline", "خطّ الصفحة")}>
      {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-label={`${index + 1}. ${item[lang]}`} aria-current={active === item.id ? "location" : undefined} className={active === item.id ? "is-current" : ""}><span className="timeline-dot"/><span className="timeline-label">0{index + 1} / {item[lang]}</span></a>)}
    </aside>

    <main id="main">
      <section id="home" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content reveal">
          <p className="section-index">01 / {text("SOFTWARE · LEARNING · CURIOSITY", "برمجة · تعلّم · فضول")}</p>
          <h1 id="hero-title" className="hero-title glitch" data-label={text("Adnan\nNaous.", "عدنان\nنعوس.")}>{text("Adnan", "عدنان")}<br/>{text("Naous.", "نعوس.")}</h1>
          <p className="hero-statement">{text("I build to learn. I keep what works.", "أبني لأتعلّم، وأحسّن ما ينجح.")}</p>
          <p className="hero-intro">{text("I study Computer Science and AI at Arab Open University. These are the projects I’m learning from now.", "أدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة. هذه المشاريع التي أتعلم منها الآن.")}</p>
          <div className="hero-terminal" aria-label={text("Welcome message", "رسالة ترحيب")}>
            <div className="terminal-head"><span>AN // VISITOR CHANNEL</span><span>● LIVE</span></div>
            <p><span aria-hidden="true">&gt; </span>{text("Welcome. Follow the signal.", "أهلًا بك. اتبع الإشارة.")}<span className="terminal-cursor" aria-hidden="true">_</span></p>
            <button type="button" className="terminal-secret" onClick={() => setSecretOpen(!secretOpen)} aria-expanded={secretOpen}>{text("[ ? ] list commands", "[ ؟ ] اعرض الأوامر")}</button>
            {secretOpen && <div className="terminal-reveal"><a href="#work">&gt; work</a><a href="#now">&gt; now</a><a href="#contact">&gt; contact</a></div>}
          </div>
        </div>
        <div className="hero-coordinate" aria-hidden="true"><span>AN / 2026</span></div>
      </section>

      <WorkSection lang={lang} />
      <NowSection lang={lang} />
      <CodexSection lang={lang} />
      <AboutSection lang={lang} />
      <ContactSection lang={lang} />
    </main>

    <footer className="site-footer"><div><strong>Adnan Naous.</strong><small>© {new Date().getFullYear()} · {text("All rights reserved", "جميع الحقوق محفوظة")}</small></div><p>{text("Thanks for spending a moment here.", "شكرًا لأنك منحتني بعض وقتك.")}</p><div className="footer-actions"><a href={contact.href}>{text("Email", "بريد")}</a><a href="#home">{text("Back to top", "إلى البداية")} ↑</a></div></footer>
  </>;
}
