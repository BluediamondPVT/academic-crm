"use client";

import React from "react";

export interface TaskProgressProps {
  task: {
    status: string;
    createdAt: string | Date;
    dueDate?: string | Date;
    updatedAt?: string | Date;
  };
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function calculateTaskProgress(task: {
  status: string;
  createdAt: string | Date;
  dueDate?: string | Date;
  updatedAt?: string | Date;
}) {
  const isCompleted = task.status === "COMPLETED";
  const isInProgress = task.status === "IN_PROGRESS";
  const now = new Date();
  const created = new Date(task.createdAt);
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const completedAt = task.updatedAt ? new Date(task.updatedAt) : now;

  // Overdue check: if completed, compare completedAt vs due date; if not completed, compare now vs due date
  const isOverdue = due ? (isCompleted ? completedAt > due : now > due) : false;

  let percent = 0;
  let statusText = "Pending";
  let theme: "red" | "amber" | "green" = "red";

  if (isCompleted) {
    percent = 100;
    if (isOverdue) {
      // Completed after due date -> Red
      theme = "red";
      statusText = "Completed (Late)";
    } else {
      // Completed on or before due date -> Vibrant Green!
      theme = "green";
      statusText = "Completed (On Time)";
    }
  } else if (isOverdue) {
    // Past due date and still not completed -> Red
    percent = 100;
    theme = "red";
    statusText = "Overdue";
  } else if (isInProgress) {
    // In progress and within deadline -> Gradual transition towards green
    if (due && due.getTime() > created.getTime()) {
      const total = due.getTime() - created.getTime();
      const elapsed = Math.max(0, now.getTime() - created.getTime());
      const ratio = Math.min(0.85, Math.max(0.25, elapsed / total));
      percent = Math.round(ratio * 100);
    } else {
      percent = 50;
    }

    if (percent >= 70) {
      theme = "green";
    } else if (percent >= 35) {
      theme = "amber";
    } else {
      theme = "red";
    }
    statusText = "In Progress";
  } else {
    // Initially PENDING -> 0%, RED
    percent = 0;
    theme = "red";
    statusText = "Not Started";
  }

  return { percent, theme, isOverdue, isCompleted, statusText };
}

export default function TaskProgressBar({
  task,
  size = "md",
  showLabel = true,
}: TaskProgressProps) {
  const { percent, theme, statusText } = calculateTaskProgress(task);

  // Styles based on theme (Red -> Amber -> Vibrant Green matching reference image)
  const themeStyles = {
    green: {
      outerBorder: "border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.35)]",
      barGradient: "bg-gradient-to-r from-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]",
      textColor: "text-emerald-500 font-bold",
      glowBg: "bg-slate-900/90",
    },
    amber: {
      outerBorder: "border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.35)]",
      barGradient: "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]",
      textColor: "text-amber-500 font-bold",
      glowBg: "bg-slate-900/90",
    },
    red: {
      outerBorder: "border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
      barGradient: "bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
      textColor: "text-rose-500 font-bold",
      glowBg: "bg-slate-900/90",
    },
  }[theme];

  if (size === "sm") {
    // Mini bar for tables
    return (
      <div className="flex items-center gap-2 w-28 mx-auto">
        <div className={`relative flex-1 h-3 rounded-full ${themeStyles.glowBg} border ${themeStyles.outerBorder} p-0.5 overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${themeStyles.barGradient}`}
            style={{ width: `${Math.max(percent, percent === 0 ? 0 : 6)}%` }}
          />
        </div>
        <span className={`text-[10px] font-mono shrink-0 ${themeStyles.textColor}`}>
          {percent}%
        </span>
      </div>
    );
  }

  // Medium / Large: Detailed glowing capsule as shown in user's image
  const heightClass = size === "lg" ? "h-6 p-1" : "h-4 p-0.5";

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {statusText}
          </span>
          <span className={`font-mono text-xs ${themeStyles.textColor}`}>
            {percent}%
          </span>
        </div>
      )}

      {/* Futuristic Glowing Capsule Bar */}
      <div
        className={`relative w-full ${heightClass} rounded-full ${themeStyles.glowBg} border ${themeStyles.outerBorder} overflow-hidden transition-all duration-500`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${themeStyles.barGradient}`}
          style={{ width: `${Math.max(percent, percent === 0 ? 0 : 4)}%` }}
        />
      </div>
    </div>
  );
}
