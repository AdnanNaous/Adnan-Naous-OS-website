"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "@/data/portfolio";

type SectionProps = { lang: Language };

type SkillNode = {
  en: string;
  ar: string;
  detail: { en: string; ar: string };
};

const paths: { en: string; ar: string; nodes: SkillNode[] }[] = [
  {
    en: "FOUNDATIONS", ar: "الأساسيات", nodes: [
      { en: "Programming", ar: "البرمجة", detail: { en: "Programming fundamentals and the logic behind small programs.", ar: "أساسيات البرمجة والمنطق وراء البرامج الصغيرة." } },
      { en: "AI fundamentals", ar: "أساسيات الذكاء الاصطناعي", detail: { en: "Coursework and experiments in introductory AI.", ar: "دراسة وتجارب في مبادئ الذكاء الاصطناعي." } },
    ],
  },
  {
    en: "SYSTEMS", ar: "الأنظمة", nodes: [
      { en: "Windows setup", ar: "إعداد Windows", detail: { en: "Windows installation and configuration.", ar: "تثبيت Windows وإعداده." } },
      { en: "Troubleshooting", ar: "استكشاف الأعطال", detail: { en: "Technical troubleshooting, one cause at a time.", ar: "تشخيص المشكلات التقنية خطوةً خطوة." } },
    ],
  },
  {
    en: "BUILDING", ar: "البناء", nodes: [
      { en: "AI workflows", ar: "سير عمل الذكاء الاصطناعي", detail: { en: "AI agents and assisted workflows as practical tools.", ar: "وكلاء الذكاء الاصطناعي وسير العمل المدعوم بها كأدوات عملية." } },
      { en: "Web projects", ar: "مشاريع الويب", detail: { en: "Web-based project development, including this portfolio.", ar: "تطوير مشاريع الويب، ومنها هذا الموقع." } },
    ],
  },
];

const nodes = paths.flatMap(path => path.nodes);

export function NowSectionV2({ lang }: SectionProps) {
  const ar = lang === "ar";
  const text = (en: string, arabic: string) => ar ? arabic : en;
  const [selected, setSelected] = useState(0);
  const [entered, setEntered] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const current = nodes[selected];

  useEffect(() => {
    const map = mapRef.current;
    if (!map || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  return <section id="now" className="content-section now-section now-v2" aria-labelledby="now-title">
    <div className="section-head reveal">
      <p className="section-index">03 / {text("RIGHT NOW", "حاليًا")}</p>
      <h2 id="now-title" className="section-title">{text("The skills I’m building.", "المهارات التي أبنيها.")}</h2>
      <p className="section-lead">{text("A living map of what I study and practice. Select a node to read more.", "خريطة لما أدرسه وأتدرّب عليه. اختر عقدة لتعرف المزيد.")}</p>
    </div>

    <div ref={mapRef} className={`now-v2-map${entered ? " is-entered" : ""}`}>
      <div className="now-v2-topline" aria-hidden="true"><span>AN.OS / 03</span><span>{text("LIVE SKILL MAP", "خريطة المهارات")}</span><span>06 / 06</span></div>
      <div className="now-v2-origin">
        <div className="now-v2-origin-mark" aria-hidden="true"><span /></div>
        <div className="now-v2-origin-copy">
          <span className="now-v2-kicker">01 / {text("CURRENT PATH", "المسار الحالي")}</span>
          <strong>{text("Computer Science + AI", "علوم الحاسوب + الذكاء الاصطناعي")}</strong>
          <small>{text("Arab Open University · Jeddah", "الجامعة العربية المفتوحة · جدة")}</small>
        </div>
        <div className="now-v2-energy">
          <div className="now-v2-energy-label"><span>{text("CURRENT ENERGY", "الطاقة الحالية")}</span><strong>70%</strong></div>
          <div className="now-v2-energy-bars" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={70} aria-label={text("Current energy", "الطاقة الحالية")}>{Array.from({ length: 10 }, (_, index) => <i className={index < 7 ? "is-filled" : ""} key={index} />)}</div>
        </div>
      </div>

      <div className="now-v2-paths" aria-label={text("Skill paths", "مسارات المهارات")}>
        {paths.map((path, pathIndex) => <div className="now-v2-path" key={path.en}>
          <div className="now-v2-path-heading"><span className="now-v2-path-index">0{pathIndex + 1}</span><h3>{path[ar ? "ar" : "en"]}</h3><span className="now-v2-path-count">02 {text("NODES", "عقدتان")}</span></div>
          <div className="now-v2-node-list">
            {path.nodes.map((node, nodeIndex) => {
              const index = pathIndex * 2 + nodeIndex;
              return <button key={node.en} type="button" className={`now-v2-node${selected === index ? " is-selected" : ""}`} aria-pressed={selected === index} aria-controls="now-v2-readout" onClick={() => setSelected(index)}>
                <span className="now-v2-node-glyph" aria-hidden="true"><span /></span>
                <span className="now-v2-node-body"><span>0{index + 1} / {text("SKILL", "مهارة")}</span><strong>{node[ar ? "ar" : "en"]}</strong></span>
                <span className="now-v2-node-arrow" aria-hidden="true">↗</span>
              </button>;
            })}
          </div>
        </div>)}
      </div>

      <div id="now-v2-readout" className="now-v2-readout" aria-live="polite" aria-atomic="true">
        <div className="now-v2-readout-label"><span>{text("SELECTED NODE", "العقدة المختارة")}</span><strong>0{selected + 1} / 06</strong></div>
        <div className="now-v2-readout-copy"><strong>{current[ar ? "ar" : "en"]}</strong><p>{current.detail[lang]}</p></div>
        <span className="now-v2-readout-end" aria-hidden="true">[ + ]</span>
      </div>
    </div>
  </section>;
}
