import type {
  CertificationEntry,
  EducationEntry,
  LanguageEntry,
  LearningRoadmapEntry,
  WorkshopEntry,
} from "@/types/content";

export const education = [
  {
    id: "aou-bsc-cs-ai",
    institution: "Arab Open University",
    program: "B.Sc. in Computer Science and Artificial Intelligence",
    field: "Computer Science and Artificial Intelligence",
    status: "in-progress",
    startYear: 2025,
    endYear: null,
    location: "Jeddah, Saudi Arabia",
    description: {
      en: "Current undergraduate study. The supplied CV lists introductory computing, programming through OUbuild, and introductory artificial intelligence among the completed or current modules.",
      ar: "دراسة جامعية حالية. تذكر السيرة الذاتية مقدمة في الحوسبة والبرمجة عبر OUbuild ومقدمة في الذكاء الاصطناعي ضمن المقررات الحالية أو المكتملة.",
    },
    grade: {
      value: "3.43 / 4.00",
      verification: "user-confirmed",
      visibility: "hidden",
      conflictStatus: "resolved",
      resumeEligible: true,
      reviewNote: "User-confirmed official GPA. Eligible for later resume use but excluded from public UI, publicData, and search.",
    },
    verification: "user-provided",
    visibility: "public",
    evidence: [
      { sourceId: "supplied-cv-2026-07-12" },
      { sourceId: "repository-about-page" },
      { sourceId: "phase-1-gpa-confirmation-2026-07-22" },
    ],
  },
  {
    id: "ain-shams-human-medicine",
    institution: "Ain Shams University",
    program: "Undergraduate Studies in Human Medicine",
    field: "Human Medicine",
    status: "incomplete-study",
    startYear: 2023,
    endYear: 2025,
    location: "Egypt",
    description: {
      en: "Completed two years of undergraduate medical study. No degree or professional medical qualification was awarded.",
      ar: "أكمل سنتين من الدراسة الجامعية في الطب البشري دون الحصول على درجة أو مؤهل مهني طبي.",
    },
    grade: null,
    verification: "user-provided",
    visibility: "public",
    evidence: [
      { sourceId: "supplied-cv-2026-07-12" },
      { sourceId: "repository-about-page" },
    ],
  },
] satisfies EducationEntry[];

export const certifications = [
  {
    id: "oxford-english-level-8",
    name: "Intensive English Language Program - Level 8",
    issuer: "Oxford English Institute, Saudi Arabia",
    year: 2023,
    status: "completed",
    description: {
      en: "The supplied CV states that a six-month program progressed from Level 6 to Level 9 and that Level 8 was officially certified.",
      ar: "تذكر السيرة الذاتية أن البرنامج المكثف لمدة ستة أشهر امتد من المستوى السادس إلى التاسع، وأن المستوى الثامن موثق رسمياً.",
    },
    credentialUrl: null,
    verification: "requires-confirmation",
    visibility: "hidden-pending-review",
    evidence: [{ sourceId: "supplied-cv-2026-07-12" }],
  },
] satisfies CertificationEntry[];

export const workshops = [
  {
    id: "godot-intensive-workshop",
    name: "Intensive Godot Engine Workshop",
    issuer: null,
    year: 2025,
    relatedProjectId: "godot-workshop-prototype",
    description: {
      en: "A three-day workshop during which a basic prototype was reported as built. It is tracked as workshop/project evidence, not as a certification.",
      ar: "ورشة لمدة ثلاثة أيام ذُكر أنه تم خلالها بناء نموذج أولي بسيط. تُسجّل كدليل على ورشة ومشروع، وليس كشهادة.",
    },
    verification: "requires-confirmation",
    visibility: "hidden-pending-review",
    evidence: [
      { sourceId: "supplied-cv-2026-07-12" },
      { sourceId: "phase-1-confirmation-lock-2026-07-21" },
    ],
  },
] satisfies WorkshopEntry[];

export const languages = [
  {
    id: "english",
    name: { en: "English", ar: "الإنجليزية" },
    level: "Working proficiency; used for university study, technical documentation, and development",
    credential: null,
    verification: "user-provided",
    visibility: "public",
    evidence: [{ sourceId: "phase-1-confirmation-lock-2026-07-21" }],
  },
  {
    id: "arabic",
    name: { en: "Arabic", ar: "العربية" },
    level: "Native",
    credential: null,
    verification: "user-provided",
    visibility: "public",
    evidence: [{ sourceId: "phase-1-confirmation-lock-2026-07-21" }],
  },
] satisfies LanguageEntry[];

export const learningRoadmap = [
  {
    id: "current-cs-ai-degree",
    topic: {
      en: "Computer Science and Artificial Intelligence degree coursework",
      ar: "مقررات علوم الحاسوب والذكاء الاصطناعي",
    },
    status: "current",
    description: {
      en: "Current formal learning through the B.Sc. program at Arab Open University.",
      ar: "تعلم أكاديمي حالي ضمن برنامج البكالوريوس في الجامعة العربية المفتوحة.",
    },
    verification: "user-provided",
    visibility: "public",
    evidence: [{ sourceId: "supplied-cv-2026-07-12" }],
  },
] satisfies LearningRoadmapEntry[];
