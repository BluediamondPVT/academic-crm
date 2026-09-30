'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface InstituteFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCourse: string;
  onFilterCourseChange: (value: string) => void;
  filterSource: string;
  onFilterSourceChange: (value: string) => void;
  courses: string[];
}

export default function InstituteFilters({
  searchTerm,
  onSearchChange,
  filterCourse,
  onFilterCourseChange,
  filterSource,
  onFilterSourceChange,
  courses,
}: InstituteFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
      {/* Search Input */}
      <div className="relative w-full lg:w-80">
        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search student, mobile, course, city..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Filter Course:</span>
          <select
            value={filterCourse}
            onChange={e => onFilterCourseChange(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Source:</span>
          <select
            value={filterSource}
            onChange={e => onFilterSourceChange(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Sources</option>
            <option value="Google Search / Website">Google / Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook / Meta Ads">Facebook / Meta Ads</option>
            <option value="JustDial">JustDial</option>
            <option value="Direct Walk-in (Center)">Direct Walk-in</option>
            <option value="Referral / Friend">Referral</option>
            <option value="Poster / Banner / Pamphlet">Poster / Pamphlet</option>
            <option value="WhatsApp Enquiry">WhatsApp</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
