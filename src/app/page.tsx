"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaXTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6 text-center relative overflow-hidden" dir={language === "ar" ? "rtl" : "ltr"}>
      
      {/* Background decoration */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20 blur-[50px] pointer-events-none"
        style={{ backgroundImage: "url('/custom-bg.png')" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-500 opacity-[0.02] blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl z-10 flex flex-col items-center"
      >
        {/* Retro-Futuristic Profile Image */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full mb-8"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-black dark:bg-white blur-xl opacity-20 dark:opacity-40 animate-pulse" />
          
          <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-900 shadow-2xl z-10">
            {/* The Image with CSS Filters */}
            <img 
              src="/profile.jpg" 
              alt="Adnan Naous" 
              className="w-full h-full object-cover dark:grayscale dark:contrast-125 dark:brightness-90"
            />
            {/* Retro Scanlines Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWCAAAADUlEQVQIW2NkYGD4zwABAgEBE1E9kQAAAABJRU5ErkJggg==')] opacity-30 mix-blend-overlay pointer-events-none" />
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          {t("heroTitle1")} <span className="text-neutral-500 dark:text-neutral-300">{t("heroTitleAccent")}</span> {t("heroTitle2")}
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <Link 
            href="/portfolio" 
            className="w-full sm:w-auto px-8 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg flex items-center justify-center"
          >
            {t("viewProjects")}
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto px-8 py-3 bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center backdrop-blur-sm"
          >
            {t("getInTouch")}
          </Link>
        </div>

        <div className="flex justify-center gap-8 text-neutral-400">
          <motion.a whileHover={{ y: -3, color: "var(--foreground)" }} whileTap={{ scale: 0.9 }} href="https://x.com/aantrueman" target="_blank" rel="noreferrer" className="transition-colors">
            <FaXTwitter size={24} />
          </motion.a>
          <motion.a whileHover={{ y: -3, color: "var(--foreground)" }} whileTap={{ scale: 0.9 }} href="https://github.com/AdnanNaous" target="_blank" rel="noreferrer" className="transition-colors">
            <FaGithub size={24} />
          </motion.a>
          <motion.a whileHover={{ y: -3, color: "var(--foreground)" }} whileTap={{ scale: 0.9 }} href="https://www.linkedin.com/in/adnan-naous/" target="_blank" rel="noreferrer" className="transition-colors">
            <FaLinkedinIn size={24} />
          </motion.a>
        </div>
      </motion.div>
    </main>
  );
}
