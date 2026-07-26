import { publicData } from "@/data/public";
import type { Language } from "@/context/LanguageContext";
import type { PublicSocialProfile } from "@/types/public";

export type HomepageContent = {
  language: Language;
  brand: string;
  displayName: string;
  primaryTitle: string;
  eyebrow: string;
  biography: string;
  currentStatus: string;
  location: string;
  availability: string;
  socialProfiles: PublicSocialProfile[];
  dockItems: Array<{
    id: string;
    kind: "repository" | "credential";
    icon: "journey" | "os-website" | "windows-tools" | "certificate";
    title: string;
    shortLabel: string;
    secondaryText: string;
    href: string;
    external: boolean;
    accessibleLabel: string;
  }>;
  ui: {
    viewProjects: string;
    aboutMe: string;
    profileSummary: string;
    currentDirection: string;
    basedIn: string;
    opportunities: string;
    coreFocus: string;
    opensInNewTab: string;
  };
};

const ui = {
  en: {
    viewProjects: "View projects",
    aboutMe: "About me",
    profileSummary: "Profile summary",
    currentDirection: "Current direction",
    basedIn: "Based in",
    opportunities: "Opportunities",
    coreFocus: "Core focus",
    opensInNewTab: "opens in a new tab",
  },
  ar: {
    viewProjects: "عرض المشاريع",
    aboutMe: "نبذة عني",
    profileSummary: "ملخص الملف الشخصي",
    currentDirection: "التوجه الحالي",
    basedIn: "الموقع",
    opportunities: "الفرص",
    coreFocus: "محاور التركيز",
    opensInNewTab: "يفتح في علامة تبويب جديدة",
  },
} as const;

export function getHomepageContent(language: Language): HomepageContent {
  const dockItems = publicData.homepage.dock.map((reference) => {
    if (reference.kind === "repository") {
      const repository = publicData.github.repositories.find(
        (item) => item.id === reference.recordId,
      );

      if (!repository) {
        throw new Error(`Approved homepage repository is unavailable: ${reference.recordId}`);
      }

      return {
        id: repository.id,
        kind: reference.kind,
        icon: reference.icon,
        title: repository.displayName,
        shortLabel: repository.shortLabel,
        secondaryText: repository.summary[language] ?? repository.summary.en,
        href: repository.repositoryUrl,
        external: true,
        accessibleLabel: language === "ar"
          ? `فتح مستودع ${repository.displayName} على GitHub في علامة تبويب جديدة`
          : `Open the ${repository.displayName} repository on GitHub in a new tab`,
      };
    }

    const credential = publicData.credentials.find(
      (item) => item.id === reference.recordId,
    );

    if (!credential) {
      throw new Error(`Approved homepage credential is unavailable: ${reference.recordId}`);
    }

    return {
      id: credential.id,
      kind: reference.kind,
      icon: reference.icon,
      title: credential.title,
      shortLabel: credential.shortLabel,
      secondaryText: credential.summary[language] ?? credential.summary.en,
      href: credential.documentPath,
      external: true,
      accessibleLabel: language === "ar"
        ? `فتح شهادة ${credential.title} بصيغة PDF في علامة تبويب جديدة`
        : `Open the ${credential.title} certificate PDF in a new tab`,
    };
  });

  return {
    language,
    brand: publicData.profile.brand,
    displayName: publicData.profile.displayName,
    primaryTitle: publicData.profile.primaryTitle[language],
    eyebrow: publicData.profile.supportingLabels.map((label) => label[language]).join(" · "),
    biography: publicData.profile.shortBiography[language],
    currentStatus: publicData.profile.currentStatus[language],
    location: publicData.profile.location[language],
    availability: publicData.profile.availability[language],
    socialProfiles: publicData.profile.socialProfiles,
    dockItems,
    ui: ui[language],
  };
}
