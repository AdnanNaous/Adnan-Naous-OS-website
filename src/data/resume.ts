import { certifications, education, languages, learningRoadmap, workshops } from "./education";
import { profile } from "./profile";
import { projects } from "./projects";
import { skills } from "./skills";
import type { ResumeContent } from "@/types/resume";

const currentEducation = education.filter((entry) => entry.status !== "incomplete-study");
const previousStudy = education.filter((entry) => entry.status === "incomplete-study");
const developmentTools = skills.filter((skill) => skill.category === "development-tools");

export const resume = {
  header: {
    displayName: profile.displayName.value,
    primaryTitle: profile.primaryTitle.value,
    publicLocation: profile.publicLocation.value,
    contacts: profile.contacts.filter((contact) => contact.visibility === "public"),
    socialProfiles: profile.socialProfiles.filter((social) => social.visibility === "public"),
  },
  professionalSummary: profile.extendedSummary.value,
  education: currentEducation,
  previousStudy,
  skills,
  projects,
  certifications,
  workshops,
  languages,
  tools: developmentTools,
  learningRoadmap,
  verification: "requires-confirmation",
  printable: false,
  reviewNote: "A sanitized download is approved in principle but is not ready. Do not generate or publish it until Oxford, Godot, and private-field review are resolved.",
} satisfies ResumeContent;
