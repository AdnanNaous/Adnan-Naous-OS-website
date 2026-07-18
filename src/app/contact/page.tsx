"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t, language } = useLanguage();

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen flex items-center" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("contactTitle")}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-12 max-w-xl">
          {t("contactSub")}
        </p>

        <div className="mt-8">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">Work Email</p>
          <a 
            href="mailto:Adnan.Naous@outlook.com"
            className="inline-flex items-center gap-3 text-2xl md:text-4xl font-bold text-[var(--foreground)] hover:text-neutral-500 transition-colors mb-16"
          >
            Adnan.Naous@outlook.com
            <Send size={24} className={language === "ar" ? "rotate-180" : ""} />
          </a>

          {/* Visual Coding Effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm sm:text-base text-green-400 p-4 sm:p-6"
            dir="ltr"
          >
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <div className="space-y-2 opacity-90">
              <p><span className="text-blue-400">adnan@os</span>:<span className="text-purple-400">~</span>$ ./initiate_contact.sh</p>
              <p className="text-neutral-400">Loading modules...</p>
              <p className="text-neutral-400">Establishing secure connection [||||||||||] 100%</p>
              <p className="text-yellow-400">Warning: High traffic detected.</p>
              <p><span className="text-blue-400">adnan@os</span>:<span className="text-purple-400">~</span>$ mailx -s &quot;Incoming Project&quot; Adnan.Naous@outlook.com</p>
              <p className="text-neutral-500 italic">Waiting for input... <span className="animate-pulse inline-block w-2 h-4 bg-green-400 align-middle ml-1"></span></p>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
