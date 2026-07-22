export type VerificationStatus =
  | "verified"
  | "user-provided"
  | "user-confirmed"
  | "requires-confirmation"
  | "conflicting"
  | "unsupported"
  | "placeholder";

export type ContentVisibility =
  | "public"
  | "private"
  | "hidden"
  | "hidden-pending-review"
  | "archived";

export type LocalizedText = {
  en: string;
  ar?: string;
};

export type EvidenceReference = {
  sourceId: string;
  note?: string;
};

export type ReviewableValue<T> = {
  value: T;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
  reviewNote?: string;
};

export type ContactMethod = {
  id: string;
  type: "email" | "website";
  label: LocalizedText;
  value: string;
  href: string;
  primary: boolean;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type SocialProfile = {
  id: "github" | "linkedin" | "x";
  label: string;
  handle: string;
  url: string;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type ProfileImageReference = {
  id: string;
  publicPath: string | null;
  kind: "abstract" | "portrait" | "concept-reference";
  alt: LocalizedText | null;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  usageRestrictions?: string[];
  reviewNote?: string;
};

export type ProfileContent = {
  fullName: ReviewableValue<string | null>;
  displayName: ReviewableValue<string>;
  brand: ReviewableValue<string>;
  primaryTitle: ReviewableValue<LocalizedText>;
  supportingIdentity: ReviewableValue<LocalizedText>[];
  publicLocation: ReviewableValue<LocalizedText>;
  nationality: ReviewableValue<LocalizedText | null>;
  shortBiography: ReviewableValue<LocalizedText>;
  extendedSummary: ReviewableValue<LocalizedText>;
  currentStatus: ReviewableValue<LocalizedText>;
  availability: ReviewableValue<LocalizedText | null>;
  primaryCta: {
    label: LocalizedText;
    href: string;
  };
  secondaryCta: {
    label: LocalizedText;
    href: string;
  };
  contacts: ContactMethod[];
  socialProfiles: SocialProfile[];
  resume: {
    publicPath: string | null;
    verification: VerificationStatus;
    visibility: ContentVisibility;
    reviewNote: string;
  };
  images: ProfileImageReference[];
};

export type EducationStatus =
  | "in-progress"
  | "completed"
  | "incomplete-study"
  | "attendance";

export type EducationEntry = {
  id: string;
  institution: string;
  program: string;
  field: string;
  status: EducationStatus;
  startYear: number;
  endYear: number | null;
  location: string | null;
  description: LocalizedText;
  grade: {
    value: string | null;
    verification: VerificationStatus;
    visibility: ContentVisibility;
    conflictStatus: "none" | "active" | "resolved";
    resumeEligible: boolean;
    conflictingValues?: string[];
    reviewNote?: string;
  } | null;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: number;
  status: "completed" | "attendance";
  description: LocalizedText;
  credentialUrl: string | null;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type WorkshopEntry = {
  id: string;
  name: string;
  issuer: string | null;
  year: number | null;
  relatedProjectId: string | null;
  description: LocalizedText;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type LanguageEntry = {
  id: string;
  name: LocalizedText;
  level: string | null;
  credential: string | null;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type LearningRoadmapEntry = {
  id: string;
  topic: LocalizedText;
  status: "current" | "planned" | "completed";
  description: LocalizedText;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
};

export type SkillCategory =
  | "currently-learning"
  | "working-knowledge"
  | "used-in-projects"
  | "development-tools"
  | "exploring"
  | "planned-learning";

export type SkillKind =
  | "language"
  | "framework"
  | "library"
  | "platform"
  | "tool"
  | "database"
  | "cloud-service"
  | "concept";

export type SkillEntry = {
  id: string;
  name: string;
  kind: SkillKind;
  category: SkillCategory;
  relatedProjectIds: string[];
  description?: LocalizedText;
  displayPriority: number;
  verification: VerificationStatus;
  visibility: ContentVisibility;
  evidence: EvidenceReference[];
  reviewNote?: string;
};

export type ProjectStatus =
  | "planned"
  | "in-progress"
  | "functional-prototype"
  | "active"
  | "completed"
  | "maintained"
  | "paused"
  | "archived";

export type ProjectClassification =
  | "verified"
  | "needs-confirmation"
  | "placeholder"
  | "incomplete"
  | "archive-candidate";

export type ProjectRecord = {
  id: string;
  name: string;
  shortDescription: LocalizedText;
  extendedDescription: LocalizedText | null;
  problemAddressed: LocalizedText | null;
  status: ProjectStatus;
  classification: ProjectClassification;
  category: string;
  technologies: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
  displayOrder: number;
  startDate: string | null;
  completionDate: string | null;
  personalRole: LocalizedText | null;
  keyFunctionality: LocalizedText[];
  knownLimitations: LocalizedText[];
  verification: VerificationStatus;
  visibility: ContentVisibility;
  showInProjects: boolean;
  showInGitHubGallery: boolean;
  evidence: EvidenceReference[];
  removalApproved?: boolean;
  reviewNote?: string;
};

export type GitHubRepositoryMetadata = {
  repositoryName: string;
  owner: string;
  featured: boolean;
  displayOrder: number;
  category: string;
  customShortDescription: LocalizedText | null;
  projectImage: string | null;
  liveDeploymentUrl: string | null;
  showInProjects: boolean;
  showInGitHubGallery: boolean;
  tags: string[];
  archivedOverride: boolean | null;
  manualNotes: string[];
  verification: VerificationStatus;
  visibility: ContentVisibility;
};

export type BookmarkClassification =
  | "featured-public"
  | "public-library"
  | "personal-only"
  | "university-private"
  | "account-specific"
  | "duplicate"
  | "broken-or-unreachable"
  | "archive-candidate"
  | "requires-confirmation";

export type BookmarkAudience =
  | "everyone"
  | "students"
  | "developers"
  | "ai-learners"
  | "designers"
  | "gamers"
  | "personal-only";

export type LinkValidationStatus =
  | "valid"
  | "redirected"
  | "requires-login"
  | "broken"
  | "unreachable"
  | "duplicate"
  | "private"
  | "requires-manual-review";

export type PublicBookmark = {
  id: string;
  name: string;
  originalTitle: string;
  originalUrl: string | null;
  originalUrlHash: string;
  canonicalUrl: string;
  canonicalDomain: string;
  description: LocalizedText;
  category: string;
  originalFolder: string;
  tags: string[];
  classification: BookmarkClassification;
  featured: boolean;
  displayOrder: number;
  visibility: ContentVisibility;
  active: boolean;
  audience: BookmarkAudience[];
  personalNote: string | null;
  iconStrategy: "favicon" | "brand-icon" | "generic";
  verification: VerificationStatus;
  linkValidation: {
    status: LinkValidationStatus;
    checkedOn: string | null;
    redirected: boolean;
    authenticationRequired: boolean;
    notes?: string;
  };
};

export type NavigationItem = {
  id: string;
  label: LocalizedText;
  href: string;
  currentRoute: boolean;
  proposedPrimary: boolean;
  migrationStatus: "active" | "proposed" | "approved-for-archive";
};

export type SearchRecord = {
  id: string;
  type: "profile" | "resume" | "skill" | "project" | "github" | "bookmark" | "section";
  title: string;
  description: string;
  keywords: string[];
  category: string;
  destination: string;
  visibility: ContentVisibility;
  priority: number;
  sourceId: string;
};
