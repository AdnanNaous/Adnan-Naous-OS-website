import { publicData } from "./public";
import type { SearchRecord } from "@/types/content";

const profileRecords: SearchRecord[] = [
  {
    id: "profile-summary",
    type: "profile",
    title: publicData.profile.displayName,
    description: publicData.profile.extendedBiography.en,
    keywords: ["Adnan Naous", "computer science", "artificial intelligence", "student", "developer", "technology builder"],
    category: "Profile",
    destination: "/about",
    visibility: "public",
    priority: 100,
    sourceId: "public-profile",
  },
];

const educationRecords: SearchRecord[] = publicData.education.map((entry, index) => ({
  id: `education-${entry.id}`,
  type: "resume",
  title: entry.program,
  description: entry.description.en,
  keywords: [entry.institution, entry.field, String(entry.startYear), entry.status],
  category: "Education",
  destination: "/about",
  visibility: "public",
  priority: 90 - index,
  sourceId: entry.id,
}));

const languageRecords: SearchRecord[] = publicData.languages.map((language, index) => ({
  id: `language-${language.id}`,
  type: "resume",
  title: language.name.en,
  description: language.level.en,
  keywords: ["language", language.level.en],
  category: "Languages",
  destination: "/about",
  visibility: "public",
  priority: 75 - index,
  sourceId: language.id,
}));

const skillRecords: SearchRecord[] = publicData.skills.map((skill) => ({
  id: `skill-${skill.id}`,
  type: "skill",
  title: skill.name,
  description: skill.description?.en ?? `${skill.name} is classified as ${skill.category.replaceAll("-", " ")}.`,
  keywords: [skill.kind, skill.category, ...skill.relatedProjectIds],
  category: "Skills",
  destination: "/about",
  visibility: "public",
  priority: Math.max(10, 80 - skill.displayPriority / 10),
  sourceId: skill.id,
}));

const projectRecords: SearchRecord[] = publicData.projects.map((project) => ({
  id: `project-${project.id}`,
  type: "project",
  title: project.name,
  description: project.description.en,
  keywords: [project.category, project.status, project.placement, ...project.technologies],
  category: "Projects",
  destination: `/portfolio#${project.id}`,
  visibility: "public",
  priority: project.featured ? 95 : 70,
  sourceId: project.id,
}));

const githubRecords: SearchRecord[] = publicData.github.repositories.map((repository) => ({
  id: `github-${repository.id}`,
  type: "github",
  title: repository.displayName,
  description: repository.description?.en ?? "Public GitHub learning repository.",
  keywords: [repository.category, ...repository.tags],
  category: "GitHub",
  destination: repository.repositoryUrl,
  visibility: "public",
  priority: repository.featured ? 90 : 60,
  sourceId: repository.id,
}));

const bookmarkRecords: SearchRecord[] = publicData.bookmarks.map((bookmark) => ({
  id: `bookmark-${bookmark.id}`,
  type: "bookmark",
  title: bookmark.name,
  description: bookmark.description.en,
  keywords: [bookmark.category, ...bookmark.tags],
  category: bookmark.category,
  destination: bookmark.canonicalUrl,
  visibility: "public",
  priority: bookmark.featured ? 85 : 55,
  sourceId: bookmark.id,
}));

const capabilityRecords: SearchRecord[] = publicData.capabilities.map((capability, index) => ({
  id: `capability-${capability.id}`,
  type: "section",
  title: capability.title.en,
  description: capability.description.en,
  keywords: ["capability", "collaboration", ...capability.evidenceProjectIds],
  category: "Capabilities",
  destination: "/services",
  visibility: "public",
  priority: 78 - index,
  sourceId: capability.id,
}));

const writingRecords: SearchRecord[] = publicData.writing.topics.map((topic, index) => ({
  id: `writing-topic-${topic.id}`,
  type: "section",
  title: topic.title.en,
  description: topic.description.en,
  keywords: ["writing", "learning", "notes"],
  category: "Writing",
  destination: "/blog",
  visibility: "public",
  priority: 50 - index,
  sourceId: topic.id,
}));

const credentialRecords: SearchRecord[] = publicData.credentials.map((credential) => ({
  id: `credential-${credential.id}`,
  type: "resume",
  title: credential.title,
  description: `${credential.credentialType} — ${credential.program}`,
  keywords: [credential.issuer, credential.program, credential.featuredProject],
  category: "Recognition",
  destination: "/testimonials",
  visibility: "public",
  priority: 80,
  sourceId: credential.id,
}));

const personalOSRecords: SearchRecord[] = publicData.personalOS.tools.map((tool, index) => ({
  id: `personal-os-${tool.id}`,
  type: "section",
  title: tool.title.en,
  description: tool.description.en,
  keywords: ["personal os", tool.implementation, tool.status],
  category: "Personal OS",
  destination: "/tools",
  visibility: "public",
  priority: 68 - index,
  sourceId: tool.id,
}));

const sectionRecords: SearchRecord[] = [
  {
    id: "section-contact",
    type: "section",
    title: "Contact",
    description: "Public contact information for Adnan Naous.",
    keywords: ["email", "contact"],
    category: "Website",
    destination: "/contact",
    visibility: "public",
    priority: 70,
    sourceId: "repository-contact-page",
  },
  {
    id: "section-tools",
    type: "section",
    title: "Personal OS Tools",
    description: "Current focus timer, command center, bookmarks, and GitHub activity tools.",
    keywords: ["tools", "focus", "pomodoro", "bookmarks", "github"],
    category: "Website",
    destination: "/tools",
    visibility: "public",
    priority: 65,
    sourceId: "repository-tools-page",
  },
];

export const searchIndex = [
  ...profileRecords,
  ...educationRecords,
  ...languageRecords,
  ...skillRecords,
  ...projectRecords,
  ...githubRecords,
  ...bookmarkRecords,
  ...capabilityRecords,
  ...writingRecords,
  ...credentialRecords,
  ...personalOSRecords,
  ...sectionRecords,
] satisfies SearchRecord[];
