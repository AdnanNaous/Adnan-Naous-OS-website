"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Activity, Flame, Clock, Code, GitCommit } from "lucide-react";

export function MetricsWidget() {
  const { sessionsCompleted } = useDashboard();
  
  const hoursFocused = ((sessionsCompleted * 50) / 60).toFixed(1);

  return (
    <div className="h-full w-full p-6 flex flex-col justify-center">
      <h2 className="text-lg font-serif text-white/80 flex items-center gap-2 mb-6">
        <Activity size={20} /> OS Metrics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
            <Flame size={16} className="text-orange-500" /> Current Streak
          </div>
          <div className="text-3xl font-serif text-white">14 <span className="text-lg text-neutral-500">days</span></div>
        </div>

        {/* Metric 2: Hours Focused (Dynamic from Pomodoro) */}
        <div className="flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium relative z-10">
            <Clock size={16} className="text-blue-400" /> Hours Focused
          </div>
          <div className="text-3xl font-serif text-white relative z-10">{hoursFocused} <span className="text-lg text-neutral-500">hrs</span></div>
        </div>

        {/* Metric 3: Current Project */}
        <div className="flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
            <Code size={16} className="text-green-400" /> Current Project
          </div>
          <div className="text-lg font-medium text-white truncate mt-1">Personal OS</div>
          <div className="text-xs text-neutral-500">Building in public</div>
        </div>

        {/* Metric 4: Last Commit */}
        <div className="flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
            <GitCommit size={16} className="text-purple-400" /> Last Commit
          </div>
          <div className="text-lg font-mono text-white mt-1">a1b2c3d</div>
          <div className="text-xs text-neutral-500">2 hours ago</div>
        </div>
      </div>
    </div>
  );
}
