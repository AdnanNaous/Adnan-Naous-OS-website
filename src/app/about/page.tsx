"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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
              <p>{t("aboutBackgroundText1")}</p>
              <p className="mt-4">{t("aboutBackgroundText2")}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-[var(--foreground)]">{t("aboutEdu")}</h2>
            <div className="grid gap-6">
              <motion.div whileHover={{ x: language === "ar" ? -5 : 5 }} className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <h3 className="font-bold text-lg mb-1">B.Sc. in Computer Science & AI</h3>
                <p className="text-neutral-500 mb-2">Arab Open University, Jeddah (2025 - Present) • GPA: 3.43 / 4.00</p>
              </motion.div>
              <motion.div whileHover={{ x: language === "ar" ? -5 : 5 }} className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <h3 className="font-bold text-lg mb-1">Human Medicine Undergraduate</h3>
                <p className="text-neutral-500 mb-2">Ain Shams University, Egypt (2023 - 2025)</p>
              </motion.div>
              <motion.div whileHover={{ x: language === "ar" ? -5 : 5 }} className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] hover:border-black dark:hover:border-white transition-all shadow-sm">
                <h3 className="font-bold text-lg mb-1">Oxford Level 8 Certified (English)</h3>
                <p className="text-neutral-500 mb-2">Oxford English Institute, Saudi Arabia (2023)</p>
              </motion.div>
            </div>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
