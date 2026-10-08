'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  Laptop,
  Phone,
  MapPin,
  Search,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  CalendarRange,
  X,
  User,
  Sparkles,
  DollarSign,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { InstituteRecord } from '../counselor/leads/types';
import { INSTITUTE_BRANCHES, INSTITUTE_COURSES } from '../counselor/leads/constants';

export default function InstituteAdmissionsPage() {
  const [students, setStudents] = useState<InstituteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // ⚙️ Toggles (Stats Matrix and Actions hidden as per user request, easily re-enabled when needed)
  const SHOW_STATS_MATRIX = false;
  const SHOW_ACTIONS = false;

  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/institute/students');
      if (res.ok) {
        const data = await res.json();
        // Filter strictly for 'Admission' or 'Enrolled' status
        const admissions = (Array.isArray(data) ? data : [])
          .filter(
            (s: InstituteRecord) =>
              s.status === 'Admission' ||
              s.status?.toLowerCase() === 'admission' ||
              s.status === 'Enrolled'
          )
          .sort(
            (a: InstituteRecord, b: InstituteRecord) =>
              new Date(b.updatedAt || b.createdAt || 0).getTime() -
              new Date(a.updatedAt || a.createdAt || 0).getTime()
          );
        setStudents(admissions);
      }
    } catch (err) {
      console.error('Error fetching institute admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Distinct courses & counselors for filters
  const availableCourses = Array.from(
    new Set([
      ...INSTITUTE_COURSES,
      ...students.map(s => s.course).filter(Boolean)
    ])
  ).sort();

  const availableCounselors = Array.from(
    new Set(students.map(s => s.counselorName).filter(Boolean) as string[])
  ).sort();

  // Filter students based on active controls
  const filteredStudents = students.filter(student => {
    const fullName = [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      student.mobile.includes(searchTerm) ||
      (student.alternateMobile && student.alternateMobile.includes(searchTerm)) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.branch && student.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.institutionName && student.institutionName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.parentName && student.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.counselorName && student.counselorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch =
      selectedBranch === 'all' || student.branch === selectedBranch;

    const matchesCourse =
      selectedCourse === 'all' || student.course === selectedCourse;

    const matchesCounselor =
      selectedCounselor === 'all' || student.counselorName === selectedCounselor;

    // Date Range Filter
    let matchesDateRange = true;
    if (startDate || endDate) {
      const studentDateStr = student.createdAt || student.updatedAt;
      if (studentDateStr) {
        const studentDate = new Date(studentDateStr);
        if (!isNaN(studentDate.getTime())) {
          if (startDate) {
            const fromDate = new Date(startDate);
            fromDate.setHours(0, 0, 0, 0);
            if (studentDate < fromDate) {
              matchesDateRange = false;
            }
          }
          if (endDate && matchesDateRange) {
            const toDate = new Date(endDate);
            toDate.setHours(23, 59, 59, 999);
            if (studentDate > toDate) {
              matchesDateRange = false;
            }
          }
        }
      }
    }

    return (
      matchesSearch &&
      matchesBranch &&
      matchesCourse &&
      matchesCounselor &&
      matchesDateRange
    );
  });

  // Aggregates for Stats Matrix (preserved for when user wants to re-enable)
  const totalAdmissionsCount = students.length;
  const mumbraAdmissions = students.filter(s => s.branch === 'Mumbra Branch').length;
  const bhiwandiAdmissions = students.filter(s => s.branch === 'Bhiwandi Branch').length;
  const andheriAdmissions = students.filter(s => s.branch === 'Andheri Branch').length;
  const totalCourseFees = students.reduce((acc, curr) => acc + (Number(curr.courseFee) || 0), 0);
  const totalPaidAmount = students.reduce((acc, curr) => acc + (Number(curr.paidAmount) || 0), 0);
  const totalPendingBalance = students.reduce((acc, curr) => {
    const fee = Number(curr.courseFee) || 0;
    const paid = Number(curr.paidAmount) || 0;
    const rem = curr.remainingAmount !== undefined ? Number(curr.remainingAmount) : Math.max(0, fee - paid);
    return acc + rem;
  }, 0);

  // Prepare Export Data
  const prepareExportData = () => {
    return filteredStudents.map((student, index) => {
      const fullName = [student.firstName, student.middleName, student.lastName]
        .filter(Boolean)
        .join(' ');

      const admissionDate = student.createdAt
        ? new Date(student.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'N/A';

      const latestHistory =
        student.remarkHistory && student.remarkHistory.length > 0
          ? student.remarkHistory[student.remarkHistory.length - 1]
          : null;
      const latestRemark = latestHistory?.remark || student.remark || '';

      const record: Record<string, any> = {
        'Sr No': index + 1,
        'Admission Date': admissionDate,
        'Student Name': fullName,
        'Gender': student.gender || '',
        'Contact No': student.mobile,
        'Alt Mobile': student.alternateMobile || '',
        'Parent Name': student.parentName || '',
        'Parent Email': student.parentEmail || '',
        'Enrolled Technical Course': student.course,
        'Branch': student.branch || '',
        'Qualification': student.qualification || '',
        'College / Institution': student.institutionName || '',
        'City': student.city || '',
        'Enquiry Source': student.enquiredFrom || '',
        'Counselor / Entry By': student.counselorName || 'Super Admin',
        'Latest Remark': latestRemark,
        'Status': student.status,
      };

      return record;
    });
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      alert('No institute admission records to export matching your current filters.');
      return;
    }
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-fit column widths
    const colWidths = Object.keys(data[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...data.map((row) => (row[key] !== undefined ? String(row[key]).length : 0))
      );
      return { wch: Math.min(Math.max(maxLen + 3, 12), 40) };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Institute Admissions');
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `BDIT_Institute_Admissions_${today}.xlsx`);
    setShowDownloadMenu(false);
  };

  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      alert('No institute admission records to export matching your current filters.');
      return;
    }
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `BDIT_Institute_Admissions_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  const getBranchBadgeStyle = (branchName?: string) => {
    switch (branchName) {
      case 'Mumbra Branch':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Bhiwandi Branch':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Andheri Branch':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            BDIT Institute Confirmed Admissions
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Manage, review, and track students who have confirmed admissions for technical courses across all BDIT branches
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/counselor/leads/create?track=institute"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#112a46] hover:bg-[#1a3a60] text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-[#112a46]/20"
          >
            <Laptop className="h-4 w-4" />
            + New Institute Enquiry
          </Link>
        </div>
      </div>

      {/* 📊 Top Stats Matrix (Hidden as per user request; set SHOW_STATS_MATRIX = true to restore) */}
      {SHOW_STATS_MATRIX && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Admissions
              </span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#112a46] tracking-tight">
              {totalAdmissionsCount}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3" /> Confirmed Enrolled
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Mumbra Branch
              </span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-indigo-700 tracking-tight">
              {mumbraAdmissions}
            </div>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5 block">
              Admissions
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Bhiwandi Branch
              </span>
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-teal-700 tracking-tight">
              {bhiwandiAdmissions}
            </div>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5 block">
              Admissions
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Andheri Branch
              </span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-amber-700 tracking-tight">
              {andheriAdmissions}
            </div>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5 block">
              Admissions
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Course Fees
              </span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg font-black text-slate-800 tracking-tight truncate">
              ₹{totalCourseFees.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5 block">
              Enrolled Value
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Fees Collected
              </span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg font-black text-emerald-600 tracking-tight truncate">
              ₹{totalPaidAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 mt-0.5 block">
              Received
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-150/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Pending Balance
              </span>
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-lg font-black text-rose-600 tracking-tight truncate">
              ₹{totalPendingBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] font-semibold text-rose-500 mt-0.5 block">
              Receivable
            </span>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-150/80 p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto flex-1 items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, mobile, course..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
              />
            </div>

            {/* Branch Filter Dropdown */}
            <div className="relative w-full sm:w-44">
              <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full pl-9 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="all">All Branches</option>
                {INSTITUTE_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Course Filter Dropdown */}
            <div className="relative w-full sm:w-52">
              <Laptop className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-9 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="all">All Technical Courses</option>
                {availableCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Counselor Filter Dropdown */}
            <div className="relative w-full sm:w-40">
              <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full pl-9 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="all">All Counselors</option>
                {availableCounselors.map((counselor) => (
                  <option key={counselor} value={counselor}>
                    {counselor}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs text-xs text-gray-600">
              <CalendarRange className="h-4 w-4 text-emerald-600 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-gray-700 text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>
              <span className="text-gray-300 font-light mx-0.5">→</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-gray-700 text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="ml-1 text-gray-400 hover:text-rose-600 transition-colors p-0.5 rounded-full hover:bg-rose-50"
                  title="Clear Dates"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action: Export Menu */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
            <div className="relative" ref={downloadMenuRef}>
              <button
                type="button"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <Download className="h-4 w-4 text-emerald-600" />
                <span>Export ({filteredStudents.length})</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Download Options
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {filteredStudents.length} Admission Records
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-200 group-hover:scale-105 transition-all">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-emerald-800">
                        Excel Spreadsheet (.xlsx)
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        Direct native Excel download
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-800 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-200 group-hover:scale-105 transition-all">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-blue-800">
                        CSV File (.csv)
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        Universal comma-separated format
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Table (Customized for BDIT Institute) */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  #
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Student Name
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Contact &amp; Details
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Enrolled Course
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Branch
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  City / College
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Source
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Admission Date
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Counselor
                </th>
                <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Remarks / Notes
                </th>
                {SHOW_ACTIONS && (
                  <th className="px-3.5 py-3.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={SHOW_ACTIONS ? 11 : 10} className="px-6 py-16 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading confirmed institute admissions...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={SHOW_ACTIONS ? 11 : 10} className="px-6 py-16 text-center text-gray-500">
                    <div className="max-w-sm mx-auto py-4">
                      <Laptop className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">No confirmed institute admissions</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Any BDIT institute student enquiry marked as &quot;Admission&quot; will automatically sync and populate here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const fullName = [student.firstName, student.middleName, student.lastName]
                    .filter(Boolean)
                    .join(' ');
                  const recordId = student._id || student.id || `inst-${index}`;

                  const admissionDateFormatted = student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  const latestHistory =
                    student.remarkHistory && student.remarkHistory.length > 0
                      ? student.remarkHistory[student.remarkHistory.length - 1]
                      : null;
                  const latestRemark = latestHistory?.remark || student.remark;
                  const latestDate = latestHistory?.updatedAt || student.remarkUpdatedAt;
                  const updatedBy = latestHistory?.updatedBy || student.counselorName;

                  return (
                    <tr
                      key={recordId}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Sr No */}
                      <td className="px-3.5 py-3.5 text-xs text-gray-400 font-semibold">
                        {index + 1}
                      </td>

                      {/* Student Name */}
                      <td className="px-3.5 py-3.5">
                        <div className="text-[12px] font-bold text-[#112a46]">
                          {fullName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                          {student.gender && (
                            <span className="text-gray-400 font-medium">
                              ({student.gender})
                            </span>
                          )}
                          {student.qualification && (
                            <span className="text-slate-500 font-semibold truncate max-w-[120px]">
                              {student.qualification}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-3.5 py-3.5">
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <Phone className="h-3 w-3 text-indigo-500" />
                          {student.mobile}
                        </div>
                        {student.alternateMobile && (
                          <div className="text-[9px] text-gray-400 mt-0.5">
                            Alt: {student.alternateMobile}
                          </div>
                        )}
                        {student.parentName && (
                          <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[140px]">
                            Parent: <span className="font-semibold text-gray-700">{student.parentName}</span>
                          </div>
                        )}
                      </td>

                      {/* Enrolled Technical Course */}
                      <td className="px-3.5 py-3.5">
                        <div className="text-[11px] font-bold text-[#112a46] truncate max-w-[180px]">
                          {student.course}
                        </div>
                        <span className="inline-block text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5 border border-indigo-100">
                          BDIT Tech
                        </span>
                      </td>

                      {/* Branch Badge */}
                      <td className="px-3.5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getBranchBadgeStyle(
                            student.branch
                          )}`}
                        >
                          {student.branch || 'Main Center'}
                        </span>
                      </td>

                      {/* City / College */}
                      <td className="px-3.5 py-3.5">
                        <div className="text-[11px] font-medium text-gray-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                          <span>{student.city || '—'}</span>
                        </div>
                        {student.institutionName && (
                          <div className="text-[10px] text-gray-400 truncate max-w-[130px] mt-0.5">
                            {student.institutionName}
                          </div>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-3.5 py-3.5">
                        <span className="text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap">
                          {student.enquiredFrom || 'Walk-in'}
                        </span>
                      </td>

                      {/* Admission Date */}
                      <td className="px-3.5 py-3.5">
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                          {admissionDateFormatted}
                        </div>
                      </td>

                      {/* Counselor / Entry By */}
                      <td className="px-3.5 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                            Counselor
                          </span>
                          <span className="text-[11px] font-bold text-[#112a46] whitespace-nowrap">
                            {student.counselorName || 'Super Admin'}
                          </span>
                        </div>
                      </td>

                      {/* Remarks / Notes */}
                      <td className="px-3.5 py-3.5">
                        <div className="flex flex-col gap-0.5 min-w-[140px] max-w-[240px]">
                          {latestDate && (
                            <span className="text-[9px] font-semibold text-gray-400">
                              {updatedBy ? `${updatedBy} • ` : ''}
                              {new Date(latestDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          )}
                          {latestRemark ? (
                            <div
                              title={latestRemark}
                              className="text-[10px] font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded-lg truncate max-w-full"
                            >
                              {latestRemark}
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No remark</span>
                          )}
                        </div>
                      </td>

                      {/* Actions (Hidden as requested) */}
                      {SHOW_ACTIONS && (
                        <td className="px-3.5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/counselor/leads/view/${recordId}?track=institute&from=institutes`}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Student Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/counselor/leads/edit/${recordId}?track=institute&from=institutes`}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit Student Profile"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
