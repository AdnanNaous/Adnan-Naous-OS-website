"use client";

import { Search, Command, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function CommandCenter() {
  const [query, setQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      const isEditable = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || (target instanceof HTMLElement && target.isContentEditable);

      if (e.key === "/" && !isEditable) {
        e.preventDefault();
        setStatusMessage("");
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const lowerQuery = query.trim().toLowerCase();
    
    // Command Parsing Logic
    if (lowerQuery.startsWith("github ")) {
      const searchTerms = encodeURIComponent(query.slice(7));
      window.location.href = `https://github.com/search?q=${searchTerms}`;
    } else if (lowerQuery.startsWith("yt ")) {
      const searchTerms = encodeURIComponent(query.slice(3));
      window.location.href = `https://www.youtube.com/results?search_query=${searchTerms}`;
    } else if (lowerQuery.startsWith("ai ")) {
      const searchTerms = encodeURIComponent(query.slice(3));
      window.location.href = `https://chat.openai.com/?q=${searchTerms}`;
    } else if (lowerQuery.startsWith("steam ")) {
      const searchTerms = encodeURIComponent(query.slice(6));
      window.location.href = `https://steamdb.info/search/?a=app&q=${searchTerms}`;
    } else {
      // Default to Google
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Escape") return;

    e.preventDefault();
    const hadQuery = query.length > 0;
    setQuery("");
    e.currentTarget.blur();
    setStatusMessage(language === "ar"
      ? hadQuery ? "تم مسح الأمر وإغلاق حقل الإدخال." : "تم إغلاق حقل الأوامر."
      : hadQuery ? "Command cleared and input closed." : "Command input closed."
    );
  };

  const searchLabel = language === "ar" ? "البحث ومركز الأوامر" : "Search and command center";
  const shortcutHelp = language === "ar" ? "اضغط على الشرطة المائلة للتركيز على البحث." : "Press slash to focus search.";

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 w-full gap-4">
      <h2 className="text-xl font-serif text-neutral-800 dark:text-white/80 flex items-center gap-2">
        <Command size={20} /> {t("commandCenter")}
      </h2>
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search aria-hidden="true" className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          </div>
          <label htmlFor="command-center-search" className="sr-only">{searchLabel}</label>
          <input
            id="command-center-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (statusMessage) setStatusMessage("");
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={t("searchPlaceholder")}
            aria-describedby="command-center-help"
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-4 px-12 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] focus:shadow-[0_0_25px_rgba(0,0,0,0.1)] dark:focus:shadow-[0_0_25px_rgba(255,255,255,0.1)] text-lg"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-black/10 dark:bg-white/10 px-2 py-1 rounded text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              /
            </kbd>
          </div>
        </div>
      </form>
      <div id="command-center-help" className="flex gap-4 text-xs text-neutral-500 font-medium">
        <span className="sr-only">{shortcutHelp}</span>
        <span className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"><Search size={14}/> Google</span>
        <span className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"><Sparkles size={14}/> ChatGPT</span>
        <span className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">GitHub</span>
        <span className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">YouTube</span>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{statusMessage}</p>
    </div>
  );
}
