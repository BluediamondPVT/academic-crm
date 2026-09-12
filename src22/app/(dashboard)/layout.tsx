import { cookies } from "next/headers";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DashboardContent from "@/components/layout/DashboardContent";

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Sticky Header */}
        <Header role={userRole} userName={userName} />

        {/* Dynamic Page Content: Full screen for workspace, padded for standard dashboards */}
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
}