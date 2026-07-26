"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

type LocalizedHomepageProps = {
  english: ReactNode;
  arabic: ReactNode;
};

export function LocalizedHomepage({ english, arabic }: LocalizedHomepageProps) {
  const { language } = useLanguage();

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
      {language === "ar" ? arabic : english}
    </div>
  );
}
