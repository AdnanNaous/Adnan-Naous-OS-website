"use client";

import Link from "next/link";
import { BookmarksWidget } from "@/components/BookmarksWidget";
import { CommandCenter } from "@/components/CommandCenter";
import { GitHubTracker } from "@/components/GitHubTracker";
import { Pomodoro } from "@/components/Pomodoro";
import { useLanguage } from "@/context/LanguageContext";
import { publicData } from "@/data/public";
import styles from "./PersonalOSExperience.module.css";

const widgets = {
  "focus-timer": <Pomodoro />,
  "command-center": <CommandCenter />,
  "github-activity": <GitHubTracker />,
  "resource-library": <BookmarksWidget />,
} as const;

export function PersonalOSExperience() {
  const { language } = useLanguage();
  const ar = language === "ar";
  const copy = ar ? {
    eyebrow: "منتج شخصي عامل",
    map: "خريطة النظام",
    behavior: "السلوك",
    limitation: "الحد",
    privacy: "الخصوصية",
    evidence: "المشروع والسياق التقني",
  } : {
    eyebrow: "A functioning personal product",
    map: "System map",
    behavior: "Behavior",
    limitation: "Limit",
    privacy: "Privacy",
    evidence: "Project and technical context",
  };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <p className="ds-label ds-muted">{copy.eyebrow}</p>
        <h1 className="ds-display">{publicData.personalOS.title[language]}</h1>
        <p>{publicData.personalOS.introduction[language]}</p>
        <p>{publicData.personalOS.productStory[language]}</p>
      </header>
      <section className={styles.systemMap} aria-labelledby="personal-os-map">
        <div><p className="ds-label ds-muted">{copy.map}</p><h2 id="personal-os-map">{ar ? "أربع وحدات، وحدود تشغيل واضحة." : "Four modules, with explicit runtime boundaries."}</h2></div>
        <ol>
          {publicData.personalOS.tools.map((tool, index) => <li key={tool.id}><span>0{index + 1}</span><strong>{tool.title[language]}</strong><small>{tool.implementation === "built" ? (ar ? "مبني محليًا" : "Locally built") : (ar ? "تكامل عام" : "Public integration")}</small></li>)}
        </ol>
      </section>
      <div className={styles.grid}>
        {publicData.personalOS.tools.map((tool) => (
          <section
            key={tool.id}
            className={`${styles.module} ${styles[tool.id]} ds-glass ds-glass-panel`}
            aria-labelledby={`tool-${tool.id}`}
          >
            <header className={styles.moduleHeader}>
              <div>
                <p>{tool.implementation === "built" ? (ar ? "مبني محليًا" : "Locally built") : (ar ? "تكامل عام" : "Public integration")}</p>
                <h2 id={`tool-${tool.id}`}>{tool.title[language]}</h2>
              </div>
              <span>{tool.description[language]}</span>
            </header>
            <div className={styles.widget}>{widgets[tool.id]}</div>
            <dl className={styles.moduleDetails}>
              <div><dt>{copy.behavior}</dt><dd>{tool.behavior[language]}</dd></div>
              <div><dt>{copy.limitation}</dt><dd>{tool.limitation[language]}</dd></div>
              <div><dt>{copy.privacy}</dt><dd>{tool.privacy[language]}</dd></div>
            </dl>
          </section>
        ))}
      </div>
      <p className={styles.privacy}>
        {ar
          ? "يفتح تشغيل موسيقى التركيز تضمينًا خارجيًا من YouTube فقط بعد تفاعل المستخدم. تقويم GitHub يعرض نشاط الملف العام."
          : "Starting focus music loads an external YouTube embed only after user interaction. The GitHub calendar presents public profile activity."}
      </p>
      <aside className={`${styles.evidenceLink} ds-glass ds-glass-panel`}>
        <p className="ds-label ds-muted">{copy.evidence}</p>
        <Link href="/portfolio#personal-os-portfolio">{ar ? "قراءة دراسة حالة Adnan Naous OS Website" : "Read the Adnan Naous OS Website case study"}</Link>
      </aside>
    </main>
  );
}
