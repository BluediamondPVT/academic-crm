'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { StudentRecord } from '../counselor/leads/types';

export default function ConfirmedAdmissionsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const roleCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userRole='))
      ?.split('=')[1];
    setIsAdmin(roleCookie === 'ADMIN');
    fetchAdmissions();
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

  // Filter students based on search term, university, and counselor
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.counselorName &&
        student.counselorName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesUniversity =
      selectedUniversity === 'all' || student.universityName === selectedUniversity;

    const matchesCounselor =
      selectedCounselor === 'all' || student.counselorName === selectedCounselor;

    return matchesSearch && matchesUniversity && matchesCounselor;
  });

  // Calculate total fee of all admissions
  const totalRevenue = students.reduce((acc, curr) => acc + (curr.totalFee || 0), 0);

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
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-100/60 p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto flex-1 items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, course, university..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
            />
          </div>

          {/* University Filter Dropdown */}
          <div className="relative w-full sm:w-52">
            <Building className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
            >
              <option value="all">All Universities</option>
              {availableUniversities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Counselor Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white appearance-none cursor-pointer text-gray-700"
            >
              <option value="all">All Counselors</option>
              {availableCounselors.map((counselor) => (
                <option key={counselor} value={counselor}>
                  {counselor}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-white border border-gray-150 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs shrink-0 w-full md:w-auto justify-center">
          <span>Displaying Confirmed:</span>
          <span className="text-emerald-600 font-extrabold">{filteredStudents.length} Records</span>
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
                <th className="px-2 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">City</th>
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
                  <td colSpan={isAdmin ? 13 : 10} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading admissions database...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 13 : 10} className="px-6 py-12 text-center text-gray-500">
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
                  const profit = Math.round(((student.totalPaid || 0) * (student.payoutPercentage || 0)) / 100);
                  const univAmt = Math.max(0, (student.totalPaid || 0) - profit);
                  const restFee = student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - (student.totalPaid || 0));
                  const isPaidInFull = restFee === 0 && (student.totalFee || 0) > 0;

                  return (
                  <tr key={student._id} className={`${isPaidInFull ? 'bg-emerald-50/60 hover:bg-emerald-100/60' : 'hover:bg-gray-50/50'} transition-colors`}>
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
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                        <Building className="h-3 w-3 text-indigo-600" />
                        {student.city}
                      </div>
                    </td>
                    
                    <td className="px-2 py-3">
                      <div className="text-[11px] font-bold text-slate-700">
                        ₹{(student.totalFee || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-[11px] font-bold text-emerald-600">
                        ₹{(student.totalPaid || 0).toLocaleString('en-IN')}
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
                          {(!student.counselorName || student.counselorName.toLowerCase() === 'admin') ? (
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
