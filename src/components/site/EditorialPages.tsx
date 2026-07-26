import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import { publicData } from "@/data/public";
import styles from "./EditorialPages.module.css";

export type PublicLocale = "en" | "ar";

function PageHeader({ eyebrow, title, introduction }: { eyebrow: string; title: string; introduction: string }) {
  return <header className={styles.pageHeader}><p className="ds-label ds-muted">{eyebrow}</p><h1 className="ds-display">{title}</h1><p className={styles.lede}>{introduction}</p><span className={styles.headerRule} aria-hidden="true" /></header>;
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={styles.textLink} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}

function NextStep({ href, label, title }: { href: string; label: string; title: string }) {
  return <aside className={`${styles.nextStep} ds-glass ds-glass-panel`}><p className="ds-label ds-muted">{label}</p><Link href={href}>{title}<ArrowRight size={16} aria-hidden="true" /></Link></aside>;
}

export function AboutExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const portrait = publicData.profile.profileImages.find((image) => image.kind === "portrait");
  const copy = ar ? {
    eyebrow: "القصة الشخصية", title: "من الملاحظة المنظمة إلى بناء الأنظمة.", intro: publicData.profile.extendedBiography.ar,
    transition: "الانتقال", education: "التعليم", focus: "التركيز الحالي", principles: "مبادئ العمل", languages: "اللغات", present: "حتى الآن",
    next: "التالي", nextTitle: "شاهد كيف تتحول هذه الرحلة إلى مشاريع قابلة للفحص.",
  } : {
    eyebrow: "Personal story", title: "From structured observation to building systems.", intro: publicData.profile.extendedBiography.en,
    transition: "The transition", education: "Education", focus: "Current focus", principles: "Working principles", languages: "Languages", present: "Present",
    next: "Continue", nextTitle: "See how this path becomes inspectable project work.",
  };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <section className={styles.storyGrid}>
        <div className={`${styles.portrait} ds-glass ds-glass-panel`}>
          {portrait?.kind === "portrait" ? <Image src={portrait.publicPath} alt={portrait.alt[locale]} width={portrait.width} height={portrait.height} sizes="(max-width: 48rem) 88vw, 38vw" /> : null}
        </div>
        <div className={styles.story}>
          <p className="ds-label ds-muted">{copy.transition}</p>
          <h2 className="ds-heading">{publicData.profile.primaryTitle[locale]}</h2>
          <p>{publicData.about.transition[locale]}</p>
          <p>{publicData.profile.currentStatus[locale]}</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><span>01</span><h2>{copy.education}</h2></div>
        <div className={styles.timeline}>
          {publicData.education.map((entry) => <article key={entry.id} className={`${styles.timelineItem} ds-glass ds-glass-card`}><p className="ds-metadata ds-muted">{entry.startYear}—{entry.endYear ?? copy.present}</p><h3>{entry.program}</h3><p>{entry.institution}{entry.location ? ` · ${entry.location}` : ""}</p><p>{entry.description[locale]}</p></article>)}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><span>02</span><h2>{copy.focus}</h2></div>
        <div className={styles.editorialGrid}>
          {publicData.about.currentFocus.map((item) => <article key={item.id}><h3>{item.title[locale]}</h3><p>{item.description[locale]}</p></article>)}
        </div>
      </section>
      <section className={styles.twoColumn}>
        <div><div className={styles.sectionHeading}><span>03</span><h2>{copy.principles}</h2></div><div className={styles.principleList}>{publicData.about.workingPrinciples.map((item) => <article key={item.id}><h3>{item.title[locale]}</h3><p>{item.description[locale]}</p></article>)}</div></div>
        <div><div className={styles.sectionHeading}><span>04</span><h2>{copy.languages}</h2></div><div className={styles.languageList}>{publicData.languages.map((language) => <p key={language.id}><strong>{language.name[locale]}</strong><span>{language.level[locale]}</span></p>)}</div></div>
      </section>
      <NextStep href="/portfolio" label={copy.next} title={copy.nextTitle} />
    </main>
  );
}

export function PortfolioExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const copy = ar ? {
    eyebrow: "دراسات حالة", title: "ثلاثة مشاريع، مع قراراتها وقيودها وأدلتها.", intro: "عمل عام موثّق يُعرض بالحالة الحالية والتحديات والحدود، دون مقاييس أو نتائج مخترعة.",
    purpose: "الهدف والسياق", problem: "المشكلة", solution: "الحل الحالي", architecture: "المعمارية", constraints: "القيود", decisions: "القرارات التقنية", design: "قرارات التصميم", safety: "الوصول والخصوصية", challenges: "التحديات", functionality: "ما يعمل", lessons: "ما تعلمته", limitations: "القيود الحالية", roadmap: "الخطوة التالية", evidence: "الدليل العام", next: "التالي", nextTitle: "استكشف القدرات التي تدعمها هذه المشاريع.",
  } : {
    eyebrow: "Case studies", title: "Three projects, with their decisions, constraints, and evidence.", intro: "Verified public work presented with current status, challenges, and limitations—not invented metrics or outcomes.",
    purpose: "Purpose and context", problem: "Problem", solution: "Current solution", architecture: "Architecture", constraints: "Constraints", decisions: "Technical decisions", design: "Design decisions", safety: "Accessibility and privacy", challenges: "Challenges", functionality: "What works", lessons: "What I learned", limitations: "Current limitations", roadmap: "Next direction", evidence: "Public evidence", next: "Continue", nextTitle: "Explore the capabilities these projects support.",
  };
  const projects = publicData.projects.filter((project) => project.placement === "main-projects");
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <nav className={styles.caseIndex} aria-label={ar ? "فهرس دراسات الحالة" : "Case study index"}>
        {projects.map((project, index) => <a key={project.id} href={`#${project.id}`}><span>0{index + 1}</span>{project.name}</a>)}
      </nav>
      <div className={styles.caseStudies}>
        {projects.map((project, index) => {
          if (!project.caseStudy) return null;
          const preferredAsset = project.id === "personal-os-portfolio"
            ? project.assets[0]
            : project.assets.find((asset) => asset.kind === "repository-structure") ?? project.assets[0];
          const supportingAssets = project.assets.filter((asset) => asset.id !== preferredAsset?.id);
          const variant = index === 0 ? styles.casePrimary : index === 1 ? styles.caseOffset : styles.caseTechnical;

          return (
            <article id={project.id} key={project.id} className={`${styles.caseStudy} ${variant}`}>
              <header className={styles.caseOpener}>
                <div className={styles.caseIdentity}>
                  <span className={styles.caseNumber}>0{index + 1}</span>
                  <p className="ds-metadata ds-muted">{project.category} · {project.status}</p>
                  <h2>{project.name}</h2>
                </div>
                <div className={styles.caseOpeningCopy}>
                  <p>{project.description[locale]}</p>
                  <p>{project.caseStudy.purpose[locale]}</p>
                </div>
              </header>

              {preferredAsset ? (
                <figure className={`${styles.projectVisual} ${styles.projectHeroVisual} ds-glass ds-glass-project-card`}>
                  <Image
                    src={preferredAsset.publicPath}
                    alt={preferredAsset.alt[locale]}
                    width={preferredAsset.width}
                    height={preferredAsset.height}
                    sizes="(max-width: 52rem) 92vw, 74rem"
                  />
                  <figcaption>{preferredAsset.alt[locale]}</figcaption>
                </figure>
              ) : null}

              <section className={styles.caseNarrative} aria-label={copy.purpose}>
                <div><p className={styles.chapterLabel}>{copy.problem}</p><h3>{project.caseStudy.problem[locale]}</h3></div>
                <div><p className={styles.chapterLabel}>{copy.solution}</p><p>{project.caseStudy.solution[locale]}</p></div>
                <div><p className={styles.chapterLabel}>{copy.architecture}</p><p>{project.caseStudy.architecture[locale]}</p></div>
              </section>

              {supportingAssets.length > 0 ? (
                <section className={styles.evidenceSection} aria-label={copy.evidence}>
                  <div className={styles.sectionHeading}><span>0{index + 1}.1</span><h3>{copy.evidence}</h3></div>
                  <div className={supportingAssets.length > 2 ? styles.evidenceMosaic : styles.evidenceGrid}>
                    {supportingAssets.map((asset) => (
                      <figure key={asset.id} className={`${styles.projectVisual} ds-glass ds-glass-subtle`}>
                        <Image
                          src={asset.publicPath}
                          alt={asset.alt[locale]}
                          width={asset.width}
                          height={asset.height}
                          sizes="(max-width: 52rem) 92vw, 38rem"
                        />
                        <figcaption>{asset.alt[locale]}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className={styles.decisionBand}>
                {[
                  [copy.decisions, project.caseStudy.technicalDecisions],
                  [copy.design, project.caseStudy.designDecisions],
                  [copy.safety, project.caseStudy.accessibilityAndPrivacy],
                ].map(([label, items]) => (
                  <div key={label as string}>
                    <h3>{label as string}</h3>
                    <ul>{(items as typeof project.caseStudy.constraints).map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                  </div>
                ))}
              </section>

              <div className={styles.caseClosing}>
                <section>
                  <h3>{copy.functionality}</h3>
                  <ul>{project.caseStudy.keyFunctionality.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                  <h3>{copy.lessons}</h3>
                  <ul>{project.caseStudy.lessons.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                </section>
                <aside className={styles.caseLimits}>
                  <h3>{copy.limitations}</h3>
                  <ul>{project.caseStudy.limitations.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                  <h3>{copy.constraints}</h3>
                  <ul>{project.caseStudy.constraints.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                </aside>
                <section className={styles.nextDirection}>
                  <h3>{copy.roadmap}</h3>
                  <ul>{project.caseStudy.roadmap.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                  <h3>{copy.challenges}</h3>
                  <ul>{project.caseStudy.challenges.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>
                </section>
              </div>

              <footer className={styles.caseFooter}>
                <div className={styles.chipList}>{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
                <div className={styles.linkCluster}>{project.caseStudy.evidenceLinks.map((link) => <ExternalLink key={link.href} href={link.href}>{link.label[locale]}</ExternalLink>)}</div>
              </footer>
            </article>
          );
        })}
      </div>
      <NextStep href="/services" label={copy.next} title={copy.nextTitle} />
    </main>
  );
}

export function CapabilitiesExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const copy = ar ? {
    eyebrow: "القدرات والتعاون", title: "مساهمة عملية، مع حدود واضحة.", intro: "قدرات مرتبطة بمستودعات عامة وتعلّم حالي، وليست قائمة خدمات تجارية أو سجل عملاء.",
    evidence: "الدليل", boundaries: "الحدود", notYet: "ما لا أقدمه بعد", notYetItems: ["لا أقدم سجل عملاء أو نتائج تجارية غير موجودة.", "لا أقدم نفسي كخبير أو مهندس موظف.", "لا أضمن نتائج صيانة أو أتمتة خالية من المخاطر."], fit: "صيَغ تعاون مناسبة", next: "التالي", nextTitle: "ابدأ محادثة واضحة حول فرصة مناسبة.",
  } : {
    eyebrow: "Capabilities & collaboration", title: "Practical contribution, with clear boundaries.", intro: "Capabilities connected to public repositories and current learning—not a commercial service menu or client history.",
    evidence: "Evidence", boundaries: "Boundaries", notYet: "What I am not presenting yet", notYetItems: ["No client portfolio or commercial outcomes that do not exist.", "No claim of expert status or established engineering employment.", "No guarantee that maintenance or automation is risk-free."], fit: "Good collaboration formats", next: "Continue", nextTitle: "Start a clear conversation about a good-fit opportunity.",
  };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <div className={styles.capabilityGrid}>
        {publicData.capabilities.map((capability, index) => <article key={capability.id} data-status={capability.status} className={`${styles.capability} ds-glass ds-glass-card`}><span>0{index + 1} · {capability.status}</span><h2>{capability.title[locale]}</h2><p>{capability.description[locale]}</p><div><strong>{copy.evidence}</strong>{capability.evidenceProjectIds.map((id) => { const project = publicData.projects.find((item) => item.id === id); return project ? <Link key={id} href={`/portfolio#${id}`}>{project.name}</Link> : null; })}</div><div><strong>{copy.boundaries}</strong>{capability.boundaries.map((item) => <p key={item.en}>{item[locale]}</p>)}</div></article>)}
      </div>
      <div className={styles.boundaryGrid}>
        <section><p className="ds-label ds-muted">{copy.fit}</p><ul>{publicData.contact.opportunityTypes.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></section>
        <section><p className="ds-label ds-muted">{copy.notYet}</p><ul>{copy.notYetItems.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <NextStep href="/contact" label={copy.next} title={copy.nextTitle} />
    </main>
  );
}

export function WritingExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const copy = ar ? { eyebrow: "الكتابة", title: "نظام كتابة جاهز، بلا مقالات مختلقة.", intro: publicData.writing.status.ar, topics: "الموضوعات", principles: "مبادئ التحرير", empty: "لا توجد مقالات منشورة حتى الآن.", next: "مسار ذو صلة", nextTitle: "سجل التعلّم العام موجود في Adnan Naous Journey." }
    : { eyebrow: "Writing", title: "A writing system ready for real work—not invented posts.", intro: publicData.writing.status.en, topics: "Topic clusters", principles: "Editorial principles", empty: "No articles are published yet.", next: "Related path", nextTitle: "The public learning record lives in Adnan Naous Journey." };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <section className={styles.section}><div className={styles.sectionHeading}><span>01</span><h2>{copy.topics}</h2></div><div className={styles.topicGrid}>{publicData.writing.topics.map((topic, index) => <article key={topic.id} className={styles.topic}><span>0{index + 1}</span><h3>{topic.title[locale]}</h3><p>{topic.description[locale]}</p></article>)}</div></section>
      <section className={styles.boundaryGrid}><div><p className="ds-label ds-muted">{copy.principles}</p><ol>{publicData.writing.editorialPrinciples.map((item) => <li key={item.en}>{item[locale]}</li>)}</ol></div><div className={styles.emptyState}><span>{publicData.writing.articles.length.toString().padStart(2, "0")}</span><p>{copy.empty}</p></div></section>
      <aside className={`${styles.nextStep} ds-glass ds-glass-panel`}><p className="ds-label ds-muted">{copy.next}</p><ExternalLink href="https://github.com/AdnanNaous/Adnan-Naous-Journey">{copy.nextTitle}</ExternalLink></aside>
    </main>
  );
}

export function RecognitionExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const credential = publicData.credentials[0];
  const copy = ar ? { eyebrow: "التقدير", title: "سياق موثّق، لا تزكيات مختلقة.", intro: publicData.recognition.statement.ar, open: "فتح الشهادة", details: "بيانات الشهادة", context: "السياق والحدود", next: "التالي", nextTitle: "شاهد المشروع والأدلة التي تقف خلف العمل." }
    : { eyebrow: "Recognition", title: "Verified context, not invented endorsements.", intro: publicData.recognition.statement.en, open: "Open certificate", details: "Credential details", context: "Context and limits", next: "Continue", nextTitle: "See the projects and evidence behind the work." };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <article className={`${styles.credential} ds-glass ds-glass-certificate-card`}>
        <a className={styles.certificatePreview} href={credential.documentPath} target="_blank" rel="noopener noreferrer" aria-label={copy.open}>
          <Image src={credential.preview.publicPath} alt={credential.preview.alt[locale]} width={credential.preview.width} height={credential.preview.height} sizes="(max-width: 52rem) 90vw, 45vw" />
          <span><Download size={17} aria-hidden="true" />{copy.open}</span>
        </a>
        <div><p className="ds-label ds-muted">{credential.credentialType}</p><h2>{credential.title}</h2><p>{credential.program} · {credential.issuer}</p><dl><div><dt>{copy.details}</dt><dd>{credential.credentialId}</dd></div><div><dt>{ar ? "تاريخ الإكمال" : "Completed"}</dt><dd>{credential.completionDate}</dd></div><div><dt>{ar ? "المشروع المميز" : "Featured project"}</dt><dd>{credential.featuredProject}</dd></div></dl><ExternalLink href={credential.documentPath}>{copy.open}</ExternalLink></div>
      </article>
      <section className={styles.recognitionContext}><p className="ds-label ds-muted">{copy.context}</p><p>{publicData.recognition.context[locale]}</p></section>
      <NextStep href="/portfolio" label={copy.next} title={copy.nextTitle} />
    </main>
  );
}

export function ContactExperience({ locale }: { locale: PublicLocale }) {
  const ar = locale === "ar";
  const email = publicData.profile.contacts.find((item) => item.type === "email");
  const copy = ar ? {
    eyebrow: "تواصل", title: "فلنبدأ بفرصة واضحة ومناسبة.", intro: publicData.contact.introduction.ar, opportunities: "فرص مناسبة", contribution: "ما يمكنني المساهمة فيه", preferences: "كيف أفضل التعاون", limits: "حدود صريحة", email: "إرسال بريد", profiles: "ملفات عامة",
  } : {
    eyebrow: "Contact", title: "Start with a clear, good-fit opportunity.", intro: publicData.contact.introduction.en, opportunities: "Good-fit opportunities", contribution: "How I can contribute", preferences: "How I prefer to collaborate", limits: "Explicit limits", email: "Send an email", profiles: "Public profiles",
  };
  return (
    <main className={styles.route} dir={ar ? "rtl" : "ltr"}>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} introduction={copy.intro} />
      <section className={styles.availabilityStatement}>
        <p className="ds-label ds-muted">{ar ? "متاح حاليًا" : "Currently open to"}</p>
        <h2>{publicData.profile.availability[locale]}</h2>
      </section>
      <div className={styles.contactGrid}>
        <section className={`${styles.contactPrimary} ds-glass ds-glass-panel`}><p className="ds-label ds-muted">{copy.opportunities}</p><ul>{publicData.contact.opportunityTypes.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul>{email ? <a className="ds-button ds-button--primary" href={email.href}><Mail size={17} aria-hidden="true" />{copy.email}</a> : null}<p className={styles.note}>{publicData.contact.responseNote[locale]}</p></section>
        <aside className={styles.profileLinks}><p className="ds-label ds-muted">{copy.profiles}</p>{publicData.profile.socialProfiles.map((profile) => <ExternalLink key={profile.id} href={profile.url}>{profile.label}<span>@{profile.handle}</span></ExternalLink>)}</aside>
      </div>
      <div className={styles.contactDetails}>
        <section><h2>{copy.contribution}</h2><ul>{publicData.contact.contributionTypes.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></section>
        <section><h2>{copy.preferences}</h2><ul>{publicData.contact.collaborationPreferences.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></section>
        <aside className={styles.contactLimits}><h2>{copy.limits}</h2><ul>{publicData.contact.limitations.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></aside>
      </div>
    </main>
  );
}
