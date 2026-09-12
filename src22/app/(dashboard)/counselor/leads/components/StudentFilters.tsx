'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { University } from '../types';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterUniversity: string;
  onFilterUniversityChange: (value: string) => void;
  universities: University[];
}

export default function StudentFilters({
  searchTerm,
  onSearchChange,
  filterUniversity,
  onFilterUniversityChange,
  universities,
}: StudentFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="relative w-full md:w-80">
        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search student, phone or course..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <span className="text-xs font-bold text-gray-500 uppercase">Filter University:</span>
        <select
          value={filterUniversity}
          onChange={e => onFilterUniversityChange(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Universities</option>
          {universities.map(u => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
