"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Intro from "./Intro";
import GalaxyScene from "./GalaxyScene";
import Image from "next/image";
import HeroWorld from "./HeroWorld";
import { projects, copy, contact, socials, certificate, journeyUrl, type Language } from "@/data/portfolio";

export default function Portfolio({initialLanguage}: {initialLanguage: Language}) {
  const [lang, setLang] = useState<Language>(initialLanguage);
  const [active, setActive] = useState("home");
  const [navHidden, setNavHidden] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [overheated, setOverheated] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ar = lang === "ar";
  const t = copy[lang];
  const text = (en: string, arabic: string) => ar ? arabic : en;
  useEffect(() => {
    let lastY = window.scrollY, upward = 0;
    const updateDock = () => {
      const y = window.scrollY, delta = y - lastY;
      if (y < 150) { upward = 0; setNavHidden(false); }
      else if (delta > 3) { upward = 0; setNavHidden(true); }
      else if (delta < -3) { upward += -delta; if(upward > 115) setNavHidden(false); }
      lastY = y;
    };
    addEventListener('scroll', updateDock, {passive:true});
    return () => removeEventListener('scroll', updateDock);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.cookie = `portfolio-language=${lang};path=/;max-age=31536000;SameSite=Lax`;
  }, [lang, ar]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    const world=document.querySelector<HTMLElement>(".final-world");
    const updateProgress=()=>{
      document.documentElement.style.setProperty("--reading",`${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100}%`);
      if(world){const rect=world.getBoundingClientRect();world.style.setProperty("--tree-shift",`${Math.max(-48,Math.min(48,(rect.top-innerHeight*.2)*-.035))}px`);}
    };
    addEventListener("scroll",updateProgress,{passive:true});updateProgress();
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    let frame = 0;
    const updateActive = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = innerHeight * .38;
        const current = sections.find(section => {
          const rect = section.getBoundingClientRect();
          return rect.top <= line && rect.bottom > line;
        }) ?? sections.reduce((nearest, section) =>
          Math.abs(section.getBoundingClientRect().top - line) < Math.abs(nearest.getBoundingClientRect().top - line) ? section : nearest, sections[0]);
        if (current) setActive(current.id);
      });
    };
    addEventListener("scroll", updateActive, {passive:true});
    addEventListener("resize", updateActive);
    updateActive();
    return () => { observer.disconnect(); removeEventListener("scroll",updateProgress); removeEventListener("scroll",updateActive); removeEventListener("resize",updateActive); cancelAnimationFrame(frame); if(timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if(selected !== null) {dialog.current?.showModal(); document.body.style.overflow = "hidden";}
    return () => {document.body.style.overflow = "";};
  }, [selected]);
  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: .55 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!contactVisible || overheated) return;
    const timeout = setTimeout(() => setOverheated(true), 14000);
    return () => clearTimeout(timeout);
  }, [contactVisible, overheated]);
  function tilt(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r=e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", `${-(e.clientY-r.top-r.height/2)/45}deg`);
    e.currentTarget.style.setProperty("--ry", `${(e.clientX-r.left-r.width/2)/45}deg`);
    e.currentTarget.style.setProperty("--mx", `${(e.clientX-r.left)/r.width*100}%`);
    e.currentTarget.style.setProperty("--my", `${(e.clientY-r.top)/r.height*100}%`);
  }
  function reset(e: PointerEvent<HTMLElement>) {e.currentTarget.style.setProperty("--rx","0deg");e.currentTarget.style.setProperty("--ry","0deg");}
  async function copyEmail() {
    try {await navigator.clipboard.writeText(contact.value);setCopied(true);setCopyError(false);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setCopied(false),2500);}
    catch {setCopyError(true);}
  }
  const nav = [{id:"home",en:"Home",ar:"البداية"},{id:"work",en:"Work",ar:"الأعمال"},{id:"now",en:"Now",ar:"الآن"},{id:"about",en:"About",ar:"عني"},{id:"contact",en:"Contact",ar:"تواصل"}];
  return <>
    <Intro ar={ar}/>
    <a className="skip" href="#main">{text("Skip to content","انتقل إلى المحتوى")}</a>
    <div className="wallpaper" aria-hidden="true"><GalaxyScene /><i/><i/><i/></div>
    <header className="header wrap">
      <a className="brand" href="#home"><span className="identity-mark" aria-hidden="true"><i/><i/><i/></span><span>{text("Adnan Naous","عدنان نعوس")}</span></a>
      <div className="header-right"><span className="edition">PORTFOLIO / 26</span><button className="language" onClick={()=>setLang(ar?"en":"ar")} aria-label={text("Switch to Arabic","Switch to English")}>{ar?"EN":"عربي"}</button></div>
    </header>
    <nav className={`dock${navHidden?' is-hidden':''}`} aria-label={text("Main navigation","التنقل الرئيسي")} inert={navHidden}>
      {nav.map((n,i)=><a key={n.id} className={active===n.id?"active":""} aria-current={active===n.id?"location":undefined} href={`#${n.id}`} onClick={()=>setActive(n.id)}><span className="nav-number" aria-hidden="true">0{i+1}</span><span>{n[lang]}</span></a>)}
    </nav>
    <main id="main" className="wrap">
      <section id="home" className="hero cinematic-hero">
        <HeroWorld/>
        <div className="hero-copy">
          <span className="status"><i/>{text("Open to internships and junior roles","أبحث عن تدريب أو فرصة عمل للمبتدئين")}</span>
          <h1 className="hero-name"><span className="fracture-title" data-text={text("Adnan","عدنان")}>{text("Adnan","عدنان")}</span><br/><span className="fracture-title" data-text={text("Naous.","نعوس.")}>{text("Naous.","نعوس.")}</span></h1>
          <h2>{text("Learning to make software.","أتعلّم بناء البرمجيات.")}</h2>
          <p>{t.intro}<br/>{text("These are my current projects.","هذه مشاريعي الحالية.")}</p>
          <div className="actions"><a className="button primary hardware-button" href="#work">{t.viewWork}<span className="glyph" aria-hidden="true">↓</span></a><a className="button secondary" href="#contact">{t.email}<span className="glyph" aria-hidden="true">↗</span></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"/>
        <div className="hero-bottom"><span>{text("Projects, notes, and a way to reach me.","مشاريع وملاحظات وطريقة للتواصل معي.")}</span><a href="#work">{text("Keep scrolling","تابع التمرير")}<span className="glyph" aria-hidden="true">↓</span></a></div>
      </section>
      <section id="work" className="section">
        <div className="section-heading reveal"><div><span className="eyebrow">01 — {text("PROJECTS","المشاريع")}</span><h2 className="signal-heading" data-text={text("Things I’m building.","ما أبنيه الآن.")}>{text("Things I’m building.","ما أبنيه الآن.")}</h2></div><p>{text("Two projects I’m learning from.","مشروعان أتعلم منهما.")}</p></div>
        <div className="project-grid">{projects.map((p,i)=><article key={p.slug} className={`project reveal project-${i}`} onPointerMove={tilt} onPointerLeave={reset}>
          <button className="project-open" onClick={()=>setSelected(i)} aria-label={`${t.explore}: ${p.title[lang]}`}>
            <div className="project-art" aria-hidden="true">{i===0?<div className="terminal-art"><div className="window-bar"><span/><span/><span/><b>maintenance.ps1</b></div><div className="terminal-body"><span className="glyph" aria-hidden="true">&gt;_</span><p>Windows Maintenance</p><div className="terminal-line"><i/>Diagnostics</div><div className="terminal-line"><i/>Maintenance</div><div className="terminal-line"><i/>Reports</div><div className="signal-bars">{Array.from({length:22},(_,j)=><span key={j} style={{height:`${Math.round(15+Math.sin(j*1.3)*12+j%5*4)}px`,animationDelay:`${j*70}ms`}}/>)}</div></div></div>:<div className="portfolio-art"><div className="mini-card"><span className="mini-name">AN / 02</span><span>Adnan Naous.</span><div className="mini-line"/><div className="mini-line short"/><div className="mini-pills"><i/><i/></div></div><span className="language-tile tile-ar">ع</span><span className="language-tile tile-en">Aa</span></div>}<span className="art-arrow"><span className="glyph" aria-hidden="true">↗</span></span></div>
            <div className="project-info"><span className="eyebrow">{i===0?"01 / POWERSHELL":"02 / NEXT.JS"}</span><h3>{p.title[lang]}</h3><p>{p.summary[lang]}</p><div className="project-meta"><span>{text("In development","قيد التطوير")}</span><span>{t.explore}<span className="glyph" aria-hidden="true">↗</span></span></div></div>
          </button>
        </article>)}</div>
        <a id="journey" className="journey reveal" href={journeyUrl} target="_blank" rel="noreferrer"><span className="journey-icon"><span className="glyph" aria-hidden="true">GH</span></span><span><strong>{t.journey}</strong><small>{t.journeyText}</small></span><span className="glyph" aria-hidden="true">↗</span></a>
      </section>
      <div className="final-world">
      <div className="world-tree" aria-hidden="true"><Image src="/art/ivory-tree.webp" alt="" width={1080} height={1440} sizes="(max-width: 700px) 115vw, 70vw"/><span className="world-veil"/>{Array.from({length:13},(_,i)=><i key={i} className="world-spore" style={{"--i":i} as React.CSSProperties}/>)}</div>
      <section id="now" className="section now-section">
        <div className="section-heading reveal"><div><span className="eyebrow">02 — {text("RIGHT NOW","حاليًا")}</span><h2 className="signal-heading" data-text={text("Lately.","هذه الأيام.")}>{text("Lately.","هذه الأيام.")}</h2></div><p>{text("What I’ve been studying and trying lately.","ما أدرسه وأجرّبه هذه الفترة.")}</p></div>
        <div className="now-layout">
          <div className="now-lead reveal"><span className="now-kicker">{text("ON MY DESK","على مكتبي الآن")}</span><p>{text("Lately I’ve been practising Java, working through university courses, and reading about AI. I try new ideas in small projects.","هذه الفترة أتدرّب على Java، وأتابع دراستي الجامعية، وأقرأ عن الذكاء الاصطناعي. أجرّب الأفكار الجديدة في مشاريع صغيرة.")}</p></div>
          <div className="now-telemetry reveal" aria-label={text("My current areas of focus","مجالات تركيزي الحالية")}>
            <div className="telemetry-top"><span>{text("CURRENT FOCUS","تركيزي الآن")}</span><span className="pulse-live"><i/>{text("IN PROGRESS","مستمر")}</span></div>
            <div className="energy-track" aria-hidden="true"><span/></div>
            <p className="energy-note">{text("Still working on these.","ما زلت أعمل عليها.")}</p>
            <div className="focus-list"><div><span>01</span><strong>{text("University","الجامعة")}</strong><small>{text("Computer Science and AI","علوم الحاسوب والذكاء الاصطناعي")}</small></div><div><span>02</span><strong>Java</strong><small>{text("Practising the basics","أتدرّب على الأساسيات")}</small></div><div><span>03</span><strong>{text("Side projects","مشاريع جانبية")}</strong><small>{text("Trying ideas by building them","أجرّب الأفكار ببنائها")}</small></div></div>
          </div>
        </div>
      </section>
      <section id="about" className="section about-section">
        <div className="section-heading reveal"><div><span className="eyebrow">03 — {text("ABOUT","عني")}</span><h2 className="signal-heading" data-text={text("How I got here.","كيف وصلت إلى هنا.")}>{text("How I got here.","كيف وصلت إلى هنا.")}</h2></div></div>
        <div className="about-grid"><aside className="profile-panel reveal"><span className="profile-index" aria-hidden="true">02 / PROFILE</span><h3>{text("Adnan Naous","عدنان نعوس")}</h3><p>{t.educationNow}</p><div className="education"><span className="eyebrow">{t.educationLabel}</span><strong>{t.educationSchool}</strong><p>{t.educationNow}</p><strong>{text("Ain Shams University","جامعة عين شمس")}</strong><p>{text("Human Medicine · Previous study, 2 years","الطب البشري · دراسة سابقة، سنتان")}</p></div><a className="button secondary" href="/documents/adnan-naous-cv.pdf" target="_blank" rel="noreferrer"><span className="glyph" aria-hidden="true">PDF</span>{text("View my CV","عرض سيرتي الذاتية")}<span className="glyph" aria-hidden="true">↗</span></a></aside>
        <div className="about-story"><div className="reveal"><h3>{t.biography}</h3><p>{t.background}</p></div><div className="reveal"><span className="eyebrow">{t.focusLabel}</span><p>{t.focus}</p></div><div className="reveal"><span className="eyebrow">{t.nextLabel}</span><p>{t.nextStep}</p></div><a id="recognition" className="certificate reveal" href={certificate.documentPath} target="_blank" rel="noreferrer"><span className="certificate-index">2026</span><span>{t.recognition}<small>{t.certificate}</small></span><span className="glyph" aria-hidden="true">↗</span></a></div></div>
      </section>
      <section id="contact" className="section contact-section reveal">
        <div className="contact-halo" aria-hidden="true"/><div className="contact-signal" aria-hidden="true"><i/><i/><i/><i/><i/></div><span className="eyebrow">04 — {text("CONTACT","تواصل")}</span><h2>{text("Have something in mind?","عندك فكرة أو فرصة؟")}<br/><span>{text("Send me a note.","راسلني.")}</span></h2><p>{t.availability}<br/>{t.availabilitySecond}</p><div className={`overheat-zone${contactVisible?" heating":""}${overheated?" overheated":""}`}><div className="heat-meter" aria-hidden="true"><span/></div>{!overheated&&<a className="button primary contact-button signal-button" href={contact.href}><span className="glyph" aria-hidden="true">@</span>{t.email}<span className="glyph" aria-hidden="true">↗</span></a>}{overheated&&<button className="restore-signal" onClick={()=>setOverheated(false)}>{text("Signal overheated. Bring it back ↻","اختفت الإشارة. أعدها ↻")}</button>}</div><div className="email-row"><a href={contact.href} dir="ltr">{contact.value}</a><button className="copy" onClick={copyEmail} aria-label={text("Copy email","نسخ البريد")}>{copied?<span className="glyph" aria-hidden="true">✓</span>:<span className="glyph" aria-hidden="true">⧉</span>}</button></div><span className="copy-status" role="status">{copied?text("Email copied","تم نسخ البريد"):copyError?text("Please select and copy the email above.","حدد عنوان البريد أعلاه وانسخه."):""}</span><div className="socials">{socials.map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.label}<span className="glyph" aria-hidden="true">↗</span></a>)}</div>
      </section>
      </div>
    </main>
    <footer className="wrap"><span>© {new Date().getFullYear()} {text("Adnan Naous","عدنان نعوس")}</span><a href="#home">{text("Back to top","إلى الأعلى")}<span className="glyph" aria-hidden="true">↗</span></a></footer>
    <dialog ref={dialog} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-labelledby="project-title"><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label={text("Close project","إغلاق المشروع")}><span className="glyph" aria-hidden="true">×</span></button>{selected!==null&&<div className="dialog-content"><span className="eyebrow">{projects[selected].category[lang]}</span><h2 id="project-title">{projects[selected].title[lang]}</h2><p>{projects[selected].summary[lang]}</p>{projects[selected].sections.map(s=><div key={s.title.en}><h3>{s.title[lang]}</h3><p>{s.body[lang]}</p></div>)}<a className="button primary hardware-button" href={projects[selected].repositoryUrl} target="_blank" rel="noreferrer"><span className="glyph" aria-hidden="true">GH</span>{t.source}<span className="glyph" aria-hidden="true">→</span></a></div>}</dialog>
  </>;
}
