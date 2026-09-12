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
  Headset,
  ClipboardList,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [hasTasks, setHasTasks] = useState(role === "STAFF");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  useEffect(() => {
    // Non-admin roles check their tasks
    if (role === "ADMIN") return;

    const checkTasks = async () => {
      try {
        const res = await fetch("/api/workspace/tasks");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const pending = data.data.filter((t: any) => t.status !== "COMPLETED").length;
            setTaskCount(pending);
            setHasTasks(data.data.length > 0 || role === "STAFF");
          }
        }
      } catch (err) {
        console.error("Error fetching tasks for sidebar:", err);
      }
    };

    checkTasks();
    const interval = setInterval(checkTasks, 15000);
    return () => clearInterval(interval);
  }, [role, pathname]);

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

  const getDashboardHref = () => {
    if (role === "ADMIN") return "/admin";
    if (role === "ACADEMIC") return "/academic";
    if (role === "STAFF") return "/workspace";
    return "/counselor";
  };

  const navItems = [
    // Primary Dashboard for non-staff roles (Staff uses Tasks directly)
    ...(role !== "STAFF" ? [
      { name: "Dashboard", href: getDashboardHref(), icon: LayoutDashboard }
    ] : []),
    
    // 🔥 Admin Only Tabs
    ...(role === "ADMIN" ? [
      { name: "Staff", href: "/admin/staff", icon: Users },
      { name: "Universities", href: "/admin/universities", icon: GraduationCap },
      { name: "Tasks", href: "/admin/tasks", icon: ClipboardList },
      { name: "Leads", href: "/admin/students", icon: Headset },
      { name: "Admission", href: "/admissions", icon: Users }
    ] : []),

    // 🔥 Academic Only Tabs
    ...(role === "ACADEMIC" ? [
      { name: "Admission", href: "/admissions", icon: Users },
      { name: "Universities", href: "/admin/universities", icon: GraduationCap },
      { name: "Leads", href: "/admin/students", icon: Headset },
      ...(hasTasks ? [{ name: "Tasks", href: "/workspace", icon: ClipboardList, badge: taskCount }] : [])
    ] : []),

    // 🔥 Counselor Only Tabs
    ...(role === "COUNSELOR" ? [
      { name: "Leads", href: "/counselor/leads", icon: Headset },
      ...(hasTasks ? [{ name: "Tasks", href: "/workspace", icon: ClipboardList, badge: taskCount }] : [])
    ] : []),

    // 🔥 Staff Only Tabs
    ...(role === "STAFF" ? [
      { name: "Tasks", href: "/workspace", icon: ClipboardList, badge: taskCount }
    ] : []),
    
    // Common Tabs
    { name: "Settings", href: "#", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-350">
      {/* Top Logo / Branding */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20 text-sm shrink-0">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative outline-none focus:outline-none ${
                isActive
                  ? "bg-slate-800 text-indigo-400 font-semibold border-l-4 border-indigo-500 rounded-l-none"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              } ${isCollapsed && !isMobileOpen ? "justify-center rounded-xl border-l-0" : ""}`}
            >
              <item.icon size={20} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white transition-colors"} />
              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="text-sm font-medium flex-1">{item.name}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && !isMobileOpen && Boolean(item.badge && item.badge > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-rose-450 hover:text-rose-400 hover:bg-rose-950/20 p-2.5 rounded-xl w-full transition-all duration-200 outline-none focus:outline-none ${
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
        className={`hidden lg:flex flex-col relative h-full bg-slate-900 border-r border-slate-950 transition-all duration-300 ease-in-out z-30 overflow-visible shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle Collapse Button on Edge */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center absolute -right-3.5 top-5 w-7 h-7 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 rounded-full shadow-md transition-all duration-200 z-50 focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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