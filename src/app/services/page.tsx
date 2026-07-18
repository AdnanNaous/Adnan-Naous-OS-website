"use client";

import { motion } from "framer-motion";
import { Server, Gamepad2, Brain, PenTool } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: <Server size={24} />,
      title: t("svc1Title"),
      description: t("svc1Desc")
    },
    {
      icon: <Gamepad2 size={24} />,
      title: t("svc2Title"),
      description: t("svc2Desc")
    },
    {
      icon: <Brain size={24} />,
      title: t("svc3Title"),
      description: t("svc3Desc")
    },
    {
      icon: <PenTool size={24} />,
      title: t("svc4Title"),
      description: t("svc4Desc")
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 min-h-screen" dir={language === "ar" ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t("servicesTitle")}</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-12 max-w-xl">
          {t("servicesSub")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={idx} 
              className="flex gap-6 p-6 rounded-2xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] backdrop-blur-md shadow-sm">
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">{service.title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
