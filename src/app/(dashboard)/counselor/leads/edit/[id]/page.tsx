'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Landmark,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Edit3,
  ArrowLeft,
  Lock,
  X,
  BookOpen,
  Building,
} from 'lucide-react';
import { StudentRecord } from '../../types';

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLeadPage({ params }: EditLeadPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAdmissions = searchParams.get('from') === 'admissions';
  const [studentId, setStudentId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    remark: '',
    city: '',
    status: 'New Lead',
    universityId: '',
    courseIndex: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Payment tracking states
  const [paymentType, setPaymentType] = useState<'Yearly' | 'Semester' | 'Custom'>('Yearly');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Bank' | 'Cash'>('UPI');
  const [nextDueDate, setNextDueDate] = useState<string>('');
  const [payoutPercentage, setPayoutPercentage] = useState<number | ''>('');

  const selectedUniversity = universities.find(u => u._id === formData.universityId);
  const selectedCourse =
    selectedUniversity && formData.courseIndex !== ''
      ? selectedUniversity.courses[Number(formData.courseIndex)]
      : null;

  useEffect(() => {
    setIsAdmin(document.cookie.includes('userRole=ADMIN'));
  }, []);

  useEffect(() => {
    params.then(res => {
      setStudentId(res.id);
    });
  }, [params]);

  useEffect(() => {
    if (studentId) {
      fetchStudentAndUniversities();
    }
  }, [studentId]);

  const fetchStudentAndUniversities = async () => {
    setLoading(true);
    try {
      // 1. Fetch universities
      const univRes = await fetch('/api/admin/universities');
      let univs: any[] = [];
      if (univRes.ok) {
        univs = await univRes.json();
        setUniversities(univs);
      }

      // 2. Fetch student
      const res = await fetch(`/api/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);

        // Find corresponding course index
        const foundUniv = univs.find(u => u._id === data.universityId);
        const courseIdx = foundUniv 
          ? foundUniv.courses.findIndex((c: any) => c.name === data.courseName) 
          : -1;

        setFormData({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          remark: data.status === 'Admission' ? (data.admissionRemark || '') : (data.remark || ''),
          city: data.city || '',
          status: data.status || 'New Lead',
          universityId: data.universityId || '',
          courseIndex: courseIdx >= 0 ? String(courseIdx) : '',
        });
        setPayoutPercentage(data.payoutPercentage !== undefined ? data.payoutPercentage : '');
      } else {
        setError('Failed to fetch student record details.');
      }
    } catch (err) {
      console.error('Error fetching details:', err);
      setError('An error occurred while loading student details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentPlanChange = (plan: 'Yearly' | 'Semester' | 'Custom') => {
    setPaymentType(plan);
    const courseToUse = selectedCourse || student;
    if (plan === 'Yearly') {
      const yearly = courseToUse?.yearFee || (courseToUse?.totalFee && courseToUse?.duration ? Math.round(courseToUse.totalFee / courseToUse.duration) : courseToUse?.totalFee) || 0;
      setAmountPaid(yearly ? Number(yearly) : '');
    } else if (plan === 'Semester') {
      const sem = courseToUse?.semesterFee || (courseToUse?.totalFee && courseToUse?.duration ? Math.round(courseToUse.totalFee / (courseToUse.duration * 2)) : 0) || 0;
      setAmountPaid(sem ? Number(sem) : '');
    } else if (plan === 'Custom') {
      setAmountPaid('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'universityId') {
      setFormData(prev => ({ ...prev, universityId: value, courseIndex: '' }));
    } else if (name === 'courseIndex') {
      const courseIdx = value;
      const course = selectedUniversity && courseIdx !== '' ? selectedUniversity.courses[Number(courseIdx)] : null;
      setFormData(prev => ({ ...prev, courseIndex: value }));
      if (formData.status === 'Processing' || formData.status === 'Admission') {
        const yearly = course?.yearFee || (course?.totalFee && course?.duration ? Math.round(course.totalFee / course.duration) : course?.totalFee) || 0;
        setPaymentType('Yearly');
        if ((student?.totalPaid || 0) === 0) {
          setAmountPaid(yearly ? Number(yearly) : '');
        }
        if (formData.status === 'Admission') {
          setPayoutPercentage(course?.payoutPercentage || 0);
        } else {
          setPayoutPercentage('');
        }
      }
    } else if (name === 'status') {
      const courseToUse = selectedCourse || student;
      if (value === 'Processing' || value === 'Admission') {
        const yearly = courseToUse?.yearFee || (courseToUse?.totalFee && courseToUse?.duration ? Math.round(courseToUse.totalFee / courseToUse.duration) : courseToUse?.totalFee) || 0;
        setPaymentType('Yearly');
        if ((student?.totalPaid || 0) === 0) {
          setAmountPaid(yearly ? Number(yearly) : '');
        }
        setPaymentMode('UPI');
        setNextDueDate('');
        if (value === 'Admission') {
          setPayoutPercentage(courseToUse?.payoutPercentage || 0);
        } else {
          setPayoutPercentage('');
        }
      }
      setFormData(prev => ({
        ...prev,
        status: value,
        remark: value === 'Admission'
          ? (student?.admissionRemark || '')
          : (student?.remark || '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const goBack = () => {
    router.push(fromAdmissions ? '/admissions' : (isAdmin ? '/admin/students' : '/counselor/leads'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please enter both student name and phone number.');
      return;
    }

    setFormLoading(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        remark: formData.remark,
        city: formData.city.trim(),
        status: formData.status,
      };

      if (selectedUniversity && selectedCourse) {
        payload.universityId = selectedUniversity._id;
        payload.universityName = selectedUniversity.name;
        payload.courseName = selectedCourse.name;
        payload.specialization = selectedCourse.specialization || '';
        payload.duration = selectedCourse.duration;
        payload.totalFee = selectedCourse.totalFee;
        payload.yearFee = selectedCourse.yearFee;
        payload.semesterFee = selectedCourse.semesterFee;
      }

      if (formData.status === 'Processing' || formData.status === 'Admission') {
        const paidVal = Number(amountPaid) || 0;
        payload.totalPaid = (student?.totalPaid || 0) + paidVal;
        if (paidVal > 0) {
          payload.paymentTransaction = {
            paymentType,
            amount: paidVal,
            paymentMode,
            nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : undefined,
          };
        }
        if (formData.status === 'Admission') {
          payload.payoutPercentage = Number(payoutPercentage) || 0;
        }
      }

      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update student');
      }

      setSuccess('Enquiry updated successfully!');

      setTimeout(() => {
        goBack();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">Loading lead details...</p>
      </div>
    );
  }

  // Determine disabled states based on the role and original values
  const isNameDisabled = !isAdmin && !!student?.name;
  const isPhoneDisabled = !isAdmin && !!student?.phoneNumber;
  const isEmailDisabled = !isAdmin && !!student?.email;
  const isCityDisabled = !isAdmin && !!student?.city;

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">View / Edit Enquiry</h1>
          <p className="text-sm text-gray-500 mt-1">Update details for {student?.name}</p>
        </div>
        <button
          onClick={goBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Enquiry Details */}
            <div>
              <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 mb-4">
                Enquiry Details
              </h3>
              
              {/* Enquiry Form Fields */}
              <div className="space-y-6">

                {/* University and Course Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select University */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                      <span>Select University <span className="text-red-500">*</span></span>
                      {student?.status === 'Admission' && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Building className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="universityId"
                        required
                        disabled={student?.status === 'Admission'}
                        value={formData.universityId}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Select University --</option>
                        {universities.map(u => (
                          <option key={u._id} value={u._id}>
                            {u.name} ({u.location} - {u.modeOfLearning})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Course */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                      <span>Select Course <span className="text-red-500">*</span></span>
                      {student?.status === 'Admission' && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <BookOpen className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="courseIndex"
                        required
                        disabled={!selectedUniversity || student?.status === 'Admission'}
                        value={formData.courseIndex}
                        onChange={handleInputChange}
                        className={`w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all ${
                          (!selectedUniversity || student?.status === 'Admission') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
                        }`}
                      >
                        <option value="">
                          {selectedUniversity
                            ? '-- Select Course --'
                            : '-- First select a university above --'}
                        </option>
                        {selectedUniversity?.courses.map((course: any, idx: number) => (
                          <option key={idx} value={idx}>
                            {course.name} {course.specialization ? `- ${course.specialization}` : ''} ({course.duration} Yrs - ₹{course.totalFee?.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Selected Course Details Preview Card */}
                {selectedCourse && (
                  <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 uppercase">
                        Selected Course Details
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs font-bold">
                        {selectedCourse.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-gray-500 block">Duration</span>
                        <span className="font-bold text-gray-800">{selectedCourse.duration} Years</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Total Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.totalFee?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Year Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.yearFee?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Semester Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.semesterFee?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 1: Name, Phone, City (3 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={isNameDisabled}
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isNameDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phoneNumber"
                        required
                        disabled={isPhoneDisabled}
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Phone"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isPhoneDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* City field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="city"
                        required
                        disabled={isCityDisabled}
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter City"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                        type="text"
                      />
                      {isCityDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Email, Status (2 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        disabled={isEmailDisabled}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isEmailDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Status selection */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        Admission Status
                      </label>
                      {student?.status === 'Admission' && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Status Locked
                        </span>
                      )}
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={student?.status === 'Admission'}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Active On Call">Active On Call</option>
                      <option value="Visit">Visit</option>
                      <option value="Online Counseling">Online Counseling</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Processing">Processing</option>
                      <option value="Hold">Hold</option>
                      
                      <option value="Lost">Lost</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>
                </div>

                {/* Direct Inline Payment Fields */}
                {formData.status === 'Admission' && student && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4 transition-all duration-300">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                      Payment details for {formData.status}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                        Fee Payment Plan
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Yearly', 'Semester', 'Custom'] as const).map((plan) => (
                          <button
                            key={plan}
                            type="button"
                            onClick={() => handlePaymentPlanChange(plan)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                              paymentType === plan
                                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-600/20 shadow-xxs'
                                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span>{plan}</span>
                            <span className="text-[9px] font-medium text-gray-400 mt-0.5">
                              {plan === 'Yearly'
                                ? `₹${(student.yearFee || (student.totalFee && student.duration ? Math.round(student.totalFee / student.duration) : student.totalFee || 0)).toLocaleString('en-IN')}`
                                : plan === 'Semester'
                                ? `₹${(student.semesterFee || (student.totalFee && student.duration ? Math.round(student.totalFee / (student.duration * 2)) : 0)).toLocaleString('en-IN')}`
                                : 'Custom'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Amount Paid (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Enter amount"
                            className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Payment Mode
                        </label>
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        >
                          <option value="UPI">UPI / QR Code</option>
                          <option value="Bank">Bank Transfer</option>
                          <option value="Cash">Cash Payment</option>
                        </select>
                      </div>
                    </div>

                    {paymentType === 'Custom' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Next Due Date
                        </label>
                        <input
                          type="date"
                          value={nextDueDate}
                          onChange={(e) => setNextDueDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    )}

                    {/* Inline Summary */}
                    {(() => {
                      const activeCourse = selectedCourse || student;
                      const totalCourseFee = Number(activeCourse?.totalFee || 0);
                      const existingPaid = Number(student?.totalPaid || 0);
                      const currentPaying = Number(amountPaid) || 0;
                      const remFee = Math.max(0, totalCourseFee - (existingPaid + currentPaying));
                      return (
                        <div className="bg-slate-900 rounded-xl p-3 text-white">
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div>
                              <span className="text-[8px] text-slate-400 block uppercase font-medium">Total</span>
                              <span className="text-xs font-bold block mt-0.5 text-white">
                                ₹{totalCourseFee.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] text-emerald-300 block uppercase font-medium">Paying Now</span>
                              <span className="text-xs font-bold block mt-0.5 text-emerald-400">
                                ₹{currentPaying.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] text-amber-300 block uppercase font-medium">Remaining</span>
                              <span className="text-xs font-bold block mt-0.5 text-amber-300">
                                ₹{remFee.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Row 3: Remark (last remark) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Remark / Counselor Log Notes
                    </label>
                    {['Hold', 'Lost', 'Follow-Up'].includes(formData.status) && (
                      <span className="text-[11px] font-medium text-amber-600">
                        Enter reason or next action date
                      </span>
                    )}
                  </div>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    placeholder={
                      ['Hold', 'Lost', 'Follow-Up'].includes(formData.status)
                        ? 'Enter reason or next action date...'
                        : 'Enter counselor notes and updates here...'
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all text-gray-800 leading-relaxed resize-y min-h-[100px]"
                  />
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2 bg-[#112a46] hover:bg-[#1a3d66] active:scale-98 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
