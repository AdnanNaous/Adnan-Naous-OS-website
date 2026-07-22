import type { NavigationItem } from "@/types/content";

export const navigation = [
  { id: "home", label: { en: "Home", ar: "الرئيسية" }, href: "/", currentRoute: true, proposedPrimary: true, migrationStatus: "active" },
  { id: "profile", label: { en: "Profile", ar: "الملف الشخصي" }, href: "/profile", currentRoute: false, proposedPrimary: true, migrationStatus: "proposed" },
  { id: "projects", label: { en: "Projects", ar: "المشاريع" }, href: "/projects", currentRoute: false, proposedPrimary: true, migrationStatus: "proposed" },
  { id: "github", label: { en: "GitHub", ar: "GitHub" }, href: "/github", currentRoute: false, proposedPrimary: true, migrationStatus: "proposed" },
  { id: "utility", label: { en: "Utility", ar: "الأدوات" }, href: "/utility", currentRoute: false, proposedPrimary: true, migrationStatus: "proposed" },
  { id: "contact", label: { en: "Contact", ar: "تواصل" }, href: "/contact", currentRoute: true, proposedPrimary: true, migrationStatus: "active" },
  { id: "portfolio-current", label: { en: "Portfolio", ar: "الأعمال" }, href: "/portfolio", currentRoute: true, proposedPrimary: false, migrationStatus: "active" },
  { id: "about-current", label: { en: "About", ar: "عني" }, href: "/about", currentRoute: true, proposedPrimary: false, migrationStatus: "active" },
  { id: "tools-current", label: { en: "Tools", ar: "الأدوات" }, href: "/tools", currentRoute: true, proposedPrimary: false, migrationStatus: "active" },
  { id: "services", label: { en: "Services", ar: "الخدمات" }, href: "/services", currentRoute: true, proposedPrimary: false, migrationStatus: "approved-for-archive" },
  { id: "testimonials", label: { en: "Testimonials", ar: "آراء العملاء" }, href: "/testimonials", currentRoute: true, proposedPrimary: false, migrationStatus: "approved-for-archive" },
  { id: "blog", label: { en: "Blog", ar: "المدونة" }, href: "/blog", currentRoute: true, proposedPrimary: false, migrationStatus: "approved-for-archive" },
] satisfies NavigationItem[];
