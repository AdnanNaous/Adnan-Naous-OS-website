"use client";

import { useLanguage } from "@/context/LanguageContext";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const learningLinks = [
  { name: "Computer Science", url: "#" },
  { name: "Software Engineering", url: "#" },
  { name: "AI & Machine Learning", url: "#" },
  { name: "Backend Dev", url: "#" },
  { name: "Algorithms", url: "#" },
  { name: "MIT OpenCourseWare", url: "#" },
  { name: "Harvard CS50", url: "#" },
  { name: "Coursera", url: "#" },
  { name: "edX", url: "#" },
];

export function LearningWidget() {
  const { t } = useLanguage();

  return (
    <div className="h-full w-full p-4 flex flex-col justify-center">
      <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 mb-3">
        <BookOpen size={14} className="text-neutral-500" />
        {t("learningPath")}
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {learningLinks.map((link) => (
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={link.name}
            href={link.url}
            className="px-3 py-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-full text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none whitespace-nowrap"
          >
            {link.name}
          </motion.a>
        ))}
      </div>
    </div>
  );
}
