'use client';

import React from 'react';
import { StudentRecord, University } from '../types';
import StudentStats from './StudentStats';
import StudentFilters from './StudentFilters';
import StudentsTable from './StudentsTable';

interface AcademicViewProps {
  students: StudentRecord[];
  universities: University[];
  filteredStudents: StudentRecord[];
  loading: boolean;
  isAdmin: boolean;
  filterStatus: string;
  onFilterStatusChange: (statusName: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterUniversity: string;
  onFilterUniversityChange: (value: string) => void;
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (student: StudentRecord) => void;
}

export default function AcademicView({
  students,
  universities,
  filteredStudents,
  loading,
  isAdmin,
  filterStatus,
  onFilterStatusChange,
  searchTerm,
  onSearchChange,
  filterUniversity,
  onFilterUniversityChange,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
}: AcademicViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight">
          Student Management (Academic)
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 font-medium">
          Enroll students and allocate university courses according to university listings
        </p>
      </div>

      {/* Overview Stats Matrix */}
      <StudentStats
        students={students}
        universities={universities}
        activeStatus={filterStatus}
        isAdmin={isAdmin}
        onStatusClick={onFilterStatusChange}
      />

      {/* Search & University Filters */}
      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterUniversity={filterUniversity}
        onFilterUniversityChange={onFilterUniversityChange}
        universities={universities}
      />

      {/* Enrolled Students Table */}
      <StudentsTable
        students={filteredStudents}
        loading={loading}
        onSelectStudent={onSelectStudent}
        onEditStudent={onEditStudent}
        isAdmin={isAdmin}
        onDeleteStudent={onDeleteStudent}
      />
    </div>
  );
}
