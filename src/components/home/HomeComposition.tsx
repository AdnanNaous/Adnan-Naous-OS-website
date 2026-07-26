import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Command, Focus, Library, Radio } from "lucide-react";
import { AICore } from "@/components/ai-core/AICore";
import { publicData } from "@/data/public";
import type { HomepageContent } from "./homeContent";
import styles from "./home.module.css";

const toolIcons = {
  "focus-timer": Focus,
  "command-center": Command,
  "github-activity": Radio,
  "resource-library": Library,
} as const;

export function HomeComposition({ content }: { content: HomepageContent }) {
  const language = content.language;
  const isArabic = language === "ar";
  const projects = publicData.homepage.verifiedProjectIds
    .map((id) => publicData.projects.find((project) => project.id === id))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
  const featured = projects.find((project) => project.id === publicData.homepage.featuredProjectId);
  const credential = publicData.credentials[0];
  const previewTools = publicData.homepage.personalOSPreview.moduleIds
    .map((id) => publicData.personalOS.tools.find((tool) => tool.id === id))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const copy = isArabic ? {
    heroLabel: "ملف أعمال ونظام شخصي",
    mission: "01 / المهمة الحالية",
    work: "02 / عمل موثّق",
    workTitle: "ثلاثة أنظمة، ودليل عام لكل منها.",
    caseStudy: "03 / دراسة حالة مميزة",
    process: "04 / كيف أبني",
    capabilities: "05 / القدرات الحالية",
    recognition: "06 / التقدير",
    personalOS: "07 / معاينة النظام الشخصي",
    opportunity: "08 / الفرص",
    repository: "فتح المستودع",
    live: "زيارة الموقع",
    caseStudyLink: "قراءة دراسة الحالة",
    allProjects: "استكشاف كل المشاريع",
    capabilitiesLink: "القدرات وحدودها",
    certificate: "فتح الشهادة",
    openWorkspace: "فتح النظام الشخصي",
    contact: "ابدأ محادثة",
    status: { demonstrated: "مُثبت", developing: "قيد التطوير", planned: "مخطط" },
  } : {
    heroLabel: "Portfolio and Personal OS",
    mission: "01 / Current mission",
    work: "02 / Verified work",
    workTitle: "Three systems, each connected to public evidence.",
    caseStudy: "03 / Featured case study",
    process: "04 / How I build",
    capabilities: "05 / Current capabilities",
    recognition: "06 / Recognition",
    personalOS: "07 / Personal OS preview",
    opportunity: "08 / Opportunity",
    repository: "Open repository",
    live: "Visit live site",
    caseStudyLink: "Read the case study",
    allProjects: "Explore all projects",
    capabilitiesLink: "Capabilities and boundaries",
    certificate: "Open certificate",
    openWorkspace: "Open the Personal OS",
    contact: "Start a conversation",
    status: { demonstrated: "Demonstrated", developing: "Developing", planned: "Planned" },
  };

  return (
    <main className={styles.main} data-homepage-scene dir={isArabic ? "rtl" : "ltr"}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.lightColumn} aria-hidden="true" />

      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.identity}>
          <p className={styles.eyebrow}>{copy.heroLabel} · {content.displayName}</p>
          <h1 id="home-title" className={styles.title}>{content.primaryTitle}</h1>
          <p className={styles.biography}>{publicData.profile.extendedBiography[language]}</p>
        </div>
        <div className={styles.coreWrap}>
          <AICore />
          <span className={styles.coreLabel} aria-hidden="true">AI / CORE</span>
        </div>
        <div className={styles.actions}>
          <Link href="/portfolio" className={`${styles.primaryAction} ds-glass ds-glass-button`}>
            {content.ui.viewProjects}<ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/about" className={`${styles.secondaryAction} ds-glass ds-glass-chip`}>
            {content.ui.aboutMe}
          </Link>
        </div>
        <div className={styles.context}>
          <span>{content.location}</span><span aria-hidden="true">·</span><span>{content.currentStatus}</span>
        </div>
      </section>

      <section className={`${styles.mission} ${styles.section}`} aria-labelledby="mission-title">
        <p className={styles.sectionKicker}>{copy.mission}</p>
        <div>
          <h2 id="mission-title">{publicData.homepage.mission.title[language]}</h2>
          <p>{publicData.homepage.mission.description[language]}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="verified-work-title">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>{copy.work}</p>
          <h2 id="verified-work-title">{copy.workTitle}</h2>
        </div>
        <div className={styles.projectRail}>
          {projects.map((project, index) => (
            <article key={project.id} className={`${styles.projectCard} ds-glass ds-glass-project-card`}>
              <div className={styles.cardTop}>
                <span>0{index + 1}</span>
                <span>{project.status}</span>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description[language]}</p>
              <div className={styles.cardLinks}>
                <Link href={`/portfolio#${project.id}`}>{copy.caseStudyLink}<ArrowRight size={14} aria-hidden="true" /></Link>
                {project.repositoryUrl ? <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">{copy.repository}<ArrowUpRight size={14} aria-hidden="true" /></a> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {featured?.caseStudy ? (
        <section className={`${styles.featured} ${styles.section}`} aria-labelledby="featured-case-title">
          <div className={styles.featuredCopy}>
            <p className={styles.sectionKicker}>{copy.caseStudy}</p>
            <h2 id="featured-case-title">{featured.name}</h2>
            <p>{featured.caseStudy.purpose[language]}</p>
            <dl>
              <div><dt>{isArabic ? "القرار" : "Decision"}</dt><dd>{featured.caseStudy.technicalDecisions[0][language]}</dd></div>
              <div><dt>{isArabic ? "القيد" : "Constraint"}</dt><dd>{featured.caseStudy.constraints[0][language]}</dd></div>
              <div><dt>{isArabic ? "النتيجة الحالية" : "Current result"}</dt><dd>{featured.caseStudy.solution[language]}</dd></div>
            </dl>
            <div className={styles.inlineActions}>
              <Link href={`/portfolio#${featured.id}`}>{copy.caseStudyLink}<ArrowRight size={14} aria-hidden="true" /></Link>
              {featured.liveUrl ? <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer">{copy.live}<ArrowUpRight size={14} aria-hidden="true" /></a> : null}
            </div>
          </div>
          {featured.assets[0] ? (
            <div className={`${styles.featuredVisual} ds-glass ds-glass-panel`}>
              <Image src={featured.assets[0].publicPath} alt={featured.assets[0].alt[language]} width={featured.assets[0].width} height={featured.assets[0].height} sizes="(max-width: 52rem) 92vw, 46vw" />
            </div>
          ) : null}
        </section>
      ) : null}

      <section className={`${styles.processSection} ${styles.section}`} aria-labelledby="process-title">
        <div className={styles.sectionIntro}><p className={styles.sectionKicker}>{copy.process}</p><h2 id="process-title">{publicData.homepage.statement[language]}</h2></div>
        <ol className={styles.process}>
          {publicData.homepage.process.map((step, index) => (
            <li key={step.id}><span>0{index + 1}</span><div><h3>{step.title[language]}</h3><p>{step.description[language]}</p></div></li>
          ))}
        </ol>
      </section>

      <section className={`${styles.capabilities} ${styles.section}`} aria-labelledby="capabilities-title">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionKicker}>{copy.capabilities}</p>
          <h2 id="capabilities-title">{isArabic ? "قدرات مرتبطة بعمل يمكن فحصه." : "Capabilities tied to work you can inspect."}</h2>
        </div>
        <div className={styles.capabilityGrid}>
          {publicData.capabilities.map((capability) => (
            <article key={capability.id}>
              <span className={styles.status}><Check size={12} aria-hidden="true" />{copy.status[capability.status]}</span>
              <h3>{capability.title[language]}</h3>
              <p>{capability.description[language]}</p>
              <small>{capability.boundaries[0][language]}</small>
            </article>
          ))}
        </div>
        <Link className={styles.sectionLink} href="/services">{copy.capabilitiesLink}<ArrowRight size={14} aria-hidden="true" /></Link>
      </section>

      <section className={`${styles.recognition} ${styles.section} ds-glass ds-glass-certificate-card`} aria-labelledby="recognition-title">
        <div>
          <p className={styles.sectionKicker}>{copy.recognition}</p>
          <h2 id="recognition-title">{credential.title}</h2>
          <p>{credential.credentialType} · {credential.program}</p>
        </div>
        <dl>
          <div><dt>{isArabic ? "الإكمال" : "Completed"}</dt><dd>{credential.completionDate}</dd></div>
          <div><dt>{isArabic ? "المشروع" : "Featured project"}</dt><dd>{credential.featuredProject}</dd></div>
        </dl>
        <a href={credential.documentPath} target="_blank" rel="noopener noreferrer">{copy.certificate}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </section>

      <section className={`${styles.osPreview} ${styles.section}`} aria-labelledby="os-preview-title">
        <div className={styles.osCopy}>
          <p className={styles.sectionKicker}>{copy.personalOS}</p>
          <h2 id="os-preview-title">{publicData.homepage.personalOSPreview.title[language]}</h2>
          <p>{publicData.homepage.personalOSPreview.description[language]}</p>
          <Link href="/tools">{copy.openWorkspace}<ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <div className={`${styles.osMap} ds-glass ds-glass-panel`}>
          {previewTools.map((tool) => {
            const Icon = toolIcons[tool.id];
            return <div key={tool.id}><Icon size={17} aria-hidden="true" /><span>{tool.title[language]}</span><small>{tool.implementation === "built" ? (isArabic ? "محلي" : "Local") : (isArabic ? "تكامل" : "Integrated")}</small></div>;
          })}
        </div>
      </section>

      <section className={`${styles.opportunity} ${styles.section} ds-glass ds-glass-panel`} aria-labelledby="opportunity-title">
        <div>
          <p className={styles.sectionKicker}>{copy.opportunity}</p>
          <h2 id="opportunity-title">{publicData.homepage.opportunity.title[language]}</h2>
          <p>{publicData.homepage.opportunity.description[language]}</p>
        </div>
        <Link className="ds-button ds-button--primary" href="/contact">{copy.contact}<ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
