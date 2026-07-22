import type { ProfileContent } from "@/types/content";

export const profile = {
  fullName: {
    value: null,
    verification: "user-confirmed",
    visibility: "private",
    evidence: [{ sourceId: "phase-1-privacy-correction-2026-07-22" }],
    reviewNote: "The full legal name is intentionally not stored in the repository. Only the approved public display name may be used.",
  },
  displayName: {
    value: "Adnan Naous",
    verification: "verified",
    visibility: "public",
    evidence: [
      { sourceId: "repository-current-site" },
      { sourceId: "github-profile-audit-2026-07-21" },
      { sourceId: "supplied-cv-2026-07-12" },
    ],
  },
  brand: {
    value: "AN",
    verification: "verified",
    visibility: "public",
    evidence: [{ sourceId: "repository-navbar" }],
  },
  primaryTitle: {
    value: {
      en: "Computer Science Student",
      ar: "طالب علوم حاسوب",
    },
    verification: "verified",
    visibility: "public",
    evidence: [
      { sourceId: "supplied-cv-2026-07-12" },
      { sourceId: "github-profile-audit-2026-07-21" },
    ],
  },
  supportingIdentity: [
    {
      value: { en: "Developer", ar: "مطوّر" },
      verification: "user-provided",
      visibility: "public",
      evidence: [
        { sourceId: "repository-public-projects" },
        { sourceId: "phase-1-confirmation-lock-2026-07-21" },
      ],
      reviewNote: "Approved as an activity label, not an employment title.",
    },
    {
      value: { en: "Technology Builder", ar: "صانع حلول تقنية" },
      verification: "user-provided",
      visibility: "public",
      evidence: [{ sourceId: "phase-1-confirmation-lock-2026-07-21" }],
      reviewNote: "Approved as a supporting identity label, not an employment title.",
    },
  ],
  publicLocation: {
    value: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    verification: "verified",
    visibility: "public",
    evidence: [
      { sourceId: "github-profile-audit-2026-07-21" },
      { sourceId: "supplied-cv-2026-07-12" },
    ],
  },
  nationality: {
    value: null,
    verification: "requires-confirmation",
    visibility: "private",
    evidence: [],
    reviewNote: "Nationality has not been approved for public display.",
  },
  shortBiography: {
    value: {
      en: "Computer Science and Artificial Intelligence student interested in technology, AI, and programming.",
      ar: "طالب علوم حاسوب وذكاء اصطناعي مهتم بالتقنية والذكاء الاصطناعي والبرمجة.",
    },
    verification: "verified",
    visibility: "public",
    evidence: [
      { sourceId: "repository-about-content" },
      { sourceId: "github-profile-audit-2026-07-21" },
    ],
  },
  extendedSummary: {
    value: {
      en: "A Computer Science and Artificial Intelligence student building practical software projects after previously studying Human Medicine. Currently focused on software development, continuous learning, experimentation, and building maintainable personal tools.",
      ar: "طالب في علوم الحاسوب والذكاء الاصطناعي، يبني مشاريع برمجية عملية بعد دراسة سابقة في الطب البشري. يركّز حاليًا على تطوير البرمجيات، والتعلم المستمر، والتجربة، وبناء أدوات شخصية قابلة للصيانة والتطوير.",
    },
    verification: "user-provided",
    visibility: "public",
    evidence: [
      { sourceId: "supplied-cv-2026-07-12" },
      { sourceId: "repository-current-site" },
      { sourceId: "legacy-content-migration-approval-2026-07-22" },
    ],
    reviewNote: "Exact English and Arabic wording approved for public use during the legacy content migration.",
  },
  currentStatus: {
    value: {
      en: "Studying Computer Science and Artificial Intelligence at Arab Open University.",
      ar: "يدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة.",
    },
    verification: "user-provided",
    visibility: "public",
    evidence: [{ sourceId: "supplied-cv-2026-07-12" }],
  },
  availability: {
    value: {
      en: "Open to internships, collaborative learning projects, and entry-level software development opportunities.",
      ar: "منفتح على فرص التدريب ومشاريع التعلم التعاوني وفرص تطوير البرمجيات للمبتدئين.",
    },
    verification: "user-provided",
    visibility: "public",
    evidence: [{ sourceId: "phase-1-confirmation-lock-2026-07-21" }],
    reviewNote: "Does not claim general freelance availability.",
  },
  primaryCta: {
    label: { en: "View Projects", ar: "عرض المشاريع" },
    href: "/portfolio",
  },
  secondaryCta: {
    label: { en: "Contact", ar: "تواصل" },
    href: "/contact",
  },
  contacts: [
    {
      id: "public-email",
      type: "email",
      label: { en: "Email", ar: "البريد الإلكتروني" },
      value: "Adnan.Naous@outlook.com",
      href: "mailto:Adnan.Naous@outlook.com",
      primary: true,
      verification: "verified",
      visibility: "public",
      evidence: [
        { sourceId: "repository-contact-page" },
        { sourceId: "supplied-cv-2026-07-12" },
      ],
    },
    {
      id: "portfolio-site",
      type: "website",
      label: { en: "Website", ar: "الموقع" },
      value: "adnannaous.vercel.app",
      href: "https://adnannaous.vercel.app/",
      primary: false,
      verification: "verified",
      visibility: "public",
      evidence: [{ sourceId: "repository-readme" }],
    },
  ],
  socialProfiles: [
    {
      id: "github",
      label: "GitHub",
      handle: "AdnanNaous",
      url: "https://github.com/AdnanNaous",
      verification: "verified",
      visibility: "public",
      evidence: [{ sourceId: "repository-home-page" }],
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: "adnan-naous",
      url: "https://www.linkedin.com/in/adnan-naous/",
      verification: "verified",
      visibility: "public",
      evidence: [
        { sourceId: "repository-home-page" },
        { sourceId: "github-profile-audit-2026-07-21" },
      ],
    },
    {
      id: "x",
      label: "X",
      handle: "aantrueman",
      url: "https://x.com/aantrueman",
      verification: "verified",
      visibility: "public",
      evidence: [
        { sourceId: "repository-home-page" },
        { sourceId: "github-profile-audit-2026-07-21" },
      ],
    },
  ],
  resume: {
    publicPath: null,
    verification: "requires-confirmation",
    visibility: "private",
    reviewNote: "A sanitized download is approved in principle but is not ready. Oxford, Godot, and private-field review must be resolved first.",
  },
  images: [
    {
      id: "current-abstract-profile",
      publicPath: "/profile.jpg",
      kind: "abstract",
      alt: {
        en: "Abstract monochrome orb representing Adnan Naous",
        ar: "كرة تجريدية أحادية اللون ترمز إلى عدنان نعوس",
      },
      verification: "verified",
      visibility: "public",
      reviewNote: "Current production asset; it is not a portrait.",
    },
    {
      id: "supplied-portrait-candidate",
      publicPath: null,
      kind: "portrait",
      alt: {
        en: "Portrait of Adnan Naous",
        ar: "صورة شخصية لعدنان نعوس",
      },
      verification: "user-provided",
      visibility: "hidden-pending-review",
      usageRestrictions: [
        "Preserve the real facial appearance.",
        "Do not beautify, reconstruct, face-swap, repaint, or modify facial geometry.",
        "Future use may crop, mask, remove the background, color-grade, adjust lighting or shadow, and position responsively.",
      ],
      reviewNote: "Ownership and public-use permission were approved. The external source image has not been copied into the repository in this phase.",
    },
    {
      id: "bronze-concept-reference",
      publicPath: null,
      kind: "concept-reference",
      alt: null,
      verification: "requires-confirmation",
      visibility: "private",
      reviewNote: "Visual reference only. Reconstructed facial imagery and unsupported statistics must not be reused.",
    },
  ],
} satisfies ProfileContent;
