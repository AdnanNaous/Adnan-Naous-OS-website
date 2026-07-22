import type {
  CertificationEntry,
  ContactMethod,
  EducationEntry,
  LanguageEntry,
  LearningRoadmapEntry,
  LocalizedText,
  ProjectRecord,
  SkillEntry,
  SocialProfile,
  VerificationStatus,
  WorkshopEntry,
} from "./content";

export type ResumeContent = {
  header: {
    displayName: string;
    primaryTitle: LocalizedText;
    publicLocation: LocalizedText;
    contacts: ContactMethod[];
    socialProfiles: SocialProfile[];
  };
  professionalSummary: LocalizedText;
  education: EducationEntry[];
  previousStudy: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectRecord[];
  certifications: CertificationEntry[];
  workshops: WorkshopEntry[];
  languages: LanguageEntry[];
  tools: SkillEntry[];
  learningRoadmap: LearningRoadmapEntry[];
  verification: VerificationStatus;
  printable: false;
  reviewNote: string;
};
