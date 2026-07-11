'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Building, Users, ArrowRight, BookOpen } from 'lucide-react';

export default function CounselorPage() {
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [universitiesCount, setUniversitiesCount] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [stuRes, uniRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/admin/universities')
        ]);
        if (stuRes.ok) {
          const s = await stuRes.json();
          setStudentsCount(Array.isArray(s) ? s.length : 0);
        }
        if (uniRes.ok) {
          const u = await uniRes.json();
          setUniversitiesCount(Array.isArray(u) ? u.length : 0);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#112a46] tracking-tight">Counselor Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Welcome! Manage student admissions and allocate courses based on university offerings.
        </p>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/counselor/students"
          className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af]"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ENROLLED STUDENTS</p>
            <h3 className="text-3xl font-black text-[#112a46]">{studentsCount}</h3>
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 mt-2">
              Manage Students <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-blue-600" />
          </div>
        </Link>

        <Link
          href="/counselor/students"
          className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-all group relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981]"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">AVAILABLE UNIVERSITIES</p>
            <h3 className="text-3xl font-black text-[#112a46]">{universitiesCount}</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-2">
              View Course Catalogs <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <Building className="h-7 w-7 text-green-600" />
          </div>
        </Link>
      </div>
    </div>
  );
}