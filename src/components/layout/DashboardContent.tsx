"use client";

import React from "react";

export default function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
      <div className="w-full">
        {children}
      </div>
    </main>
  );
}
