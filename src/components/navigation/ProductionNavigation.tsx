"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { publicData } from "@/data/public";
import styles from "./ProductionNavigation.module.css";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type ProductionNavigationProps = {
  brand: string;
  displayName: string;
  githubUrl?: string;
};

export function ProductionNavigation({ brand, displayName, githubUrl }: ProductionNavigationProps) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerSnapshot);
  const reducedMotion = useReducedMotion();
  const isDark = mounted ? theme === "dark" : true;
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const isArabic = language === "ar";

  const copy = isArabic ? {
    primaryNavigation: "التنقل الرئيسي",
    mobileNavigation: "التنقل عبر الهاتف",
    openMenu: "فتح قائمة التنقل",
    closeMenu: "إغلاق قائمة التنقل",
    switchLanguage: "التبديل إلى الإنجليزية",
    switchTheme: isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن",
    github: "فتح ملف GitHub في علامة تبويب جديدة",
    more: "المزيد",
  } : {
    primaryNavigation: "Primary navigation",
    mobileNavigation: "Mobile navigation",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    switchLanguage: "Switch to Arabic",
    switchTheme: isDark ? "Switch to light theme" : "Switch to dark theme",
    github: "Open GitHub profile in a new tab",
    more: "More",
  };

  const primaryRoutes = publicData.navigation.primary;
  const secondaryRoutes = publicData.navigation.secondary;
  const allRoutes = [...primaryRoutes, ...secondaryRoutes];

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const close = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
        moreButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [moreOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <m.header
        className={styles.header}
        initial={reducedMotion ? false : { opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
      <nav className={`${styles.nav} ds-glass ds-glass-nav`} aria-label={copy.primaryNavigation}>
        <Link href="/" className={styles.brand} aria-label={`${displayName} — ${primaryRoutes[0].label[language]}`}>
          <span className={styles.brandMark}>{brand}</span>
          <span className={styles.brandName}>{displayName}</span>
        </Link>

        <div className={styles.desktopLinks}>
          {primaryRoutes.map((route) => {
            const active = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                aria-current={active ? "page" : undefined}
                className={active ? styles.activeLink : styles.link}
              >
                {route.label[language]}
                {active ? <span className={styles.activeDot} aria-hidden="true" /> : null}
              </Link>
            );
          })}
          <div className={styles.more} ref={moreRef}>
            <button
              ref={moreButtonRef}
              type="button"
              className={secondaryRoutes.some((route) => route.href === pathname) ? styles.activeLink : styles.link}
              aria-expanded={moreOpen}
              aria-controls="production-more-navigation"
              onClick={() => setMoreOpen((open) => !open)}
            >
              {copy.more}<ChevronDown size={14} aria-hidden="true" />
            </button>
            {moreOpen ? (
              <div id="production-more-navigation" className={`${styles.moreMenu} ds-glass ds-glass-menu`}>
                {secondaryRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    aria-current={pathname === route.href ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                  >
                    {route.label[language]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.controls}>
          {githubUrl ? (
            <a className={styles.githubLink} href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.github}>
              GitHub
            </a>
          ) : null}
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => setLanguage(isArabic ? "en" : "ar")}
            aria-label={copy.switchLanguage}
          >
            <Languages size={17} aria-hidden="true" />
            <span className={styles.controlText}>{isArabic ? "EN" : "AR"}</span>
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={copy.switchTheme}
          >
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className={`${styles.controlButton} ${styles.menuButton}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={menuOpen}
            aria-controls="production-mobile-navigation"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
      {menuOpen ? (
        <m.div
          className={styles.mobileOverlay}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onPointerDown={(event) => {
            if (event.currentTarget === event.target) {
              setMenuOpen(false);
              menuButtonRef.current?.focus();
            }
          }}
        >
          <m.nav
            id="production-mobile-navigation"
            className={`${styles.mobilePanel} ds-glass ds-glass-menu`}
            aria-label={copy.mobileNavigation}
            initial={reducedMotion ? false : { opacity: 0, y: -16, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {allRoutes.map((route, index) => {
              const active = pathname === route.href;
              return (
                <Link
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  key={route.href}
                  href={route.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? styles.mobileActiveLink : styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{route.label[language]}</span>
                  <span className={styles.mobileIndex} aria-hidden="true">0{index + 1}</span>
                </Link>
              );
            })}
            <div className={styles.mobileUtilities}>
              {githubUrl ? (
                <a className={`${styles.mobileUtility} ds-glass ds-glass-subtle`} href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.github}>
                  GitHub
                </a>
              ) : null}
              <button
                type="button"
                className={`${styles.mobileUtility} ds-glass ds-glass-subtle`}
                onClick={() => {
                  setLanguage(isArabic ? "en" : "ar");
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label={copy.switchLanguage}
              >
                <Languages size={17} aria-hidden="true" />
                <span>{isArabic ? "English" : "العربية"}</span>
              </button>
              <button
                type="button"
                className={`${styles.mobileUtility} ds-glass ds-glass-subtle`}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label={copy.switchTheme}
              >
                {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
                <span>{isDark ? (isArabic ? "الوضع الفاتح" : "Light mode") : (isArabic ? "الوضع الداكن" : "Dark mode")}</span>
              </button>
            </div>
          </m.nav>
        </m.div>
      ) : null}
      </AnimatePresence>
      </m.header>
    </LazyMotion>
  );
}
