"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { Sun, Moon, Languages, Menu, X, Wrench } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("portfolio"), href: "/portfolio" },
    { name: t("services"), href: "/services" },
    { name: t("about"), href: "/about" },
    { name: t("testimonials"), href: "/testimonials" },
    { name: t("blog"), href: "/blog" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-bold tracking-tight text-lg text-neutral-900 dark:text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center text-xs">
            AN
          </div>
          Adnan Naous
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative px-1 py-2 transition-colors hover:text-black dark:hover:text-white ${isActive ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          <Link 
            href="/tools"
            className={`relative px-1 py-2 transition-colors flex items-center gap-1.5 hover:text-black dark:hover:text-white ${pathname === "/tools" ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}
          >
            <Wrench size={14} />
            {t("tools")}
            {pathname === "/tools" && (
              <motion.div 
                layoutId="navbar-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-xs font-semibold text-neutral-600 dark:text-neutral-300"
          >
            <Languages size={14} />
            {language === "en" ? "AR" : "EN"}
          </button>

          {mounted && (
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-300"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-300"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-[var(--border)] py-4 px-6 flex flex-col gap-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium ${pathname === link.href ? "text-black dark:text-white" : "text-neutral-600 dark:text-neutral-300"}`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium flex items-center gap-2 ${pathname === "/tools" ? "text-black dark:text-white" : "text-neutral-600 dark:text-neutral-300"}`}
            >
              <Wrench size={16} /> {t("tools")}
          </Link>
          <button 
            onClick={() => { setLanguage(language === "en" ? "ar" : "en"); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 border-t border-[var(--border)] pt-4 mt-2"
          >
            <Languages size={16} /> Language: {language === "en" ? "Arabic" : "English"}
          </button>
        </motion.div>
      )}
    </nav>
  );
}
