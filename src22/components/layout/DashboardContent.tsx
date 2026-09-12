"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullSize = pathname?.startsWith("/workspace");

  if (isFullSize) {
    return (
      <main className="flex-1 overflow-hidden h-full w-full min-h-0 p-0 m-0">
        {children}
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </main>
  );
}
