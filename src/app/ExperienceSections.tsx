"use client";

import { useEffect, useRef, useState } from "react";
import { contact, copy, socials, type Language } from "@/data/portfolio";

type SectionProps = { lang: Language };
export function CodexSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setSelected(index => (index + 1) % 3), 6000);
    return () => window.clearTimeout(timer);
  }, [visible, selected]);
  const objectives = [
    { code: "LEARN", arCode: "أتعلّم", title: text("Build a strong foundation in computer science and AI.", "أبني أساسًا قويًا في علوم الحاسوب والذكاء الاصطناعي."), note: text("University study, Java practice, and experiments.", "دراسة جامعية، وتدريب على Java، وتجارب عملية.") },
    { code: "MAKE", arCode: "أبني", title: text("Turn what I learn into useful software.", "أحوّل ما أتعلمه إلى برامج مفيدة."), note: text("Real projects, tested and revised in public.", "مشاريع حقيقية أختبرها وأحسّنها علنًا.") },
    { code: "CONTRIBUTE", arCode: "أساهم", title: text("Grow into a role where I can help a team ship better work.", "أنمو في دور أساهم فيه مع فريق يبني عملًا أفضل."), note: text("Looking for an internship or junior opportunity.", "أبحث عن تدريب أو فرصة للمبتدئين.") },
  ];
  const objective = objectives[selected];
  return <section id="codex" ref={section} className="content-section codex-section" aria-labelledby="codex-title">
    <div className="codex-top reveal"><p className="section-index">04 / {text("CODEX · LONG GAME", "السجل · المدى البعيد")}</p><h2 id="codex-title" className="section-title">{text("The long game.", "ما أسعى إليه.")}</h2><p className="section-lead">{text("A working log of the direction I’m taking, not a finished checklist.", "سجل للاتجاه الذي أسير نحوه، لا قائمة منجزة.")}</p></div>
    <div className="codex-console reveal"><div className="codex-console-head"><span>AN / LONG-RANGE RECORD</span><span>{text("AUTO CYCLE · SELECT ANY CHAPTER", "تنتقل الفصول تلقائيًا · اختر أي فصل")}</span></div>
      <div className="codex-console-body"><ol className="codex-menu">{objectives.map((item, index) => <li key={item.code}><button type="button" className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)} aria-pressed={selected === index} aria-label={`0${index + 1}: ${item.title}`}><span>0{index + 1} / {text("CHAPTER", "الفصل")}</span><strong>{ar ? item.arCode : item.code}</strong></button></li>)}</ol>
      <div className="codex-detail" key={selected}><div className="codex-detail-copy"><span className="codex-status">{text("CHAPTER", "الفصل")} 0{selected + 1} / 03</span><strong>{objective.title}</strong><p>{objective.note}</p><small>{text("A direction I keep working toward.", "اتجاه أواصل العمل نحوه.")}</small></div></div></div>
    </div>
  </section>;
}

export function AboutSection({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const [step, setStep] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const labels = [text("THE FIRST PATH", "المسار الأول"), text("THE TURN", "التحوّل"), text("THE FIRST BUILD", "أول بناء"), text("THE THREAD", "الخيط الجامع")];

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
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); cancelAnimationFrame(frame); };
  }, []);

  return <section id="about" className="content-section about-section" aria-labelledby="about-title">
    <div className="section-head reveal"><p className="section-index">05 / {text("BACKGROUND", "نبذة عني")}</p><h2 id="about-title" className="section-title">{text("How I got here.", "كيف وصلت إلى هنا.")}</h2></div>
    <div className="story-track" ref={track}><div className="story-stage" ref={stage}>
      <div className="story-orbit" aria-hidden="true"><span className="story-beacon"/></div>
      <div className="story-progress" aria-hidden="true"><span/></div>
      {copy[lang].story.map((beat, index) => <div className={`story-panel${step === index ? " is-active" : ""}`} key={index}><span className="story-marker">0{index + 1} / {labels[index]}</span><p>{beat}</p></div>)}
      <span className="story-count" aria-hidden="true">0{step + 1} / 04</span>
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
    <div className="contact-content reveal"><p className="section-index">06 / {text("CONTACT", "تواصل")}</p><h2 id="contact-title" className="section-title">{text("Let’s talk.", "خلّينا نحكي.")}</h2>
      <div className="contact-transmission"><div className="transmission-head"><span>AN / FINAL TRANSMISSION</span><span>{signal === "ready" ? text("CHANNEL OPEN", "القناة مفتوحة") : text("SIGNAL PAUSED", "الإشارة معلّقة")}</span></div>
        <div className="transmission-slot">{signal === "ready" ? <a className="contact-action" href={contact.href}><span className="contact-action-copy"><small>{text("01 / NEW MESSAGE", "٠١ / رسالة جديدة")}</small><strong className="contact-glitch">{text("Write an email", "اكتب بريدًا")}</strong></span><span className="contact-action-arrow" aria-hidden="true">↗</span></a> : <button className="contact-recall" type="button" onClick={() => setSignal("ready")}><span className="contact-action-copy"><small>{text("01 / CHANNEL PAUSED", "٠١ / القناة متوقفة")}</small><strong>{text("Reopen email", "أعد فتح البريد")}</strong></span><span className="contact-action-arrow" aria-hidden="true">↻</span></button>}</div>
        <div className="transmission-foot"><span>{text("A note from you starts the next conversation.", "رسالتك قد تبدأ المحادثة القادمة.")}</span><a href={contact.href}>{contact.value} ↗</a></div>
      </div>
      <div className="social-line">{socials.map((social, index) => <a key={social.id} href={social.url} target="_blank" rel="noreferrer"><span className="social-number">0{index + 1}</span><span className="social-name">{social.label}<small>{social.handle}</small></span><span aria-hidden="true">↗</span></a>)}</div>
    </div>
  </section>;
}
