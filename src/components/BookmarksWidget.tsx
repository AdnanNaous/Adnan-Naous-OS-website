"use client";

import { useDashboard } from "@/context/DashboardContext";
import { useLanguage } from "@/context/LanguageContext";
import { Folder } from "lucide-react";
import { motion } from "framer-motion";

type Bookmark = { icon: string, link: string, name: string };

const categories: Record<string, Bookmark[]> = {
  "Main AI": [
    { icon: "✨", link: "https://gemini.google.com", name: "Gemini" },
    { icon: "🧠", link: "https://claude.ai", name: "Claude" },
    { icon: "🤖", link: "https://chatgpt.com", name: "ChatGPT" },
    { icon: "🔍", link: "https://perplexity.ai", name: "Perplexity" },
    { icon: "🐋", link: "https://deepseek.com", name: "DeepSeek" },
    { icon: "🧩", link: "https://qwen.ai", name: "Qwen" },
    { icon: "🌌", link: "https://grok.com", name: "Grok" },
    { icon: "💠", link: "https://meta.ai", name: "Meta AI" },
  ],
  "Courses": [
    { icon: "🎓", link: "#", name: "MOOC.fi" },
    { icon: "📱", link: "#", name: "Huawei" },
    { icon: "🏫", link: "#", name: "Tuwaiq" },
    { icon: "🌐", link: "#", name: "Cisco" },
    { icon: "☁️", link: "#", name: "ORACLE Training" },
    { icon: "🍃", link: "#", name: "Spring Academy" },
    { icon: "💻", link: "https://hackerrank.com", name: "HackerRank" },
    { icon: "📚", link: "https://coursera.org", name: "Coursera" },
    { icon: "🎯", link: "https://udemy.com", name: "Udemy" },
    { icon: "🤓", link: "https://geeksforgeeks.org", name: "GeeksforGeeks" },
  ],
  "Study": [
    { icon: "🚀", link: "https://jetbrains.com", name: "JetBrains" },
    { icon: "📘", link: "https://hyperskill.org", name: "Hyperskill" },
    { icon: "⚔️", link: "https://codewars.com", name: "Codewars" },
    { icon: "💻", link: "https://exercism.org", name: "Exercism" },
    { icon: "⛺", link: "https://datacamp.com", name: "DataCamp" },
    { icon: "📱", link: "https://sololearn.com", name: "Sololearn" },
    { icon: "🚀", link: "https://neetcode.io", name: "NeetCode" },
    { icon: "💡", link: "https://leetcode.com", name: "LeetCode" },
  ],
  "Social Devs": [
    { icon: "📰", link: "https://thehackernews.com", name: "The Hacker News" },
    { icon: "💻", link: "https://stackoverflow.com", name: "Stack Overflow" },
    { icon: "✍️", link: "https://hashnode.com", name: "Hashnode" },
    { icon: "👩‍💻", link: "https://dev.to", name: "DEV TO" },
    { icon: "🦞", link: "https://lobste.rs", name: "Lobsters" },
  ],
  "Design": [
    { icon: "🎨", link: "https://figma.com", name: "Figma" },
    { icon: "🖼️", link: "https://dribbble.com", name: "Dribbble" },
  ],
  "Utilities": [
    { icon: "🐙", link: "https://github.com", name: "GitHub" },
    { icon: "📝", link: "https://notion.so", name: "Notion" },
  ]
};

export function BookmarksWidget() {
  const { isFocusMode } = useDashboard();
  const { t } = useLanguage();

  const availableCategories = Object.keys(categories).filter(cat => {
    if (isFocusMode && cat === "Social Devs") return false;
    return true;
  });

  return (
    <div className="h-full w-full p-6 flex flex-col justify-start">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <Folder size={18} className="text-neutral-500" /> 
          {t("osDirectory")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
        {availableCategories.map((cat) => (
          <div key={cat} className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold pl-1">{cat}</span>
            <div className="flex flex-wrap gap-2">
              {categories[cat].map((bm) => (
                <motion.a 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={bm.name} 
                  href={bm.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-sm text-[var(--foreground)] hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors shadow-sm"
                >
                  <span className="text-base leading-none">{bm.icon}</span>
                  <span className="font-medium">{bm.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
