import type {
  BookmarkAudience,
  LocalizedText,
  ProjectStatus,
  SkillCategory,
  SkillKind,
} from "./content";

export type PublicContact = {
  id: string;
  type: "email" | "website";
  label: LocalizedText;
  value: string;
  href: string;
};

export type PublicSocialProfile = {
  id: "github" | "linkedin" | "x";
  label: string;
  handle: string;
  url: string;
};

type PublicProfileImageBase = {
  id: string;
  publicPath: string;
  alt: LocalizedText;
};

export type PublicPortraitPresentationVariant = {
  publicPath: string;
  width: number;
  height: number;
  format: "webp";
  derivedFrom: "approved-portrait";
  processing: Array<
    "background-removal" | "metadata-removal" | "edge-refinement" | "edge-decontamination"
  >;
};

export type PublicProfileImage = PublicProfileImageBase & (
  | {
      kind: "abstract";
      width?: number;
      height?: number;
      format?: "jpg" | "webp";
      approvalStatus?: "verified";
    }
  | {
      kind: "portrait";
      width: number;
      height: number;
      format: "webp";
      approvalStatus: "user-approved";
      presentationVariants: {
        transparentCutout: PublicPortraitPresentationVariant;
      };
    }
);

export type PublicEducation = {
  id: string;
  institution: string;
  program: string;
  field: string;
  status: "in-progress" | "incomplete-study";
  startYear: number;
  endYear: number | null;
  location: string | null;
  description: LocalizedText;
};

export type PublicSkill = {
  id: string;
  name: string;
  kind: SkillKind;
  category: SkillCategory;
  relatedProjectIds: string[];
  description?: LocalizedText;
  displayPriority: number;
};

export type PublicProject = {
  id: string;
  name: string;
  shortLabel: string;
  description: LocalizedText;
  visibility: "public";
  status: ProjectStatus;
  category: string;
  technologies: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  displayOrder: number;
  placement: "main-projects" | "github-gallery-learning-journey";
  assets: PublicProjectAsset[];
  caseStudy?: {
    purpose: LocalizedText;
    context: LocalizedText;
    problem: LocalizedText;
    motivation: LocalizedText;
    solution: LocalizedText;
    architecture: LocalizedText;
    constraints: LocalizedText[];
    designDecisions: LocalizedText[];
    technicalDecisions: LocalizedText[];
    accessibilityAndPrivacy: LocalizedText[];
    challenges: LocalizedText[];
    keyFunctionality: LocalizedText[];
    lessons: LocalizedText[];
    limitations: LocalizedText[];
    roadmap: LocalizedText[];
    evidenceLinks: Array<{
      label: LocalizedText;
      href: string;
      kind: "repository" | "live" | "documentation";
    }>;
  };
};

export type PublicProjectAsset = {
  id: string;
  projectId: string;
  kind:
    | "architecture-diagram"
    | "workflow-diagram"
    | "system-diagram"
    | "repository-structure"
    | "website-screenshot"
    | "mobile-screenshot"
    | "product-screenshot";
  publicPath: string;
  width: number;
  height: number;
  format: "svg" | "webp";
  alt: LocalizedText;
  approvalStatus: "locally-authored-public" | "current-public-capture";
};

export type PublicCapability = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  evidenceProjectIds: string[];
  status: "demonstrated" | "developing" | "planned";
  boundaries: LocalizedText[];
};

export type PublicNavigationItem = {
  href: string;
  label: LocalizedText;
};

export type PublicGitHubRepository = {
  id: string;
  displayName: string;
  shortLabel: string;
  repositoryName: string;
  owner: string;
  repositoryUrl: string;
  summary: LocalizedText;
  visibility: "public";
  category: string;
  description: LocalizedText | null;
  liveDeploymentUrl: string | null;
  tags: string[];
  featured: boolean;
  displayOrder: number;
};

export type PublicCredential = {
  id: string;
  title: string;
  shortLabel: string;
  summary: LocalizedText;
  credentialType: "Certificate of Workshop Completion";
  program: "AI Training Hackathon";
  completionDate: "2026-07-15";
  featuredProject: "Adnan OS: A Command Center for the Modern CS Student";
  credentialId: "KANZ-ADV-0594";
  issuer: "Kanz AI";
  documentPath: "/documents/certificates/kanz-ai-hackathon-2026.pdf";
  preview: {
    publicPath: "/images/projects/kanz-ai-certificate.webp";
    width: 1871;
    height: 1323;
    format: "webp";
    alt: LocalizedText;
    approvalStatus: "rendered-approved-public-document";
  };
  visibility: "public";
  verificationStatus: "user-confirmed";
};

export type PublicHomepageDockReference = {
  kind: "repository" | "credential";
  recordId: string;
  icon: "journey" | "os-website" | "windows-tools" | "certificate";
};

export type PublicArticle = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  slug: string;
  publishedAt: string;
  status: "published";
  topicIds: string[];
};

export type PublicBookmarkResource = {
  id: string;
  name: string;
  canonicalUrl: string;
  description: LocalizedText;
  category: string;
  tags: string[];
  featured: boolean;
  displayOrder: number;
  audience: BookmarkAudience[];
  validationStatus: "valid" | "redirected" | "requires-login";
};

export type PublicData = {
  profile: {
    displayName: string;
    brand: string;
    primaryTitle: LocalizedText;
    supportingLabels: LocalizedText[];
    location: LocalizedText;
    shortBiography: LocalizedText;
    extendedBiography: LocalizedText;
    currentStatus: LocalizedText;
    availability: LocalizedText;
    contacts: PublicContact[];
    socialProfiles: PublicSocialProfile[];
    profileImages: PublicProfileImage[];
  };
  education: PublicEducation[];
  languages: Array<{
    id: string;
    name: LocalizedText;
    level: LocalizedText;
  }>;
  skills: PublicSkill[];
  projects: PublicProject[];
  github: {
    owner: string;
    profileUrl: string;
    repositories: PublicGitHubRepository[];
  };
  credentials: PublicCredential[];
  homepage: {
    dock: PublicHomepageDockReference[];
    statement: LocalizedText;
    principles: Array<{ id: string; title: LocalizedText; description: LocalizedText }>;
    mission: {
      eyebrow: LocalizedText;
      title: LocalizedText;
      description: LocalizedText;
    };
    featuredProjectId: string;
    verifiedProjectIds: string[];
    process: Array<{ id: string; title: LocalizedText; description: LocalizedText }>;
    personalOSPreview: {
      title: LocalizedText;
      description: LocalizedText;
      moduleIds: Array<"focus-timer" | "command-center" | "github-activity" | "resource-library">;
    };
    opportunity: {
      title: LocalizedText;
      description: LocalizedText;
    };
  };
  navigation: {
    primary: PublicNavigationItem[];
    secondary: PublicNavigationItem[];
  };
  capabilities: PublicCapability[];
  about: {
    transition: LocalizedText;
    currentFocus: Array<{ id: string; title: LocalizedText; description: LocalizedText }>;
    workingPrinciples: Array<{ id: string; title: LocalizedText; description: LocalizedText }>;
  };
  writing: {
    status: LocalizedText;
    topics: Array<{ id: string; title: LocalizedText; description: LocalizedText }>;
    editorialPrinciples: LocalizedText[];
    articles: PublicArticle[];
  };
  recognition: {
    statement: LocalizedText;
    context: LocalizedText;
  };
  contact: {
    introduction: LocalizedText;
    opportunityTypes: LocalizedText[];
    contributionTypes: LocalizedText[];
    collaborationPreferences: LocalizedText[];
    limitations: LocalizedText[];
    responseNote: LocalizedText;
  };
  personalOS: {
    title: LocalizedText;
    introduction: LocalizedText;
    productStory: LocalizedText;
    tools: Array<{
      id: "focus-timer" | "command-center" | "github-activity" | "resource-library";
      title: LocalizedText;
      description: LocalizedText;
      implementation: "built" | "integrated";
      status: "functional";
      behavior: LocalizedText;
      limitation: LocalizedText;
      privacy: LocalizedText;
    }>;
  };
  footer: {
    statement: LocalizedText;
  };
  bookmarks: PublicBookmarkResource[];
  resume: {
    readyForPublicDownload: false;
    downloadPath: null;
  };
};
