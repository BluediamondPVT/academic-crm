"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  X,
  GraduationCap,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error(err);
    } 
  };

 const navItems = [
    { name: "Dashboard", href: role === "ADMIN" ? "/admin" : "/counselor", icon: LayoutDashboard },
    
    // 🔥 Admin Only Tabs (Counselors aur Universities dono yahan aayenge)
    ...(role === "ADMIN" ? [
      { name: "Counselors", href: "/admin/counselors", icon: Users },
      { name: "Universities", href: "/admin/universities", icon: GraduationCap } 
    ] : []),

    // 🔥 Counselor Only Tabs
    ...(role === "COUNSELOR" ? [
      { name: "Students", href: "/counselor/students", icon: GraduationCap }
    ] : []),
    
    // Common Tabs (Dono ko dikhenge)
    { name: "Leads", href: "#", icon: Users },
    { name: "Settings", href: "#", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-350">
      {/* Top Logo / Branding */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 text-sm flex-shrink-0">
            A
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <span className="font-bold tracking-wider text-white text-sm transition-all duration-300">
              ACADEMIC CRM
            </span>
          )}
        </div>
        {/* Mobile close button */}
        {isMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-slate-800 text-indigo-400 font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              } ${isCollapsed && !isMobileOpen ? "justify-center rounded-xl border-l-0" : ""}`}
            >
              <item.icon size={20} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white transition-colors"} />
              {(!isCollapsed || isMobileOpen) && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-rose-450 hover:text-rose-400 hover:bg-rose-950/20 p-2.5 rounded-xl w-full transition-all duration-200 ${
            isCollapsed && !isMobileOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="text-rose-400" />
          {(!isCollapsed || isMobileOpen) && <span className="font-semibold text-rose-400 text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col relative h-screen bg-slate-900 border-r border-slate-950 transition-all duration-300 ease-in-out z-30 overflow-visible ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle Collapse Button on Edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-5 bg-white border border-slate-800 hover:bg-slate-800 rounded-full p-2 text-black hover:text-white shadow-sm transition-all duration-200 z-50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-950 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}