"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Music, Music2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useLanguage } from "@/context/LanguageContext";

export function Pomodoro() {
  const { 
    setIsFocusMode, 
    currentTask, setCurrentTask, 
    sessionsCompleted, setSessionsCompleted,
    isPlayingLofi, setIsPlayingLofi 
  } = useDashboard();

  const { t, language } = useLanguage();

  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    setIsFocusMode(isRunning && mode === "focus");
  }, [isRunning, mode, setIsFocusMode]);

  useEffect(() => {
    if (!isRunning) return;

    const timeout = setTimeout(() => {
      if (timeLeft > 1) {
        setTimeLeft(timeLeft - 1);
        return;
      }

      setIsRunning(false);
      if (mode === "focus") {
        setSessionsCompleted((prev) => prev + 1);
        setMode("break");
        setTimeLeft(10 * 60);
      } else {
        setMode("focus");
        setTimeLeft(50 * 60);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, timeLeft, mode, setSessionsCompleted]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 50 * 60 : 10 * 60);
  };

  const switchMode = (newMode: "focus" | "break") => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "focus" ? 50 * 60 : 10 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const accessibilityText = language === "ar" ? {
    play: "تشغيل المؤقت",
    pause: "إيقاف المؤقت مؤقتًا",
    reset: "إعادة ضبط المؤقت",
    toggleLofi: "تشغيل أو إيقاف موسيقى لو فاي",
    focusTimer: "مؤقت التركيز",
    breakTimer: "مؤقت الاستراحة",
  } : {
    play: "Start timer",
    pause: "Pause timer",
    reset: "Reset timer",
    toggleLofi: "Toggle lo-fi music",
    focusTimer: "Focus timer",
    breakTimer: "Break timer",
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 relative">
      {isPlayingLofi && (
        <iframe
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0"
          allow="autoplay"
          title="Lo-fi focus music"
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
        />
      )}

      <div className="absolute top-4 left-0 right-0 text-center flex flex-col items-center gap-2">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-500 font-semibold font-serif">
          {t("quote")}
        </p>
      </div>

      <div
        role="timer"
        aria-label={`${mode === "focus" ? accessibilityText.focusTimer : accessibilityText.breakTimer}: ${formattedTime}`}
        className="text-6xl font-serif tracking-tighter mt-4 mb-2 font-light tabular-nums text-neutral-900 dark:text-white"
      >
        {formattedTime}
      </div>

      <label htmlFor="pomodoro-task" className="sr-only">{t("taskPlaceholder")}</label>
      <input
        id="pomodoro-task"
        type="text"
        placeholder={t("taskPlaceholder")}
        value={currentTask}
        onChange={(e) => setCurrentTask(e.target.value)}
        className="bg-transparent border-b border-black/10 dark:border-white/10 text-center text-sm mb-6 pb-1 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-black/40 dark:focus:border-white/40 transition-colors w-48"
      />

      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={toggleTimer}
          aria-label={isRunning ? accessibilityText.pause : accessibilityText.play}
          className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          {isRunning ? <Pause size={20} className="fill-white dark:fill-black" /> : <Play size={20} className="fill-white dark:fill-black ml-1" />}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          aria-label={accessibilityText.reset}
          className="w-10 h-10 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={16} className="text-neutral-500 dark:text-neutral-400" />
        </button>
        <button
          type="button"
          onClick={() => setIsPlayingLofi(!isPlayingLofi)}
          aria-label={accessibilityText.toggleLofi}
          aria-pressed={isPlayingLofi}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            isPlayingLofi ? "border-green-500/50 bg-green-500/10 text-green-500 dark:text-green-400" : "border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400"
          }`}
          title={accessibilityText.toggleLofi}
        >
          {isPlayingLofi ? <Music2 size={16} /> : <Music size={16} />}
        </button>
      </div>

      <div className="flex gap-2 text-sm font-medium">
        <button
          type="button"
          onClick={() => switchMode("focus")}
          aria-pressed={mode === "focus"}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            mode === "focus" ? "bg-black/10 text-black dark:bg-white/10 dark:text-white" : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          {t("focus")}
        </button>
        <button
          type="button"
          onClick={() => switchMode("break")}
          aria-pressed={mode === "break"}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            mode === "break" ? "bg-black/10 text-black dark:bg-white/10 dark:text-white" : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          {t("break")}
        </button>
      </div>

      {sessionsCompleted > 0 && (
        <div className="absolute bottom-4 text-xs text-neutral-400 dark:text-neutral-600 font-mono">
          {t("sessions")}: {sessionsCompleted}
        </div>
      )}
    </div>
  );
}
