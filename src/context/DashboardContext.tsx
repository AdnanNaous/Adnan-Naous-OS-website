"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  currentTask: string;
  setCurrentTask: (val: string) => void;
  sessionsCompleted: number;
  setSessionsCompleted: React.Dispatch<React.SetStateAction<number>>;
  isPlayingLofi: boolean;
  setIsPlayingLofi: (val: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isPlayingLofi, setIsPlayingLofi] = useState(false);

  return (
    <DashboardContext.Provider value={{
      isFocusMode, setIsFocusMode,
      currentTask, setCurrentTask,
      sessionsCompleted, setSessionsCompleted,
      isPlayingLofi, setIsPlayingLofi
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
