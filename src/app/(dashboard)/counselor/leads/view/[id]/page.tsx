'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Edit3 } from 'lucide-react';
import { StudentRecord } from '../../types';

import { PersonalInfoCard } from './components/PersonalInfoCard';
import { RemarksHistoryCard } from './components/RemarksHistoryCard';
import { AcademicDetailsCard } from './components/AcademicDetailsCard';
import { FeeStructureCard } from './components/FeeStructureCard';
import { PaymentHistorySection } from './components/PaymentHistorySection';

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

  const displayRemark = student.admissionRemark || student.preAdmissionRemark || student.remark || '';

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
          <PersonalInfoCard student={student} displayStatus={displayStatus} />
          <RemarksHistoryCard filteredHistory={filteredHistory} displayRemark={displayRemark} />
        </div>

        {/* Right Column: Academic Details & Fee Structure */}
        <div className="space-y-6">
          <AcademicDetailsCard student={student} />
          <FeeStructureCard student={student} />
        </div>
      </div>

      {/* Full Width Payment & Installments History Section */}
      <PaymentHistorySection student={student} />
    </div>
  );
}
