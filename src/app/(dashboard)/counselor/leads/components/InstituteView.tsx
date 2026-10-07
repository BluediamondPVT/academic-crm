'use client';

import React from 'react';
import { Laptop } from 'lucide-react';
import { InstituteRecord } from '../types';
import InstituteStats from './InstituteStats';
import InstituteFilters from './InstituteFilters';
import InstituteTable from './InstituteTable';

interface InstituteViewProps {
  records: InstituteRecord[];
  filteredRecords: InstituteRecord[];
  loading: boolean;
  isAdmin?: boolean;
  activeStatus: string;
  onStatusClick: (statusName: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterBranch: string;
  onFilterBranchChange: (value: string) => void;
  branches: string[];
  filterCourse: string;
  onFilterCourseChange: (value: string) => void;
  filterSource: string;
  onFilterSourceChange: (value: string) => void;
  courses: string[];
  onSelectRecord?: (record: InstituteRecord) => void;
  onEditRecord?: (record: InstituteRecord) => void;
  onDeleteRecord: (record: InstituteRecord) => void;
  onUpdateStatus?: (recordId: string, newStatus: string) => Promise<void>;
}

export default function InstituteView({
  records,
  filteredRecords,
  loading,
  isAdmin,
  activeStatus,
  onStatusClick,
  searchTerm,
  onSearchChange,
  filterBranch,
  onFilterBranchChange,
  branches,
  filterCourse,
  onFilterCourseChange,
  filterSource,
  onFilterSourceChange,
  courses,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
  onUpdateStatus,
}: InstituteViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight flex items-center gap-2">
          <Laptop className="h-5 w-5 text-indigo-600" />
          BDIT Institute Management
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 font-medium">
          Manage student admissions, course batches, and training enquiries
        </p>
      </div>

      {/* BDIT Institute Dedicated Stats Matrix */}
      <InstituteStats
        records={records}
        activeStatus={activeStatus}
        onStatusClick={onStatusClick}
      />

      {/* BDIT Institute Filters */}
      <InstituteFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterBranch={filterBranch}
        onFilterBranchChange={onFilterBranchChange}
        branches={branches}
        filterCourse={filterCourse}
        onFilterCourseChange={onFilterCourseChange}
        filterSource={filterSource}
        onFilterSourceChange={onFilterSourceChange}
        courses={courses}
      />

      {/* BDIT Institute Enquiries Table */}
      <InstituteTable
        records={filteredRecords}
        loading={loading}
        isAdmin={isAdmin}
        onSelectRecord={onSelectRecord}
        onEditRecord={onEditRecord}
        onDeleteRecord={onDeleteRecord}
      />
    </div>
  );
}
