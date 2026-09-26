"use client";

import { useEffect, useState } from "react";
import LiveWorld from "./LiveWorld";
import TechField from "./TechField";
import Intro from "./Intro";
import { contact, copy, projects, socials, type Language } from "@/data/portfolio";

const destinations = ["home", "work", "now", "about", "contact"] as const;

export default function Portfolio({ initialLanguage }: { initialLanguage: Language }) {
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [active, setActive] = useState<(typeof destinations)[number]>("home");
  const [navHidden, setNavHidden] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const ar = lang === "ar";
  const t = copy[lang];
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
    { id: "about", en: "About", ar: "عني" },
    { id: "contact", en: "Contact", ar: "تواصل" },
  ] as const;

  return <>
    <LiveWorld />
    <div className="world-shade" aria-hidden="true" />
    <TechField />
    <Intro ar={ar} />
    <a className="skip-link" href="#main">{text("Skip to content", "انتقل إلى المحتوى")}</a>
    <header className={`site-nav${navHidden ? " nav-hidden" : ""}`}>
      <div className="nav-inner">
        <a className="wordmark" href="#home" onClick={() => setActive("home")}>Adnan Naous<span className="wordmark-period">.</span></a>
        <nav aria-label={text("Main navigation", "التنقل الرئيسي")}>
          {nav.map((item, index) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-current" : ""} aria-current={active === item.id ? "location" : undefined} onClick={() => setActive(item.id)}><span className="nav-code" aria-hidden="true">0{index + 1}</span>{item[lang]}</a>)}
        </nav>
        <button className="language-toggle" type="button" onClick={() => setLang(ar ? "en" : "ar")} aria-label={text("Switch to Arabic", "Switch to English")}>{ar ? "EN" : "AR"}</button>
      </div>
    </header>

    <main id="main">
      <section id="home" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content reveal">
          <p className="section-index">01 / {text("SOFTWARE · LEARNING · CURIOSITY", "برمجة · تعلّم · فضول")}</p>
          <h1 id="hero-title" className="hero-title glitch" data-label={text("Adnan\nNaous.", "عدنان\nنعوس.")}>{text("Adnan", "عدنان")}<br/>{text("Naous.", "نعوس.")}</h1>
          <p className="hero-statement">{text("I build to learn. I keep what works.", "أبني لأتعلّم، وأحسّن ما ينجح.")}</p>
          <p className="hero-intro">{text("I study Computer Science and AI at Arab Open University. These are the projects I’m learning from now.", "أدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة. هذه المشاريع التي أتعلم منها الآن.")}</p>
          <div className="action-row">
            <a className="command-action" href="#work"><span>{text("Explore work", "استكشف الأعمال")}</span><span className="action-tail" aria-hidden="true">0{projects.length} / WORK</span></a>
            <a className="command-action command-action-quiet" href={contact.href}><span>{text("Write an email", "اكتب رسالة")}</span><span className="action-tail" aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-coordinate" aria-hidden="true"><span>AN / 2026</span></div>
      </section>

      <section id="work" className="content-section work-section" aria-labelledby="work-title">
        <div className="section-head reveal"><p className="section-index">02 / {text("SELECTED WORK", "أعمال مختارة")}</p><h2 id="work-title" className="section-title glitch" data-label={text("Built, tested, revised.", "أبني، أجرّب، وأحسّن.")}>{text("Built, tested, revised.", "أبني، أجرّب، وأحسّن.")}</h2><p className="section-lead">{text("Two projects in progress.", "مشروعان قيد التطوير.")}</p><div className="work-scan" aria-hidden="true"><span/></div></div>
        <div className="project-list">
          {projects.map((project, index) => <article className="project-entry reveal" key={project.slug}>
            <button className="project-trigger" type="button" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
              <span className="project-number">0{index + 1} / {project.category[lang]}</span>
              <span className="project-main"><strong>{project.title[lang]}</strong><span>{project.summary[lang]}</span></span>
              <span className="project-verb">{expanded === index ? text("Close", "أغلق") : text("Read project", "تفاصيل المشروع")}</span>
            </button>
            <div id={`project-detail-${index}`} className="project-detail" hidden={expanded !== index}>
              <div className="project-detail-grid">{project.sections.map(section => <div key={section.title.en}><h3>{section.title[lang]}</h3><p>{section.body[lang]}</p></div>)}</div>
              <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">{text("View code on GitHub", "شاهد الكود على GitHub")}</a>
            </div>
          </article>)}
        </div>
      </section>

      <section id="now" className="content-section now-section" aria-labelledby="now-title">
        <div className="section-head reveal"><p className="section-index">03 / {text("RIGHT NOW", "حاليًا")}</p><h2 id="now-title" className="section-title glitch" data-label={text("On my desk.", "ما أعمل عليه الآن.")}>{text("On my desk.", "ما أعمل عليه الآن.")}</h2><p className="section-lead">{text("Coursework, Java practice, and two projects in progress.", "دراستي، وتدريبي على Java، ومشروعان أعمل عليهما.")}</p></div>
        <div className="now-list">
          <div className="now-item now-item-feature reveal"><span>01 / {text("FOUNDATION", "الأساس")}</span><h3>{text("University", "الجامعة")}</h3><p>{text("Computer Science and AI coursework at Arab Open University.", "أدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة.")}</p></div>
          <div className="now-item reveal"><span>02 / {text("PRACTICE", "تدريب")}</span><h3>Java</h3><p>{text("Small programs, written and rewritten until the fundamentals click.", "أكتب برامج صغيرة وأعود لتحسينها حتى أفهم الأساسيات جيدًا.")}</p></div>
          <div className="now-item reveal"><span>03 / {text("EXPLORATION", "استكشاف")}</span><h3>{text("AI experiments", "تجارب الذكاء الاصطناعي")}</h3><p>{text("Reading, testing ideas, and finding where the tools actually help.", "أقرأ وأختبر الأفكار لأعرف أين تفيد هذه الأدوات فعلًا.")}</p></div>
        </div>
      </section>

      <section id="about" className="content-section about-section" aria-labelledby="about-title">
        <div className="section-head reveal"><p className="section-index">04 / {text("BACKGROUND", "نبذة عني")}</p><h2 id="about-title" className="section-title glitch" data-label={text("How I got here.", "كيف وصلت إلى هنا.")}>{text("How I got here.", "كيف وصلت إلى هنا.")}</h2></div>
        <div className="story-line">{t.story.map((beat, index) => <div className="story-beat reveal" key={index}><span className="story-marker">0{index + 1} / {[
          text("BEFORE", "البداية"), text("NOW", "الآن"), text("NEXT", "الخطوة التالية")
        ][index]}</span><p>{beat}</p></div>)}</div>
        <div className="about-actions reveal"><a className="command-action command-action-quiet" href="/documents/adnan-naous-cv.pdf" target="_blank" rel="noreferrer"><span>{text("View my CV", "عرض السيرة الذاتية")}</span><span className="action-tail">PDF</span></a></div>
      </section>

      <section id="contact" className="content-section contact-section" aria-labelledby="contact-title">
        <div className="contact-content reveal"><p className="section-index">05 / {text("CONTACT", "تواصل")}</p><h2 id="contact-title" className="section-title glitch" data-label={text("Let’s talk.", "خلّينا نحكي.")}>{text("Let’s talk.", "خلّينا نحكي.")}</h2><a className="contact-action" href={contact.href}><span>{text("Write an email", "اكتب رسالة")}</span><span aria-hidden="true">↗</span></a><div className="social-line">{socials.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}<small>{social.handle}</small></span><span aria-hidden="true">↗</span></a>)}</div></div>
      </section>
    </main>

    <footer className="site-footer"><span>© {new Date().getFullYear()} Adnan Naous</span><a href="https://github.com/AdnanNaous/Adnan-Naous-OS-website" target="_blank" rel="noreferrer">{text("Site source", "كود الموقع")} ↗</a><a href="#home">{text("Back to top", "إلى البداية")} ↑</a></footer>
  </>;
}
