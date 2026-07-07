"use client";

import { useEffect, useState } from "react";
import { User, Menu } from "lucide-react";

interface HeaderProps {
  role: string;
  userName?: string;
}

export default function Header({ role, userName }: HeaderProps) {
  const [displayName, setDisplayName] = useState<string>(userName || "");

  const triggerMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  useEffect(() => {
    if (!displayName) {
      // Try to read cookie on client if server didn't pass name
      try {
        const raw = document.cookie
          .split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith("userName="));
        if (raw) {
          const val = decodeURIComponent(raw.split("=")[1] || "");
          if (val) setDisplayName(val);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [displayName]);

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 bg-white flex items-center justify-between px-6">

      {/* Left: Mobile hamburger menu */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={triggerMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-4 ml-auto">
        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-slate-800">{displayName || "User"}</span>
            <span className="text-xs text-slate-400 capitalize">{role.toLowerCase()}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-xs">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
