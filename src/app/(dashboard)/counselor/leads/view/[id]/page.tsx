'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Phone, Building, Mail, MapPin, Calendar, MessageSquare, ArrowLeft, Loader2, Edit3, Clock, CreditCard, Receipt } from 'lucide-react';
import { StudentRecord } from '../../types';

interface ViewLeadPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewLeadPage({ params }: ViewLeadPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAdmissions = searchParams.get('from') === 'admissions';
  const [studentId, setStudentId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then(res => {
      setStudentId(res.id);
    });
  }, [params]);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      } else {
        setError('Failed to fetch student record details.');
      }
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('An error occurred while loading student details.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const isAdmin = document.cookie.includes('userRole=ADMIN');
    router.push(fromAdmissions ? '/admissions' : (isAdmin ? '/admin/students' : '/counselor/leads'));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">Loading lead details...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="p-3 bg-red-50 text-red-500 rounded-full">
          <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={goBack} />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Failed to load lead</p>
          <p className="text-sm text-gray-500 mt-1">{error || 'Student record not found.'}</p>
        </div>
        <button
          onClick={goBack}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
        >
          Go Back to Leads
        </button>
      </div>
    );
  }

  const displayStatus = (student.status === 'Admission' && !fromAdmissions)
    ? (student.preAdmissionStatus || 'Processing')
    : (student.status || 'New Lead');

  const displayRemark = fromAdmissions
    ? (student.admissionRemark || '')
    : (student.preAdmissionRemark || student.remark || '');

  const filteredHistory = (student.remarkHistory || []).filter(hist => {
    if (fromAdmissions) {
      return hist.status === 'Admission';
    } else {
      return hist.status !== 'Admission';
    }
  });

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-white bg-white/60 border border-gray-100 rounded-xl transition-all shadow-xs"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight">
                Enquiry details of {student.name}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  displayStatus === 'Admission'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : displayStatus === 'Lost'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : displayStatus === 'Hold' || displayStatus === 'Follow-Up'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}
              >
                {displayStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Course allocation, fee structure, and counselor logs
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div>
          <button
            onClick={() => router.push(`/counselor/leads/edit/${student._id}${fromAdmissions ? '?from=admissions' : ''}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#112a46] hover:bg-[#1a3d66] active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Personal Info & Remarks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Student Name */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Student Name</span>
                  <span className="text-sm font-bold text-[#112a46]">{student.name}</span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-700">{student.phoneNumber}</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-semibold text-slate-700 block truncate">{student.email || 'N/A'}</span>
                </div>
              </div>

              {/* City */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">City</span>
                  <span className="text-sm font-semibold text-slate-700">{student.city}</span>
                </div>
              </div>

              {/* Enrollment Date */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Enrollment Date</span>
                  <span className="text-sm font-medium text-slate-700">
                    {student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Admission Status */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className={`p-2 rounded-lg ${
                  displayStatus === 'Admission'
                    ? 'bg-green-50 text-green-600'
                    : displayStatus === 'Lost'
                    ? 'bg-red-50 text-red-600'
                    : displayStatus === 'Hold' || displayStatus === 'Follow-Up'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Admission Status</span>
                  <span className="text-sm font-semibold text-slate-700">{displayStatus}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Remarks Section & History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                Counselor Remarks &amp; History
              </h3>
              {filteredHistory && filteredHistory.length > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold border border-slate-200/40">
                  {filteredHistory.length} entry{filteredHistory.length > 1 ? 'ies' : ''}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {filteredHistory && filteredHistory.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {[...filteredHistory].reverse().map((hist, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10">
                        <MessageSquare className="h-3 w-3 text-slate-500" />
                      </div>
                      <div className="space-y-1 w-full pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-semibold">
                            {new Date(hist.updatedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            {new Date(hist.updatedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {hist.status && (
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                              hist.status === 'Admission'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : hist.status === 'Lost'
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : hist.status === 'Hold' || hist.status === 'Follow-Up'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {hist.status}
                            </span>
                          )}
                          {idx === 0 && (
                            <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold border border-green-100">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-100 rounded-lg p-3 mt-1 shadow-2xs leading-relaxed whitespace-pre-wrap">
                          {hist.remark}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
                  <div className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {displayRemark ? (
                      displayRemark
                    ) : (
                      <span className="text-gray-400 italic">No remark provided yet.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Academic Details & Fee Structure */}
        <div className="space-y-6">

          {/* Allocated University & Course */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Building className="h-4 w-4 text-sky-500" />
              Academic Details
            </h3>
            
            <div className="bg-linear-to-br from-indigo-50/40 via-blue-50/30 to-sky-50/20 border border-indigo-100/60 rounded-xl p-4 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">University</span>
                <span className="text-sm font-black text-indigo-950 block mt-0.5">
                  {student.universityName}
                </span>
              </div>

              <div className="border-t border-indigo-100/50 pt-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">Course &amp; Specialization</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5">
                  {student.courseName}
                </span>
                {student.specialization && (
                  <span className="mt-1.5 inline-block text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-medium">
                    {student.specialization}
                  </span>
                )}
              </div>

              {student.duration && (
                <div className="border-t border-indigo-100/50 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Course Duration</span>
                  <span className="font-bold text-indigo-950 bg-white px-2 py-1 rounded border border-indigo-100/60 shadow-xxs">
                    {student.duration} Years
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fee Structure */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">₹</span>
              Fee Structure
            </h3>

            <div className="space-y-3">
              <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-4 hover:bg-emerald-50/40 transition-colors">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Total Course Fee</span>
                <span className="text-lg font-black text-emerald-950 mt-0.5 block">
                  {student.totalFee
                    ? `₹${student.totalFee.toLocaleString('en-IN')}`
                    : 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Yearly Fee</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                    {student.yearFee
                      ? `₹${student.yearFee.toLocaleString('en-IN')}`
                      : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Semester Fee</span>
                  <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                    {student.semesterFee
                      ? `₹${student.semesterFee.toLocaleString('en-IN')}`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Total Paid & Remaining Fee */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 hover:bg-emerald-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Total Paid</span>
                  <span className="text-sm font-black text-emerald-950 mt-0.5 block">
                    {student.totalPaid ? `₹${student.totalPaid.toLocaleString('en-IN')}` : '₹0'}
                  </span>
                </div>

                <div className="bg-rose-50/50 border border-rose-100/60 rounded-xl p-3 hover:bg-rose-50 transition-colors">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">Remaining Fee</span>
                  <span className="text-sm font-black text-rose-950 mt-0.5 block">
                    {student.remainingFee !== undefined ? `₹${student.remainingFee.toLocaleString('en-IN')}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Payment Mode & Next Due Date */}
              {student.payments && student.payments.length > 0 && (
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Payment Mode</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                      {student.payments[student.payments.length - 1].paymentMode || 'N/A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Next Due Date</span>
                    <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                      {student.payments[student.payments.length - 1].nextDueDate 
                        ? new Date(student.payments[student.payments.length - 1].nextDueDate!).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Payout & Profit */}
              {student.payoutPercentage !== undefined && student.payoutPercentage > 0 && (
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
                  <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-3 hover:bg-indigo-50 transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">Payout Ratio</span>
                    <span className="text-sm font-black text-indigo-950 mt-0.5 block">
                      {student.payoutPercentage}%
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white hover:bg-slate-800 transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">Our Profit</span>
                    <span className="text-sm font-black text-indigo-200 mt-0.5 block">
                      ₹{Math.round(((student.totalPaid || 0) * (student.payoutPercentage || 0)) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Payment & Installments History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-emerald-600" />
            Payment &amp; Installments History
          </span>
          {student.payments && student.payments.length > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              {student.payments.length} Logged
            </span>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.payments && student.payments.length > 0 ? (
            student.payments.map((pmt, idx) => {
              const cumulativePaid = student.payments!
                .slice(0, idx + 1)
                .reduce((acc, curr) => acc + (curr.amount || 0), 0);
              const totalCourseFee = Number(student.totalFee || 0);
              const balanceAfter = Math.max(0, totalCourseFee - cumulativePaid);

              return (
                <div key={idx} className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                          # {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {pmt.paymentType || 'Payment'} Plan
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {new Date(pmt.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}{' '}
                          {new Date(pmt.date).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium text-[10px] uppercase">Paid Amount</span>
                        <span className="text-sm font-black text-emerald-600 block mt-0.5">
                          ₹{pmt.amount ? pmt.amount.toLocaleString('en-IN') : '0'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium text-[10px] uppercase">Remaining Balance</span>
                        <span className="text-sm font-black text-rose-600 block mt-0.5">
                          ₹{balanceAfter.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium text-[10px] uppercase">Payment Mode</span>
                        <span className={`inline-block mt-0.5 font-bold text-[11px] px-2 py-0.5 rounded ${
                          pmt.paymentMode === 'UPI'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : pmt.paymentMode === 'Bank'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {pmt.paymentMode || 'UPI'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {pmt.nextDueDate && (
                    <div className="mt-3 text-[11px] text-slate-600 flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-150">
                      <span className="font-medium text-slate-500">Next Due Date:</span>
                      <span className="font-bold text-slate-800">
                        {new Date(pmt.nextDueDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {/* {pmt.remark && (
                    <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-150 flex items-start gap-1.5">
                      <MessageSquare className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong className="text-slate-700">Note:</strong> {pmt.remark}</span>
                    </div>
                  )} */}
                </div>
              );
            })
          ) : student.totalPaid && student.totalPaid > 0 ? (
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                  <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                    # 1
                  </span>
                  <span className="text-xs font-bold text-slate-800">Initial Payment</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px] uppercase">Paid Amount</span>
                    <span className="text-sm font-black text-emerald-600 block mt-0.5">
                      ₹{student.totalPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px] uppercase">Remaining Balance</span>
                    <span className="text-sm font-black text-rose-600 block mt-0.5">
                      ₹{(student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - student.totalPaid)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium text-[10px] uppercase">Payment Mode</span>
                    <span className="inline-block mt-0.5 font-bold text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      UPI / Bank
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-full text-xs text-gray-400 italic text-center py-6">
              No payment history recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
