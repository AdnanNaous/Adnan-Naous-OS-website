"use client";

import { motion } from "framer-motion";
import { Pomodoro } from "@/components/Pomodoro";
import { CommandCenter } from "@/components/CommandCenter";
import { BookmarksWidget } from "@/components/BookmarksWidget";
import { GitHubTracker } from "@/components/GitHubTracker";
import { SpotlightCard } from "@/components/SpotlightCard";
import { useLanguage } from "@/context/LanguageContext";

export default function Tools() {
  const { t, language } = useLanguage();

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("tools")}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-12 max-w-xl">
          {language === "ar" ? "أدوات نظام التشغيل الشخصي الخاصة بك، مجمعة في مكان واحد." : "Your Personal OS tools, assembled in one place."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Pomodoro Timer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="col-span-1 md:col-span-6 lg:col-span-4 min-h-[280px]">
            <SpotlightCard className="h-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-neutral-200 dark:border-white/10 shadow-sm">
              <Pomodoro />
            </SpotlightCard>
          </motion.div>

          {/* Command Center */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="col-span-1 md:col-span-6 lg:col-span-8 min-h-[280px] flex items-center">
            <SpotlightCard className="h-full w-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-neutral-200 dark:border-white/10 shadow-sm flex items-center justify-center p-6">
              <CommandCenter />
            </SpotlightCard>
          </motion.div>

          {/* GitHub Tracker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="col-span-1 md:col-span-12 lg:col-span-12 min-h-[140px]">
            <SpotlightCard className="h-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-neutral-200 dark:border-white/10 shadow-sm">
              <GitHubTracker />
            </SpotlightCard>
          </motion.div>

          {/* Bookmarks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="col-span-1 md:col-span-12 lg:col-span-12 min-h-[140px]">
            <SpotlightCard className="h-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border-neutral-200 dark:border-white/10 shadow-sm">
              <BookmarksWidget />
            </SpotlightCard>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
