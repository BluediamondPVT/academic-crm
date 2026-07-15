'use client';

import React from 'react';
import { GraduationCap, Building, BookOpen } from 'lucide-react';
import { StudentRecord, University } from '../types';

interface StudentStatsProps {
  students: StudentRecord[];
  universities: University[];
}

export default function StudentStats({ students, universities }: StudentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af]"></div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Total Enrolled Students
          </p>
          <h3 className="text-3xl font-black text-[#112a46]">{students.length}</h3>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981]"></div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Active Universities Available
          </p>
          <h3 className="text-3xl font-black text-[#112a46]">{universities.length}</h3>
        </div>
        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
          <Building className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#6366f1]"></div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Courses Allocated
          </p>
          <h3 className="text-3xl font-black text-[#112a46]">
            {new Set(students.map(s => s.courseName)).size}
          </h3>
        </div>
        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );
}
