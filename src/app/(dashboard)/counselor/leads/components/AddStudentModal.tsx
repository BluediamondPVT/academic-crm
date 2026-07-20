'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  User,
  Phone,
  Mail,
  Landmark,
  Building,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { University } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  onSuccess: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  universities,
  onSuccess,
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email:'',
    remark:'',
    universityId: '',
    courseIndex: '',
    city: '',
    status: 'New Lead',
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

  if (!isOpen) return null;

  const selectedUniversity = universities.find(u => u._id === formData.universityId);
  const selectedCourse =
    selectedUniversity && formData.courseIndex !== ''
      ? selectedUniversity.courses[Number(formData.courseIndex)]
      : null;

  const handlePaymentPlanChange = (plan: 'Yearly' | 'Semester' | 'Custom') => {
    setPaymentType(plan);
    if (plan === 'Yearly') {
      const yearly = selectedCourse?.yearFee || (selectedCourse?.totalFee && selectedCourse?.duration ? Math.round(selectedCourse.totalFee / selectedCourse.duration) : selectedCourse?.totalFee) || 0;
      setAmountPaid(yearly ? Number(yearly) : '');
    } else if (plan === 'Semester') {
      const sem = selectedCourse?.semesterFee || (selectedCourse?.totalFee && selectedCourse?.duration ? Math.round(selectedCourse.totalFee / (selectedCourse.duration * 2)) : 0) || 0;
      setAmountPaid(sem ? Number(sem) : '');
    } else if (plan === 'Custom') {
      setAmountPaid('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        setAmountPaid(yearly ? Number(yearly) : '');
        if (formData.status === 'Admission') {
          setPayoutPercentage(course?.payoutPercentage || 0);
        } else {
          setPayoutPercentage('');
        }
      }
    } else if (name === 'status') {
      if (value === 'Processing' || value === 'Admission') {
        const yearly = selectedCourse?.yearFee || (selectedCourse?.totalFee && selectedCourse?.duration ? Math.round(selectedCourse.totalFee / selectedCourse.duration) : selectedCourse?.totalFee) || 0;
        setPaymentType('Yearly');
        setAmountPaid(yearly ? Number(yearly) : '');
        setPaymentMode('UPI');
        setNextDueDate('');
        if (value === 'Admission') {
          setPayoutPercentage(selectedCourse?.payoutPercentage || 0);
        } else {
          setPayoutPercentage('');
        }
      }
      setFormData(prev => ({ ...prev, status: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please enter both student name and phone number.');
      return;
    }

    if (!selectedUniversity) {
      setError('Please select a university.');
      return;
    }

    if (!selectedCourse) {
      setError('Please select a course.');
      return;
    }

    setFormLoading(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email,
        remark: formData.remark,
        universityId: selectedUniversity._id,
        universityName: selectedUniversity.name,
        city: formData.city,
        courseName: selectedCourse.name,
        specialization: selectedCourse.specialization || '',
        duration: selectedCourse.duration,
        totalFee: selectedCourse.totalFee,
        yearFee: selectedCourse.yearFee,
        semesterFee: selectedCourse.semesterFee,
        status: formData.status,
      };

      if (formData.status === 'Processing' || formData.status === 'Admission') {
        const paidVal = Number(amountPaid) || 0;
        payload.totalPaid = paidVal;
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

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add student');
      }

      setSuccess('Student added successfully!');
      onSuccess();

      setTimeout(() => {
        onClose();
        setSuccess('');
        setFormData({
          name: '',
          phoneNumber: '',
          email:'',
          remark:'',
          universityId: '',
          courseIndex: '',
          city: '',
          status: 'New Lead',
        });
        setPaymentType('Yearly');
        setAmountPaid('');
        setPaymentMode('UPI');
        setNextDueDate('');
        setPayoutPercentage('');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[96vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#112a46] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <GraduationCap className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Add Student Registration</h3>
              <p className="text-xs text-blue-200">
                Register a student &amp; select allocated university course
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-2">
                1. Student Personal Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Enter Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail  className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Enter City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Landmark className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* University & Course Selection Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-2">
                2. Course &amp; University Allocation
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select University <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="universityId"
                      required
                      value={formData.universityId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                    >
                      <option value="">-- Select University --</option>
                      {universities.map(u => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.location} - {u.modeOfLearning})
                        </option>
                      ))}
                    </select>
                  </div>
                  {universities.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No universities added in Admin panel yet.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Course (from Selected University) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="courseIndex"
                      required
                      disabled={!selectedUniversity}
                      value={formData.courseIndex}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                        !selectedUniversity ? 'bg-gray-100 text-gray-400' : 'bg-white'
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
                      <div>
                        <span className="text-gray-500 block">Remark</span>
                        <span className="font-bold text-gray-800">{selectedCourse.remark?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Admission Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
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

            {/* Direct Inline Payment Fields */}
            {formData.status === 'Admission' && selectedCourse && (
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
                            ? `₹${(selectedCourse.yearFee || (selectedCourse.totalFee && selectedCourse.duration ? Math.round(selectedCourse.totalFee / selectedCourse.duration) : selectedCourse.totalFee || 0)).toLocaleString('en-IN')}`
                            : plan === 'Semester'
                            ? `₹${(selectedCourse.semesterFee || (selectedCourse.totalFee && selectedCourse.duration ? Math.round(selectedCourse.totalFee / (selectedCourse.duration * 2)) : 0)).toLocaleString('en-IN')}`
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
                <div className="bg-slate-900 rounded-xl p-3 text-white">
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div>
                      <span className="text-[8px] text-slate-400 block uppercase font-medium">Total</span>
                      <span className="text-xs font-bold block mt-0.5 text-white">
                        ₹{(selectedCourse.totalFee || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-emerald-300 block uppercase font-medium">Paying Now</span>
                      <span className="text-xs font-bold block mt-0.5 text-emerald-400">
                        ₹{(Number(amountPaid) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-amber-300 block uppercase font-medium">Remaining</span>
                      <span className="text-xs font-bold block mt-0.5 text-amber-300">
                        ₹{Math.max(0, (selectedCourse.totalFee || 0) - (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

             <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Remark
                    </label>
                    {['Hold', 'Lost', 'Follow-Up'].includes(formData.status) && (
                      <span className="text-[11px] font-medium text-amber-600">
                        Enter reason or next action date
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MessageCircle className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="remark"
                      value={formData.remark}
                      onChange={handleInputChange}
                      placeholder={
                        ['Hold', 'Lost', 'Follow-Up'].includes(formData.status)
                          ? 'Enter reason or next action date...'
                          : 'Student update'
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      type="text"
                    />
                  </div>
                </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
