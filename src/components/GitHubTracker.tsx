"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { SpotlightCard } from "./SpotlightCard";
import { FaGithub } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function GitHubTracker() {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="h-full w-full p-6 flex flex-col justify-start">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <FaGithub size={18} className="text-neutral-500" /> 
          {language === "ar" ? "نشاط جيت هاب" : "GitHub Activity"}
        </h2>
      </div>

      <div className="flex justify-center items-center w-full overflow-x-auto no-scrollbar pb-2" dir="ltr">
        <motion.div whileHover={{ scale: 1.01 }} className="px-2">
          <GitHubCalendar 
            username="AdnanNaous" 
            colorScheme={theme === "dark" ? "dark" : "light"}
            theme={{
              light: ['#f0f0f0', '#c4edde', '#7ac7c4', '#f73859', '#384259'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
