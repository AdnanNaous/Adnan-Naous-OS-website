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
  description: LocalizedText;
  status: ProjectStatus;
  category: string;
  technologies: string[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  displayOrder: number;
  placement: "main-projects" | "github-gallery-learning-journey";
};

export type PublicGitHubRepository = {
  repositoryName: string;
  owner: string;
  category: string;
  description: LocalizedText | null;
  liveDeploymentUrl: string | null;
  tags: string[];
  featured: boolean;
  displayOrder: number;
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
    profileImages: Array<{
      id: string;
      publicPath: string;
      kind: "abstract" | "portrait";
      alt: LocalizedText;
    }>;
  };
  education: PublicEducation[];
  languages: Array<{
    id: string;
    name: LocalizedText;
    level: string;
  }>;
  skills: PublicSkill[];
  projects: PublicProject[];
  github: {
    owner: string;
    profileUrl: string;
    repositories: PublicGitHubRepository[];
  };
  bookmarks: PublicBookmarkResource[];
  resume: {
    readyForPublicDownload: false;
    downloadPath: null;
  };
};
