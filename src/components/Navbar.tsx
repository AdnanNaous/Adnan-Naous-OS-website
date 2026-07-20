"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, Languages, Menu, X, Wrench } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useHasMounted() {
  return useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const mounted = useHasMounted();
  const isDark = mounted ? theme === "dark" : true;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  const accessibilityText = language === "ar" ? {
    primaryNavigation: "التنقل الرئيسي",
    mobileNavigation: "التنقل عبر الهاتف",
    switchLanguage: "التبديل إلى الإنجليزية",
    switchToLight: "التبديل إلى الوضع الفاتح",
    switchToDark: "التبديل إلى الوضع الداكن",
    openMenu: "فتح قائمة التنقل",
    closeMenu: "إغلاق قائمة التنقل",
    githubProfile: "ملف AdnanNaous ونشاطه على GitHub",
  } : {
    primaryNavigation: "Primary navigation",
    mobileNavigation: "Mobile navigation",
    switchLanguage: "Switch to Arabic",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    githubProfile: "AdnanNaous GitHub profile and activity",
  };

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("services"), href: "/services" },
    { name: t("about"), href: "/about" },
    { name: t("testimonials"), href: "/testimonials" },
    { name: t("blog"), href: "/blog" },
    { name: t("contact"), href: "/contact" },
    { name: t("tools"), href: "/tools", icon: Wrench },
  ];

  return (
    <nav
      aria-label={accessibilityText.primaryNavigation}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div className="glass-nav-shell pointer-events-auto mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-2 px-3 sm:px-4">
        <Link
          href="/"
          className="glass-interactive flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-1.5 font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[11px] text-[var(--background)]">
            AN
          </span>
          <span className="text-sm sm:text-base">
            Adnan<span className="hidden min-[420px]:inline"> Naous</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 px-2 text-[12px] font-medium xl:flex 2xl:gap-1 2xl:text-[13px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name} 
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`glass-nav-link relative flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 2xl:px-3 ${isActive ? "glass-nav-link-active text-black dark:text-white" : "text-neutral-600 dark:text-neutral-300"}`}
              >
                {Icon && <Icon size={14} aria-hidden="true" />}
                <span>{link.name}</span>
                {isActive && <span aria-hidden="true" className="absolute inset-x-3 bottom-1.5 h-px rounded-full bg-current" />}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href="https://github.com/AdnanNaous"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${accessibilityText.githubProfile} (${t("opensInNewTab")})`}
            className="glass-github-button flex min-h-10 items-center gap-2 rounded-xl px-2.5 text-xs font-semibold text-neutral-900 dark:text-white sm:px-3"
          >
            <FaGithub size={17} aria-hidden="true" />
            <span className="hidden min-[360px]:inline xl:hidden">GitHub</span>
            <span className="hidden xl:inline">{t("githubTimeline")}</span>
            <span aria-hidden="true" className="github-live-status hidden items-center gap-1.5 xl:flex">
              <span className="github-live-dot" />
              <span className="text-[9px] font-bold tracking-[0.12em] text-neutral-600 dark:text-neutral-300">LIVE</span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label={accessibilityText.switchLanguage}
            className="glass-interactive hidden min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 xl:flex"
          >
            <Languages size={14} aria-hidden="true" />
            {language === "en" ? "AR" : "EN"}
          </button>

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? accessibilityText.switchToLight : accessibilityText.switchToDark}
            className="glass-interactive flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300"
          >
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>

          <button 
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? accessibilityText.closeMenu : accessibilityText.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="glass-interactive flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 xl:hidden"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            role="group"
            aria-label={accessibilityText.mobileNavigation}
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass-mobile-panel pointer-events-auto mx-auto mt-2 flex max-h-[calc(100vh-6.5rem)] max-w-[90rem] flex-col gap-1 overflow-y-auto p-3 xl:hidden"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`glass-mobile-link flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium ${isActive ? "bg-black/[0.07] text-black dark:bg-white/[0.10] dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}
                >
                  {Icon && <Icon size={16} aria-hidden="true" />}
                  {link.name}
                  {isActive && <span aria-hidden="true" className="ms-auto h-1.5 w-1.5 rounded-full bg-current" />}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => { setLanguage(language === "en" ? "ar" : "en"); setMobileMenuOpen(false); }}
              aria-label={accessibilityText.switchLanguage}
              className="glass-mobile-link mt-2 flex min-h-11 items-center gap-2 border-t border-[var(--border)] px-3 pt-3 text-sm font-medium text-neutral-700 dark:text-neutral-200"
            >
              <Languages size={16} aria-hidden="true" />
              {language === "en" ? "Language: Arabic" : "اللغة: الإنجليزية"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
