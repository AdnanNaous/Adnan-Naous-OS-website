"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Portfolio() {
  const { t, language } = useLanguage();

  const projects = [
    {
      title: t("proj1Title"),
      category: t("proj1Cat"),
      description: t("proj1Desc")
    },
    {
      title: t("proj2Title"),
      category: t("proj2Cat"),
      description: t("proj2Desc")
    },
    {
      title: t("proj3Title"),
      category: t("proj3Cat"),
      description: t("proj3Desc")
    },
    {
      title: t("proj4Title"),
      category: t("proj4Cat"),
      description: t("proj4Desc")
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("portfolioTitle")}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-12 max-w-xl">
          {t("portfolioSub")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.article
              key={idx}
              whileHover={{ y: -5 }}
              className="block p-8 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] hover:border-black dark:hover:border-white transition-all shadow-sm"
            >
              <div className="flex items-start mb-6">
                <span className="text-xs font-mono text-[var(--foreground)] bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-[var(--foreground)]">{project.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {project.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
