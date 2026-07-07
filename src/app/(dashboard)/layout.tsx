import { cookies } from "next/headers";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value || "COUNSELOR";
  const userName = cookieStore.get("userName")?.value || "";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
      
      {/* Sidebar Component */}
      <Sidebar role={userRole} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Header */}
        <Header role={userRole} userName={userName} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}