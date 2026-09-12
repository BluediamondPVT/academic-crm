"use client";

import React from "react";

export default function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </main>
  );
}
