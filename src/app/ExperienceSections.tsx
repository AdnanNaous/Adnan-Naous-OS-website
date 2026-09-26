"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contact, copy, projects, socials, type Language } from "@/data/portfolio";

type SectionProps = { lang: Language };

export function WorkSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const section = useRef<HTMLElement>(null);
  const timer = useRef<number | null>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const run = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(2);
      return;
    }
    setPhase(1);
    timer.current = window.setTimeout(() => setPhase(2), 850);
  }, []);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        run();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [run]);

  return <section id="work" ref={section} className={`content-section work-section work-phase-${phase}`} aria-labelledby="work-title">
    <div className="section-head reveal">
      <p className="section-index">02 / {text("SELECTED WORK", "أعمال مختارة")}</p>
      <h2 id="work-title" className="section-title">{text("Built, tested, revised.", "أبني، أجرّب، وأحسّن.")}</h2>
      <p className="section-lead">{text("Two projects in progress. The build log opens them below.", "مشروعان قيد التطوير. يبدأ سجل البناء ثم تظهر تفاصيلهما.")}</p>
    </div>
    <div className="work-compiler reveal">
      <div className="compiler-prompt"><span>adnan@portfolio:~/work</span><code> $ build --projects</code></div>
      <button className="script-button" type="button" onClick={run} aria-label={text("Replay project build", "أعد تشغيل عرض المشاريع")}>{phase === 2 ? text("REPLAY ↻", "أَعِد ↻") : text("RUN ▶", "شغّل ▶")}</button>
      <div className="compiler-output" role="status" aria-live="polite">
        <span>{phase === 0 ? text("Awaiting command", "بانتظار الأمر") : phase === 1 ? text("Compiling project index...", "تجميع فهرس المشاريع...") : text("2 projects indexed. Open a record below.", "تم فهرسة مشروعين. افتح سجلًا أدناه.")}</span>
        <span className="compiler-caret" aria-hidden="true">▮</span>
      </div>
    </div>
    <div className="project-list">
      {projects.map((project, index) => <article className="project-entry reveal" key={project.slug}>
        <button className="project-trigger" type="button" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
          <span className="project-number">0{index + 1} / {project.category[lang]}</span>
          <span className="project-main"><strong>{project.title[lang]}</strong><span>{project.summary[lang]}</span></span>
          <span className="project-verb">{expanded === index ? text("CLOSE −", "أغلق −") : text("OPEN +", "افتح +")}</span>
        </button>
        <div id={`project-detail-${index}`} className="project-detail" hidden={expanded !== index}>
          <div className="project-detail-grid">{project.sections.map(item => <div key={item.title.en}><h3>{item.title[lang]}</h3><p>{item.body[lang]}</p></div>)}</div>
          <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">{text("View code on GitHub ↗", "شاهد الكود على GitHub ↗")}</a>
        </div>
      </article>)}
    </div>
  </section>;
}

export function NowSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  return <section id="now" className="content-section now-section" aria-labelledby="now-title">
    <div className="section-head reveal"><p className="section-index">03 / {text("RIGHT NOW", "حاليًا")}</p><h2 id="now-title" className="section-title">{text("On my desk.", "ما أعمل عليه الآن.")}</h2><p className="section-lead">{text("One foundation. Two paths I keep practising.", "أساس واحد، ومساران أواصل التدريب فيهما.")}</p></div>
    <div className="now-list skill-tree reveal">
      <div className="now-item now-item-feature skill-root"><span>01 / {text("FOUNDATION", "الأساس")}</span><div className="now-feature-center"><h3>{text("University", "الجامعة")}</h3><p>{text("Computer Science and AI coursework at Arab Open University.", "أدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة.")}</p></div>
        <div className="activity-status"><div className="activity-title"><span>{text("CURRENT ENERGY", "الطاقة الحالية")}</span><strong>70%</strong></div><div className="activity-bars" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={70} aria-label={text("Current energy", "الطاقة الحالية")}>{Array.from({ length: 10 }, (_, index) => <i className={index < 7 ? "is-filled" : ""} key={index} />)}</div><small>{text("Studying · building · practising", "أدرس · أبني · أتدرّب")}</small></div>
      </div>
      <div className="skill-branches" aria-hidden="true"><span/><span/></div>
      <div className="now-item skill-branch"><span>02 / {text("PRACTICE", "تدريب")}</span><h3>Java</h3><p>{text("Small programs, written and rewritten until the fundamentals click.", "أكتب برامج صغيرة وأعود لتحسينها حتى أفهم الأساسيات جيدًا.")}</p></div>
      <div className="now-item skill-branch"><span>03 / {text("EXPLORATION", "استكشاف")}</span><h3>{text("AI experiments", "تجارب الذكاء الاصطناعي")}</h3><p>{text("Reading, testing ideas, and finding where the tools actually help.", "أقرأ وأختبر الأفكار لأعرف أين تفيد هذه الأدوات فعلًا.")}</p></div>
    </div>
  </section>;
}

export function CodexSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const [selected, setSelected] = useState(0);
  const objectives = [
    { code: "LEARN", arCode: "أتعلّم", title: text("Build a strong foundation in computer science and AI.", "أبني أساسًا قويًا في علوم الحاسوب والذكاء الاصطناعي."), note: text("University study, Java practice, and experiments.", "دراسة جامعية، وتدريب على Java، وتجارب عملية.") },
    { code: "MAKE", arCode: "أبني", title: text("Turn what I learn into useful software.", "أحوّل ما أتعلمه إلى برامج مفيدة."), note: text("Real projects, tested and revised in public.", "مشاريع حقيقية أختبرها وأحسّنها علنًا.") },
    { code: "CONTRIBUTE", arCode: "أساهم", title: text("Grow into a role where I can help a team ship better work.", "أنمو في دور أساهم فيه مع فريق يبني عملًا أفضل."), note: text("Looking for an internship or junior opportunity.", "أبحث عن تدريب أو فرصة للمبتدئين.") },
  ];
  const objective = objectives[selected];
  return <section id="codex" className="content-section codex-section" aria-labelledby="codex-title">
    <div className="codex-top reveal"><p className="section-index">04 / {text("CODEX · LONG GAME", "السجل · المدى البعيد")}</p><h2 id="codex-title" className="section-title">{text("The long game.", "ما أسعى إليه.")}</h2><p className="section-lead">{text("A working log of the direction I’m taking, not a finished checklist.", "سجل للاتجاه الذي أسير نحوه، لا قائمة منجزة.")}</p></div>
    <div className="codex-console reveal"><div className="codex-console-head"><span>AN / CODEX</span><span>{text("SELECT OBJECTIVE", "اختر هدفًا")}</span></div>
      <div className="codex-console-body"><ol className="codex-menu">{objectives.map((item, index) => <li key={item.code}><button type="button" className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>0{index + 1} / {ar ? item.arCode : item.code}</span><strong>{item.title}</strong><small aria-hidden="true">{selected === index ? "◆" : "◇"}</small></button></li>)}</ol>
      <div className="codex-detail" key={selected}><div className="codex-sigil" aria-hidden="true"><span>AN</span></div><div className="codex-detail-copy"><span className="codex-status">{text("OBJECTIVE IN PROGRESS", "هدف قيد العمل")}</span><strong>{objective.title}</strong><p>{objective.note}</p><small>0{selected + 1} / 03 · {text("THE RECORD CONTINUES", "والسجل مستمر")}</small></div></div></div>
    </div>
  </section>;
}

export function AboutSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const [step, setStep] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const labels = [text("FIRST CHAPTER", "الفصل الأول"), text("A NEW DIRECTION", "مسار جديد"), text("WHAT’S NEXT", "ما القادم")];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!track.current || !stage.current) return;
        const rect = track.current.getBoundingClientRect();
        const travel = Math.max(1, rect.height - innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / travel));
        setStep(Math.min(2, Math.floor(progress * 3)));
        stage.current.style.setProperty("--beacon-position", `${8 + progress * 84}%`);
        stage.current.style.setProperty("--story-fill", `${progress * 100}%`);
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
  }, []);

  const goTo = (index: number) => {
    if (!track.current) return;
    const top = track.current.getBoundingClientRect().top + scrollY;
    const travel = Math.max(1, track.current.offsetHeight - innerHeight);
    scrollTo({ top: top + travel * (index + 0.12) / 3, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <section id="about" className="content-section about-section" aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">05 / {text("BACKGROUND", "نبذة عني")}</p><h2 id="about-title" className="section-title">{text("How I got here.", "كيف وصلت إلى هنا.")}</h2></div>
    <div className="story-track" ref={track}><div className="story-stage" ref={stage}>
      <div className="story-orbit" aria-hidden="true"><span className="story-beacon">✦</span></div>
      <div className="story-progress" aria-hidden="true"><span/></div>
      {copy[lang].story.map((beat, index) => <div className={`story-panel${step === index ? " is-active" : ""}`} key={index}><span className="story-marker">0{index + 1} / {labels[index]}</span><p>{beat}</p></div>)}
      <div className="story-controls"><button type="button" disabled={step === 0} onClick={() => goTo(step - 1)} aria-label={text("Previous chapter", "الفصل السابق")}>←</button><span>0{step + 1} / 03</span><button type="button" disabled={step === 2} onClick={() => goTo(step + 1)} aria-label={text("Next chapter", "الفصل التالي")}>→</button></div>
    </div></div>
    <div className="about-actions reveal"><a className="command-action command-action-quiet cv-command" href="/documents/adnan-naous-cv.pdf" target="_blank" rel="noreferrer"><span>{text("> open_cv.pdf", "> افتح_السيرة.pdf")}</span><span className="action-tail">↗</span></a><span className="cv-note">{"// "}{text("the paper version of my story", "نسخة ورقية من قصتي")}</span></div>
  </section>;
}

export function ContactSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const section = useRef<HTMLElement>(null);
  const [signal, setSignal] = useState<"ready" | "lost">("ready");

  useEffect(() => {
    const node = section.current;
    if (!node || signal === "lost" || matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const action = node.querySelector<HTMLAnchorElement>(".contact-action");
    if (!action) return;
    let timer: number | null = null;
    let entered = false;
    const clear = () => { if (timer !== null) clearTimeout(timer); timer = null; };
    const schedule = () => { if (!entered) return; clear(); timer = window.setTimeout(() => { if (!action.matches(":hover, :focus")) setSignal("lost"); }, 8000); };
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { entered = true; schedule(); observer.disconnect(); } }, { threshold: 0.4 });
    observer.observe(node);
    action.addEventListener("pointerenter", clear);
    action.addEventListener("pointerleave", schedule);
    action.addEventListener("focus", clear);
    action.addEventListener("blur", schedule);
    return () => { clear(); observer.disconnect(); action.removeEventListener("pointerenter", clear); action.removeEventListener("pointerleave", schedule); action.removeEventListener("focus", clear); action.removeEventListener("blur", schedule); };
  }, [signal]);

  return <section id="contact" ref={section} className="content-section contact-section" aria-labelledby="contact-title">
    <div className="contact-content reveal"><p className="section-index">06 / {text("CONTACT", "تواصل")}</p><h2 id="contact-title" className="section-title">{text("Let’s talk.", "خلّينا نحكي.")}</h2>
      <div className="contact-transmission"><div className="transmission-head"><span>AN / FINAL TRANSMISSION</span><span>{signal === "ready" ? text("CHANNEL OPEN", "القناة مفتوحة") : text("SIGNAL LOST", "انقطعت الإشارة")}</span></div>
        <a className={`contact-action${signal === "lost" ? " is-lost" : ""}`} href={contact.href} aria-hidden={signal === "lost"} tabIndex={signal === "lost" ? -1 : undefined}><span className="contact-glitch" data-label={text("PRESS TO SEND", "اضغط للإرسال")}>{text("PRESS TO SEND", "اضغط للإرسال")}</span><span aria-hidden="true">↗</span></a>
        {signal === "lost" && <button className="contact-recall" type="button" onClick={() => setSignal("ready")}>{text("> REOPEN CHANNEL ↻", "> أعد فتح القناة ↻")}</button>}
        <div className="transmission-foot"><span>{text("A note from you starts the next conversation.", "رسالتك قد تبدأ المحادثة القادمة.")}</span><a href={contact.href}>{contact.value} ↗</a></div>
      </div>
      <div className="social-line">{socials.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}<small>{social.handle}</small></span><span aria-hidden="true">↗</span></a>)}</div>
    </div>
  </section>;
}
