'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function AcademicDashboardPage() {
  return (
    <div className="space-y-4 font-sans p-2">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Welcome ACADEMIC
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            You have access to Confirmed Admissions, Partner Universities, and Student Leads.
          </p>
        </div>
      </div>
    </div>
  );
}
