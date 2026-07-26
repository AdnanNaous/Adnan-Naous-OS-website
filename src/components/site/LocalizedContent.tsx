"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function LocalizedContent({
  english,
  arabic,
}: {
  english: ReactNode;
  arabic: ReactNode;
}) {
  const { language } = useLanguage();
  return language === "ar" ? arabic : english;
}
