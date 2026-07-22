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
  description: language.level,
  keywords: ["language", language.level],
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
  destination: "/portfolio",
  visibility: "public",
  priority: project.featured ? 95 : 70,
  sourceId: project.id,
}));

const githubRecords: SearchRecord[] = publicData.github.repositories.map((repository) => ({
  id: `github-${repository.repositoryName.toLowerCase()}`,
  type: "github",
  title: repository.repositoryName,
  description: repository.description?.en ?? "Public GitHub learning repository.",
  keywords: [repository.category, ...repository.tags],
  category: "GitHub",
  destination: `https://github.com/${repository.owner}/${repository.repositoryName}`,
  visibility: "public",
  priority: repository.featured ? 90 : 60,
  sourceId: repository.repositoryName,
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
  ...sectionRecords,
] satisfies SearchRecord[];
