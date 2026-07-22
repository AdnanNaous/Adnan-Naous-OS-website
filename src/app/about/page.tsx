"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { publicData } from "@/data/public";

export default function About() {
  const { t, language } = useLanguage();

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">{t("aboutTitle")}</h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">{t("aboutBackground")}</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
              <p>{publicData.profile.extendedBiography[language]}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">{t("aboutEdu")}</h2>
            <div className="grid gap-6">
              {publicData.education.map((entry) => (
                <motion.div key={entry.id} whileHover={{ x: language === "ar" ? -5 : 5 }} className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] hover:border-black dark:hover:border-white transition-all shadow-sm">
                  <h3 className="font-bold text-lg mb-1">{entry.program}</h3>
                  <p className="text-neutral-500 mb-2">
                    {entry.institution}, {entry.location} ({entry.startYear} - {entry.endYear ?? (language === "ar" ? "حتى الآن" : "Present")})
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
