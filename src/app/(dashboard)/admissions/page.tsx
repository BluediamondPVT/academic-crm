'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Loader2,
  User,
  Phone,
  Building,
  Eye,
  Search,
  Award,
  Edit,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  CalendarRange,
  X
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { StudentRecord } from '../counselor/leads/types';

export default function ConfirmedAdmissionsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roleCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userRole='))
      ?.split('=')[1];
    setIsAdmin(roleCookie === 'ADMIN' || roleCookie === 'ACADEMIC');
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
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        // Filter for strictly 'Admission' status and sort by updatedAt descending (latest first)
        const admissions = (Array.isArray(data) ? data : [])
          .filter((s: StudentRecord) => s.status === 'Admission')
          .sort((a: StudentRecord, b: StudentRecord) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()
          );
        setStudents(admissions);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };
  // Unique list of universities and counselors for filter dropdowns
  const availableUniversities = Array.from(
    new Set(students.map((s) => s.universityName).filter(Boolean))
  ).sort();

  const availableCounselors = Array.from(
    new Set(students.map((s) => s.counselorName).filter(Boolean) as string[])
  ).sort();

  const availableSessions = Array.from(
    new Set(students.map((s) => s.session).filter(Boolean) as string[])
  ).sort();

  // Filter students based on search term, university, counselor, session, due date, and date range
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.counselorName &&
        student.counselorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesUniversity =
      selectedUniversity === 'all' || student.universityName === selectedUniversity;

    const matchesCounselor =
      selectedCounselor === 'all' || student.counselorName === selectedCounselor;

    const matchesSession =
      !sessionFilter ||
      sessionFilter === 'all' ||
      sessionFilter === 'All Sessions' ||
      student.session === sessionFilter ||
      (student.session && student.session.toLowerCase().includes(sessionFilter.toLowerCase()));

    let matchesDueDate = true;
    if (dueDateFilter && dueDateFilter !== 'All Due Status') {
      const nextDue = student.nextDueDate || (student.payments && student.payments.length > 0 ? student.payments[student.payments.length - 1]?.nextDueDate : undefined);
      if (!nextDue) {
        matchesDueDate = dueDateFilter === 'Safe / Paid';
      } else {
        const dueDate = new Date(nextDue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dueDateFilter === 'Overdue (Red)') {
          matchesDueDate = diffDays <= 0;
        } else if (dueDateFilter === 'Upcoming 30 Days (Yellow)') {
          matchesDueDate = diffDays > 0 && diffDays <= 30;
        } else if (dueDateFilter === 'Safe / Paid') {
          matchesDueDate = diffDays > 30;
        }
      }
    }

    let matchesDateRange = true;
    if (startDate || endDate) {
      const studentDateStr = student.createdAt || (student.payments && student.payments[0]?.date);
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

    return matchesSearch && matchesUniversity && matchesCounselor && matchesSession && matchesDueDate && matchesDateRange;
  });

  // Export Data Preparation
  const prepareExportData = () => {
    return filteredStudents.map((student, index) => {
      const otherAmt = (student.payments && student.payments.length > 0)
        ? student.payments.reduce((acc: number, p: any) => acc + (Number(p.otherAmount) || 0), 0)
        : (student.otherAmount || 0);
      const totalPaidDisplay = (Number(student.totalPaid) || 0) + otherAmt;
      const paymentsProfit = (student.payments && student.payments.length > 0)
        ? student.payments.reduce((acc: number, p: any) => acc + ((p.profit !== undefined && p.profit > 0) ? Number(p.profit) : Math.round(((Number(p.amount) || 0) * (Number(student.payoutPercentage) || 0)) / 100)), 0)
        : 0;
      const profit = paymentsProfit > 0
        ? paymentsProfit
        : (student.profit !== undefined && student.profit > 0 ? student.profit : Math.round(((student.totalPaid || 0) * (student.payoutPercentage || 0)) / 100));
      const paymentsUniv = (student.payments && student.payments.length > 0)
        ? student.payments.reduce((acc: number, p: any) => acc + (Number(p.paidToUniversity) || 0), 0)
        : 0;
      const univAmt = paymentsUniv > 0
        ? paymentsUniv
        : (student.paidToUniversity !== undefined && student.paidToUniversity > 0 ? student.paidToUniversity : Math.max(0, totalPaidDisplay - profit));
      const restFee = (student.payments && student.payments.length > 0 && (student.totalFee || 0) > 0)
        ? Math.max(0, (student.totalFee || 0) - totalPaidDisplay)
        : (student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - (student.totalPaid || 0)));

      const nextDue = student.nextDueDate || (student.payments && student.payments.length > 0 ? student.payments[student.payments.length - 1]?.nextDueDate : undefined);

      const admissionDate = student.createdAt 
        ? new Date(student.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : (student.payments && student.payments[0]?.date ? student.payments[0].date : 'N/A');

      const entryBy = ((student as any).counselorRole === 'ACADEMIC' || student.counselorName?.toLowerCase() === 'fardeen')
        ? 'Fardeen (Academic)'
        : (!student.counselorName || student.counselorName.toLowerCase() === 'admin')
        ? 'Super Admin'
        : student.counselorName;

      const record: Record<string, any> = {
        'Sr No': index + 1,
        'Admission Date': admissionDate,
        'Student Name': student.name,
        'Contact No': student.phoneNumber,
        'Email': student.email || '',
        'City': student.city || '',
        'Course': student.courseName,
        'Specialization': student.specialization || '',
        'University': student.universityName,
        'Session': student.session || '',
        'Total Course Fee (Rs)': student.totalFee || 0,
        'Amount Paid (Rs)': totalPaidDisplay,
        'Balance Due (Rs)': restFee,
      };

      if (isAdmin) {
        record['Our Profit (Rs)'] = profit;
        record['Univ Share (Rs)'] = univAmt;
        record['Entry By'] = entryBy;
      }

      record['Next Due Date'] = nextDue ? formatDueDate(nextDue) : 'N/A';
      record['Admission Remarks / LMS Notes'] = student.admissionRemark || student.remark || '';
      record['Status'] = student.status;

      return record;
    });
  };

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      alert('No records to export matching your current filters.');
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
    XLSX.utils.book_append_sheet(wb, ws, 'Confirmed Admissions');
    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Confirmed_Admissions_${today}.xlsx`);
    setShowDownloadMenu(false);
  };

  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      alert('No records to export matching your current filters.');
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
    link.setAttribute('download', `Confirmed_Admissions_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadMenu(false);
  };

  // Calculate total fee of all admissions
  const totalRevenue = students.reduce((acc, curr) => acc + (curr.totalFee || 0), 0);

  // Helper function to calculate due date alert highlight style
  const getDueDateRowClass = (dueDateStr?: string) => {
    if (!dueDateStr) return '';

    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      // Date is passed or today (0 or negative days left)
      return 'bg-red-50/80 hover:bg-red-100';
    } else if (diffDays <= 30) {
      // Date is within the next 30 days
      return 'bg-amber-50/80 hover:bg-amber-100';
    }

    return '';
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 font-sans  text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 animate-pulse" />
            Confirmed Admissions Portal
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Manage, review, and track students who have successfully secured their university admissions
          </p>
        </div>
      </div>



      {/* Search & Filter bar */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl border border-gray-150/70 p-4 flex flex-col gap-3 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto flex-1 items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, course..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
              />
            </div>

            {/* University Filter Dropdown */}
            <div className="relative w-full sm:w-48">
              <Building className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full pl-9 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="all">All Universities</option>
                {availableUniversities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
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

            {/* Session Filter Dropdown */}
            <div className="relative w-full sm:w-36">
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="all">All Sessions</option>
                {availableSessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Due Date Filter Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
              >
                <option value="">All Due Status</option>
                <option value="Overdue (Red)">Overdue (Red)</option>
                <option value="Upcoming 30 Days (Yellow)">Upcoming 30 Days (Yellow)</option>
                <option value="Safe / Paid">Safe / Paid</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range Filter (From Date - To Date) */}
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
                  title="Clear Date Range"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Records Count Pill & Export Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end">
            <div className="text-xs font-bold text-slate-500 bg-white border border-gray-200 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <span>Displaying:</span>
              <span className="text-emerald-600 font-extrabold">{filteredStudents.length}</span>
              <span className="text-gray-400 font-normal">/ {students.length}</span>
            </div>

            {/* Download / Export Menu */}
            <div className="relative" ref={downloadMenuRef}>
              <button
                type="button"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
                title="Download Filtered Records"
              >
                <Download className="h-4 w-4" />
                <span>Export ({filteredStudents.length})</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-150 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">Export Filtered Admissions</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {filteredStudents.length} of {students.length} student{students.length === 1 ? '' : 's'} matching active filters
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-200 group-hover:scale-105 transition-all">
                        <FileSpreadsheet className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-emerald-800">Excel Workbook (.xlsx)</div>
                        <div className="text-[10px] text-gray-400 font-normal">Direct native Excel file download</div>
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
                        <div className="font-bold text-gray-900 group-hover:text-blue-800">CSV File (.csv)</div>
                        <div className="text-[10px] text-gray-400 font-normal">Universal comma-separated format</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Name</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Contact</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Course &amp; Univ</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Due Date</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Total Fee</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Paid</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Rest</th>
                {isAdmin && (
                  <>
                    <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Profit</th>
                    <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Univ Amt</th>
                    <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Entry By</th>
                  </>
                )}
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Notes</th>
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 15 : 12} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading admissions database...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 15 : 12} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto py-4">
                      <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-semibold text-gray-600">No confirmed admissions</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Any leads marked as &quot;Admission&quot; will automatically sync and populate here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const otherAmt = (student.payments && student.payments.length > 0)
                    ? student.payments.reduce((acc: number, p: any) => acc + (Number(p.otherAmount) || 0), 0)
                    : (student.otherAmount || 0);
                  const totalPaidDisplay = (Number(student.totalPaid) || 0) + otherAmt;
                  const paymentsProfit = (student.payments && student.payments.length > 0)
                    ? student.payments.reduce((acc: number, p: any) => acc + ((p.profit !== undefined && p.profit > 0) ? Number(p.profit) : Math.round(((Number(p.amount) || 0) * (Number(student.payoutPercentage) || 0)) / 100)), 0)
                    : 0;
                  const profit = paymentsProfit > 0
                    ? paymentsProfit
                    : (student.profit !== undefined && student.profit > 0 ? student.profit : Math.round(((student.totalPaid || 0) * (student.payoutPercentage || 0)) / 100));
                  const paymentsUniv = (student.payments && student.payments.length > 0)
                    ? student.payments.reduce((acc: number, p: any) => acc + (Number(p.paidToUniversity) || 0), 0)
                    : 0;
                  const univAmt = paymentsUniv > 0
                    ? paymentsUniv
                    : (student.paidToUniversity !== undefined && student.paidToUniversity > 0 ? student.paidToUniversity : Math.max(0, totalPaidDisplay - profit));
                  const restFee = (student.payments && student.payments.length > 0 && (student.totalFee || 0) > 0)
                    ? Math.max(0, (student.totalFee || 0) - totalPaidDisplay)
                    : (student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - (student.totalPaid || 0)));
                  const isPaidInFull = restFee === 0 && (student.totalFee || 0) > 0;

                  const nextDue = student.nextDueDate || (student.payments && student.payments.length > 0 ? student.payments[student.payments.length - 1]?.nextDueDate : undefined);
                  const dueDateClass = getDueDateRowClass(nextDue);
                  const rowBgClass = dueDateClass || (isPaidInFull ? 'bg-emerald-50/60 hover:bg-emerald-100/60' : 'hover:bg-gray-50/50');

                  return (
                    <tr key={student._id} className={`${rowBgClass} transition-colors`}>
                      <td className="px-2 py-3 text-xs text-gray-500 font-semibold">{index + 1}</td>
                      <td className="px-2 py-3">
                        <div className="text-[11px] font-bold text-[#112a46]">{student.name}</div>
                        {student.email && (
                          <div className="text-[9px] text-gray-400 font-medium truncate mt-0.5 max-w-[120px]">
                            {student.email}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <div className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <Phone className="h-3 w-3 text-gray-500" />
                          {student.phoneNumber}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-[11px] font-bold text-[#112a46]">{student.courseName}</div>
                        <div className="text-[9px] text-indigo-600 font-bold uppercase mt-0.5">
                          {student.universityName}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        {(() => {
                          if (isPaidInFull) {
                            return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60 whitespace-nowrap">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                Paid Full
                              </span>
                            );
                          }

                          if (!nextDue) {
                            return <span className="text-gray-400 text-[10px] font-medium italic">No Due</span>;
                          }

                          const d = new Date(nextDue);
                          if (isNaN(d.getTime())) {
                            return <span className="text-gray-400 text-[10px] font-medium">-</span>;
                          }

                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const targetDate = new Date(d);
                          targetDate.setHours(0, 0, 0, 0);
                          const diffTime = targetDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                          const formattedDate = d.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          });

                          if (diffDays <= 0) {
                            return (
                              <div className="inline-flex flex-col">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 whitespace-nowrap">
                                  <Calendar className="h-3 w-3 text-rose-600 shrink-0" />
                                  {formattedDate}
                                </span>
                                <span className="text-[8px] font-black text-rose-600 uppercase tracking-tight mt-0.5">
                                  {diffDays === 0 ? 'Due Today' : `Overdue (${Math.abs(diffDays)}d)`}
                                </span>
                              </div>
                            );
                          } else if (diffDays <= 30) {
                            return (
                              <div className="inline-flex flex-col">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                                  <Calendar className="h-3 w-3 text-amber-600 shrink-0" />
                                  {formattedDate}
                                </span>
                                <span className="text-[8px] font-bold text-amber-600 mt-0.5">
                                  Due in {diffDays}d
                                </span>
                              </div>
                            );
                          }

                          return (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
                              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                              {formattedDate}
                            </span>
                          );
                        })()}
                      </td>

                      <td className="px-2 py-3">
                        <div className="text-[11px] font-bold text-slate-700">
                          ₹{(student.totalFee || 0).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-[11px] font-bold text-emerald-600">
                          ₹{totalPaidDisplay.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <div className="text-[11px] font-bold text-rose-600">
                          ₹{(student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - (student.totalPaid || 0))).toLocaleString('en-IN')}
                        </div>
                      </td>

                      {isAdmin && (
                        <>
                          <td className="px-2 py-3">
                            <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block whitespace-nowrap">
                              ₹{profit.toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block whitespace-nowrap">
                              ₹{univAmt.toLocaleString('en-IN')}
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            {((student as any).counselorRole === 'ACADEMIC' || student.counselorName?.toLowerCase() === 'fardeen') ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                                  Academic
                                </span>
                                <span className="text-[10px] font-bold text-gray-700">Fardeen</span>
                              </div>
                            ) : (!student.counselorName || student.counselorName.toLowerCase() === 'admin') ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                                  Admin
                                </span>
                                <span className="text-[10px] font-bold text-gray-700">Super Admin</span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                                  Counselor
                                </span>
                                <span className="text-[10px] font-bold text-[#112a46]">
                                  {student.counselorName}
                                </span>
                              </div>
                            )}
                          </td>
                        </>
                      )}

                      <td className="px-2 py-3">
                        <div className="flex flex-col gap-1 min-w-[100px] max-w-[200px]">
                          {student.admissionRemarkUpdatedAt && student.admissionRemark && (
                            <span className="text-[9px] font-semibold text-gray-400">
                              {new Date(student.admissionRemarkUpdatedAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          {student.admissionRemark ? (
                            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded-lg wrap-break-word">
                              {student.admissionRemark}
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No remark</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/counselor/leads/view/${student._id}?from=admissions`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Profile Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/counselor/leads/edit/${student._id}?from=admissions`}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit Profile"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
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
