'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Laptop,
  Layers,
  Sparkles,
  DollarSign,
  Calendar,
  Clock,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { University } from '../types';

// Sample Institute Courses (Will be dynamically fetched from Super Admin/Database later)
const INSTITUTE_COURSES = [
  { name: 'Data Science Course', fee: 95000, category: 'Advanced Tech' },
  { name: 'Full Stack Development Course', fee: 48000, category: 'Development' },
  { name: 'Digital Marketing Course', fee: 25000, category: 'Marketing' },
];

export default function CreateLeadPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  // 🔀 Program Track: 'academic' | 'institute' | 'dual'
  const [programTrack, setProgramTrack] = useState<'academic' | 'institute' | 'dual'>('academic');

  // Student Basic Information
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    remark: '',
    city: '',
    status: 'New Lead',
    // Academic fields
    universityId: '',
    courseIndex: '',
    learningMode: 'Online',
    session: 'July 2026',
    // Institute fields
    instituteCourse: 'Full Stack Development Course',
    trainingMode: 'Offline Classroom (BDIT Center)',
    batchTiming: 'Morning (09:00 AM - 11:00 AM)',
    instituteFee: 48000,
    // Payment fields (UI only)
    paymentPlan: 'Installments',
    amountPayingNow: '',
    paymentMode: 'UPI',
    nextDueDate: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUniversities = async () => {
    try {
      const res = await fetch('/api/admin/universities');
      if (res.ok) {
        const data = await res.json();
        setUniversities(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoadingUniversities(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const selectedUniversity = universities.find(u => u._id === formData.universityId);
  const selectedCourse =
    selectedUniversity && formData.courseIndex !== ''
      ? selectedUniversity.courses[Number(formData.courseIndex)]
      : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'universityId') {
      setFormData(prev => ({ ...prev, universityId: value, courseIndex: '' }));
    } else if (name === 'instituteCourse') {
      const found = INSTITUTE_COURSES.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        instituteCourse: value,
        instituteFee: found ? found.fee : prev.instituteFee
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const goBack = () => {
    const isAdmin = document.cookie.includes('userRole=ADMIN');
    router.push(isAdmin ? '/admin/students' : '/counselor/leads');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please enter both student name and phone number.');
      return;
    }

    if (programTrack === 'academic' && (!selectedUniversity || !selectedCourse)) {
      setError('Please select both university and course for academic admission.');
      return;
    }

    setFormLoading(true);

    // Pure UI simulation / demo as requested
    setTimeout(() => {
      setSuccess(`Enquiry created successfully for ${programTrack.toUpperCase()}!`);
      setFormLoading(false);
      setTimeout(() => {
        goBack();
      }, 1200);
    }, 600);
  };

  if (loadingUniversities) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">Loading university listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Enquiry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register student for Academic Degree, BDIT Institute Course, or Dual Combo
          </p>
        </div>
        <button
          onClick={goBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">

        {/* 🔀 PROGRAM TYPE TRACK SELECTOR (Pill Tabs at top) */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-[#112a46] to-[#1e40af] text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block mb-1">
                Step 1: Choose Admission Track
              </span>
              <h2 className="text-lg font-bold">Kiski Admission Karwani Hai?</h2>
            </div>

            {/* 3 Interactive Track Options */}
            <div className="grid grid-cols-3 gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setProgramTrack('academic')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${programTrack === 'academic'
                    ? 'bg-white text-[#112a46] shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span>1. Academic (Degree)</span>
              </button>

              <button
                type="button"
                onClick={() => setProgramTrack('institute')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${programTrack === 'institute'
                    ? 'bg-white text-[#112a46] shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Laptop className="h-4 w-4 shrink-0" />
                <span>2. BDIT Institute</span>
              </button>

              <button
                type="button"
                onClick={() => setProgramTrack('dual')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${programTrack === 'dual'
                    ? 'bg-amber-400 text-slate-900 shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span>3. Dual (Combo Both)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
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

            {/* SECTION 1: Student Basic Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-[#112a46]" />
                Student Personal Details
              </h3>

              <div className="space-y-4">
                {/* Row 1: Name, Phone, City (3 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Phone Number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Row 2: Email, Admission Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email Address"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Admission Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all bg-white"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Active On Call">Active On Call</option>
                      <option value="Visit">Visit</option>
                      <option value="Online Counseling">Online Counseling</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Processing">Processing</option>
                      <option value="Hold">Hold</option>
                      <option value="Lost">Lost</option>
                      <option value="Admission">Admission Confirmed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2A: Academic University Course Selection (When 'academic' or 'dual') */}
            {(programTrack === 'academic' || programTrack === 'dual') && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#1e40af]" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1e40af]">
                      Academic University Course Allocation
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1e40af] text-white">
                    University Degree
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select University */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select University <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="universityId"
                      value={formData.universityId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all bg-white"
                    >
                      <option value="">-- Select University --</option>
                      {universities.map(u => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.location} - {u.modeOfLearning})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Course */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="courseIndex"
                      disabled={!selectedUniversity}
                      value={formData.courseIndex}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all ${!selectedUniversity ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
                        }`}
                    >
                      <option value="">
                        {selectedUniversity
                          ? '-- Select Course --'
                          : '-- First select a university above --'}
                      </option>
                      {selectedUniversity?.courses.map((course, idx) => (
                        <option key={idx} value={idx}>
                          {course.name} {course.specialization ? `- ${course.specialization}` : ''} ({course.duration} Yrs - ₹{course.totalFee?.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Academic Inputs: Mode of Learning & Session */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Mode of Learning
                    </label>
                    <select
                      name="learningMode"
                      value={formData.learningMode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    >
                      <option value="Online">Online Mode</option>
                      <option value="Distance">Distance Mode</option>
                      <option value="Regular">Regular Campus Mode</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Admission Session
                    </label>
                    <select
                      name="session"
                      value={formData.session}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                    >
                      <option value="July 2026">July 2026 Session</option>
                      <option value="January 2026">January 2026 Session</option>
                    </select>
                  </div>
                </div>

                {/* Selected Course Details Preview Card */}
                {selectedCourse && (
                  <div className="p-4 bg-linear-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Selected Course Summary
                      </span>
                      <span className="px-2 py-0.5 bg-[#112a46] text-white rounded text-xs font-bold">
                        {selectedCourse.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Duration</span>
                        <span className="font-bold text-gray-800">{selectedCourse.duration} Years</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Total Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.totalFee?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Year Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.yearFee?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Semester Fee</span>
                        <span className="font-bold text-gray-800">₹{selectedCourse.semesterFee?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2B: BDIT Institute Course Selection (When 'institute' or 'dual') */}
            {/* Temporarily hidden */ false && (programTrack === 'institute' || programTrack === 'dual') && (
              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-purple-700" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
                      BDIT Institute Course Allocation
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-700 text-white">
                    100% In-House BDIT Revenue
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Select Institute Course */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select Institute Course (Rate Card)
                    </label>
                    <select
                      name="instituteCourse"
                      value={formData.instituteCourse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 font-semibold text-gray-800 transition-all bg-white"
                    >
                      {INSTITUTE_COURSES.map((c, i) => (
                        <option key={i} value={c.name}>
                          {c.name} — ₹{c.fee.toLocaleString('en-IN')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Training Mode */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Training Mode
                    </label>
                    <select
                      name="trainingMode"
                      value={formData.trainingMode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 font-medium transition-all bg-white"
                    >
                      <option value="Offline Classroom (BDIT Center)">Offline Classroom (BDIT Center)</option>
                      <option value="Online Live Interactive">Online Live Interactive</option>
                      <option value="Hybrid (Classroom + LMS)">Hybrid (Classroom + LMS)</option>
                    </select>
                  </div>

                  {/* Preferred Batch Timing */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Batch Timing
                    </label>
                    <select
                      name="batchTiming"
                      value={formData.batchTiming}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 font-medium transition-all bg-white"
                    >
                      <option value="Morning (09:00 AM - 11:00 AM)">Morning (09:00 AM - 11:00 AM)</option>
                      <option value="Afternoon (01:00 PM - 03:00 PM)">Afternoon (01:00 PM - 03:00 PM)</option>
                      <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                      <option value="Weekend Batch (Sat & Sun)">Weekend Batch (Sat & Sun)</option>
                    </select>
                  </div>
                </div>

                {/* Institute Fee Highlight */}
                <div className="p-3.5 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <div>
                      <span className="text-xs font-bold text-purple-950 block">
                        {formData.instituteCourse}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        Industry-Focused Training • Certification by Blue Diamond Infotech Pvt. Ltd.
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-purple-700">
                      ₹{formData.instituteFee.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] block text-emerald-600 font-bold uppercase">
                      Zero University Deduction
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* DUAL COMBO SUMMARY BOX (When 'dual' is active) */}
            {programTrack === 'dual' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-20 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black">
                    Combo
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Dual Program Bundle: Degree + Practical Skill Training
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Academic Degree + <span className="font-bold">{formData.instituteCourse}</span> linked under single student record!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Estimated Combined Value</span>
                  <span className="text-base font-black text-amber-950">
                    ₹{((selectedCourse ? selectedCourse.totalFee : 0) + formData.instituteFee).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* SECTION 3: Fee Payment, Installments & Mode */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#112a46]" />
                Payment Plan &amp; Token Fee Details (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Payment Plan */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Payment Plan
                  </label>
                  <select
                    name="paymentPlan"
                    value={formData.paymentPlan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                  >
                    <option value="Installments">Installment Schedule</option>
                    <option value="Full">Full Upfront Payment</option>
                  </select>
                </div>

                {/* Amount Paying Now */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Amount Paying Now (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      name="amountPayingNow"
                      value={formData.amountPayingNow}
                      onChange={handleInputChange}
                      placeholder="e.g. 5000"
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                    />
                  </div>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Bank">Bank Transfer / NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>

                {/* Next Due Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    name="nextDueDate"
                    value={formData.nextDueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Remark / Log */}
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
                    : 'Enter counselor notes and initial updates here...'
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all text-gray-800 leading-relaxed resize-y min-h-[90px]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] active:scale-98 text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
