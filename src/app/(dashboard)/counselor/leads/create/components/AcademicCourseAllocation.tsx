'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { University, Course } from '../../types';

interface AcademicCourseAllocationProps {
  universities: University[];
  universityId: string;
  courseIndex: string;
  learningMode: string;
  session: string;
  selectedUniversity?: University;
  selectedCourse?: Course | null;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

export default function AcademicCourseAllocation({
  universities,
  universityId,
  courseIndex,
  learningMode,
  session,
  selectedUniversity,
  selectedCourse,
  onInputChange,
}: AcademicCourseAllocationProps) {
  return (
    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#1e40af]" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1e40af]">
            Academic University Course Allocation
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1e40af] text-white">
          University Degree
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select University */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Select University <span className="text-red-500">*</span>
          </label>
          <select
            name="universityId"
            value={universityId}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all bg-white"
          >
            <option value="">-- Select University --</option>
            {universities.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.location} - {u.modeOfLearning})
              </option>
            ))}
          </select>
        </div>

        {/* Select Course */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Select Course <span className="text-red-500">*</span>
          </label>
          <select
            name="courseIndex"
            disabled={!selectedUniversity}
            value={courseIndex}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all ${
              !selectedUniversity ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
            }`}
          >
            <option value="">
              {selectedUniversity
                ? '-- Select Course --'
                : '-- First select a university above --'}
            </option>
            {selectedUniversity?.courses.map((course, idx) => (
              <option key={idx} value={idx}>
                {course.name} {course.specialization ? `- ${course.specialization}` : ''} ({course.duration} Yrs - ₹{course.totalFee?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Academic Inputs: Mode of Learning & Session */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Mode of Learning
          </label>
          <select
            name="learningMode"
            value={learningMode}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
          >
            <option value="Online">Online Mode</option>
            <option value="Distance">Distance Mode</option>
            <option value="Regular">Regular Campus Mode</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Admission Session
          </label>
          <select
            name="session"
            value={session}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
          >
            <option value="July 2026">July 2026 Session</option>
            <option value="January 2026">January 2026 Session</option>
          </select>
        </div>
      </div>

      {/* Selected Course Details Preview Card */}
      {selectedCourse && (
        <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Selected Course Summary
            </span>
            <span className="px-2 py-0.5 bg-[#112a46] text-white rounded text-xs font-bold">
              {selectedCourse.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div>
              <span className="text-gray-400 block font-semibold mb-0.5">Duration</span>
              <span className="font-bold text-gray-800">{selectedCourse.duration} Years</span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold mb-0.5">Total Fee</span>
              <span className="font-bold text-gray-800">₹{selectedCourse.totalFee?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold mb-0.5">Year Fee</span>
              <span className="font-bold text-gray-800">₹{selectedCourse.yearFee?.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold mb-0.5">Semester Fee</span>
              <span className="font-bold text-gray-800">₹{selectedCourse.semesterFee?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
