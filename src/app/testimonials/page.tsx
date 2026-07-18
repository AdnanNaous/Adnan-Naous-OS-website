"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      text: t("test1Text"),
      author: t("test1Author"),
      role: t("test1Role")
    },
    {
      text: t("test2Text"),
      author: t("test2Author"),
      role: t("test2Role")
    },
    {
      text: t("test3Text"),
      author: t("test3Author"),
      role: t("test3Role")
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 min-h-screen flex flex-col justify-center" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("testimonialsTitle")}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-16 max-w-xl">
          {t("testimonialsSub")}
        </p>

        {/* Changed from horizontal scrolling to a responsive grid to fix mobile layout issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={idx} 
              className="p-8 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-[var(--border)] shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="text-[var(--foreground)] mb-6 opacity-20" size={32} />
                <p className="text-lg text-[var(--foreground)] mb-8 leading-relaxed font-medium">"{item.text}"</p>
              </div>
              <div>
                <p className="font-bold text-sm">{item.author}</p>
                <p className="text-neutral-500 text-sm">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
