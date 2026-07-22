"use client";

import { useLanguage } from "@/context/LanguageContext";
import { publicData } from "@/data/public";
import { User, GraduationCap, Code, HeartPulse, BrainCircuit } from "lucide-react";

export function AboutWidget() {
  const { language } = useLanguage();
  const currentEducation = publicData.education.find((entry) => entry.status === "in-progress")!;
  const previousStudy = publicData.education.find((entry) => entry.status === "incomplete-study")!;
  const english = publicData.languages.find((entry) => entry.id === "english")!;
  const windowsSkill = publicData.skills.find((skill) => skill.id === "windows-administration")!;

  return (
    <div className="h-full w-full p-5 flex flex-col relative overflow-hidden group">
      {/* Accent glow for the CV widget */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
          <User size={18} className="text-blue-600 dark:text-blue-400" /> 
          {language === "ar" ? "عني (السيرة الذاتية)" : "About Me (CV)"}
        </h2>

        <div className="flex-1 flex flex-col justify-around gap-4">
          {/* Education */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
              <GraduationCap size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{currentEducation.program}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{currentEducation.institution}</p>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
              <BrainCircuit size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{english.name[language]}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{english.level}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
              <Code size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{windowsSkill.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{windowsSkill.description?.[language]}</p>
            </div>
          </div>

          {/* Medical Background */}
          <div className="flex items-start gap-3">
            <div className="mt-1 p-2 bg-neutral-100 dark:bg-white/5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400">
              <HeartPulse size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{previousStudy.program}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{previousStudy.description[language]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
