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
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { StudentRecord } from '../counselor/leads/types';

export default function ConfirmedAdmissionsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
        // Filter for strictly 'Admission' status
        const admissions = (Array.isArray(data) ? data : []).filter(
          (s: StudentRecord) => s.status === 'Admission'
        );
        setStudents(admissions);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-gray-100/60 p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, course, university..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 bg-white border border-gray-150 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
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
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Name</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Contact Details</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">University &amp; Course</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">City</th>
                {isAdmin && (
                  <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Entry By / Role</th>
                )}
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Remark / Notes</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading admissions database...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-gray-500">
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
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-500 font-semibold">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-bold text-[#112a46]">{student.name}</div>
                      {student.email && (
                        <div className="text-[10px] text-gray-400 font-medium truncate mt-0.5 max-w-[150px]">
                          {student.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        {student.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-bold text-[#112a46]">{student.courseName}</div>
                      <div className="text-[10px] text-indigo-600 font-bold uppercase mt-0.5">
                        {student.universityName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        <Building className="h-3.5 w-3.5 text-indigo-600" />
                        {student.city}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-4">
                        {(!student.counselorName || student.counselorName.toLowerCase() === 'admin') ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 w-max px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                              Admin
                            </span>
                            <span className="text-xs font-bold text-gray-700">Super Admin</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 w-max px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                              Counselor
                            </span>
                            <span className="text-xs font-bold text-[#112a46]">
                              {student.counselorName}
                            </span>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 min-w-[150px] max-w-[300px]">
                        {student.admissionRemarkUpdatedAt && student.admissionRemark && (
                          <span className="text-[10px] font-semibold text-gray-400">
                            {new Date(student.admissionRemarkUpdatedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short', 
                              year: 'numeric',
                            })}{' '}
                            {new Date(student.admissionRemarkUpdatedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                        {student.admissionRemark ? (
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg wrap-break-word">
                            {student.admissionRemark}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No remark</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/counselor/leads/view/${student._id}?from=admissions`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Profile Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/counselor/leads/edit/${student._id}?from=admissions`}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit Profile"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
