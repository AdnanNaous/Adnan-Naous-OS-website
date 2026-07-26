"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useLanguage } from "@/context/LanguageContext";
import { Folder } from "lucide-react";
import { motion } from "framer-motion";
import { publicData } from "@/data/public";

const bookmarkClassName = "flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-sm text-[var(--foreground)] transition-colors shadow-sm";

export function BookmarksWidget() {
  const { isFocusMode } = useDashboard();
  const { t, language } = useLanguage();

  const visibleBookmarks = isFocusMode
    ? publicData.bookmarks.filter((bookmark) => bookmark.featured)
    : publicData.bookmarks;
  const categories = [...new Set(visibleBookmarks.map((bookmark) => bookmark.category))];

  return (
    <div className="h-full w-full p-6 flex flex-col justify-start">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <Folder size={18} className="text-neutral-500" /> 
          {t("osDirectory")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
        {categories.map((category) => (
          <div key={category} className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold pl-1">{category}</span>
            <div className="flex flex-wrap gap-2">
              {visibleBookmarks.filter((bookmark) => bookmark.category === category).map((bookmark) => (
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    key={bookmark.id}
                    href={bookmark.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${bookmarkClassName} hover:bg-neutral-200 dark:hover:bg-white/10`}
                    title={
                      language === "ar" && "ar" in bookmark.description && typeof bookmark.description.ar === "string"
                        ? bookmark.description.ar
                        : bookmark.description.en
                    }
                  >
                    <span className="font-medium">{bookmark.name}</span>
                    <span className="sr-only"> ({t("opensInNewTab")})</span>
                  </motion.a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
