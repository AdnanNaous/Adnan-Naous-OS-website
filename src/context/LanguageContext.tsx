"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";

const translations = {
  en: {
    home: "Home",
    portfolio: "Portfolio",
    services: "Capabilities",
    about: "About",
    testimonials: "Recognition",
    blog: "Writing",
    contact: "Contact",
    tools: "Personal OS",
    githubTimeline: "GitHub Timeline",
    
    // Tools Page
    commandCenter: "Command Center",
    searchPlaceholder: "Search or type a command (yt, github, ai, steam)...",
    osDirectory: "OS Directory",
    learningPath: "Learning Path",
    focus: "Focus (50m)",
    break: "Break (10m)",
    taskPlaceholder: "What are you working on?",
    
    // Missing OS widget keys
    quote: "\"Discipline Creates Freedom.\"",
    sessions: "Sessions",
    opensInNewTab: "opens in a new tab",
  },
  ar: {
    home: "الرئيسية",
    portfolio: "الأعمال",
    services: "القدرات",
    about: "عني",
    testimonials: "التقدير",
    blog: "الكتابة",
    contact: "تواصل",
    tools: "النظام الشخصي",
    githubTimeline: "نشاط GitHub",
    
    commandCenter: "مركز الأوامر",
    searchPlaceholder: "ابحث أو اكتب أمراً (yt, github, ai, steam)...",
    osDirectory: "مجلدات النظام",
    learningPath: "مسار التعلم",
    focus: "تركيز (50 دقيقة)",
    break: "استراحة (10 دقائق)",
    taskPlaceholder: "ما الذي تعمل عليه؟",
    
    // Missing OS widget keys
    quote: "\"الانضباط يصنع الحرية.\"",
    sessions: "الجلسات",
    opensInNewTab: "يفتح في علامة تبويب جديدة",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations["en"]) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
