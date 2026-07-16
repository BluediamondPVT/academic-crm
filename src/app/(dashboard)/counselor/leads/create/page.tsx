'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  ArrowLeft,
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

export default function CreateLeadPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    remark: '',
    universityId: '',
    courseIndex: '',
    city: '',
    status: 'New Lead',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

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
      const payload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        remark: formData.remark,
        universityId: selectedUniversity._id,
        universityName: selectedUniversity.name,
        city: formData.city.trim(),
        courseName: selectedCourse.name,
        specialization: selectedCourse.specialization || '',
        duration: selectedCourse.duration,
        totalFee: selectedCourse.totalFee,
        yearFee: selectedCourse.yearFee,
        semesterFee: selectedCourse.semesterFee,
        status: formData.status,
      };

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add student');
      }

      setSuccess('Enquiry added successfully!');

      setTimeout(() => {
        goBack();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
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
            Register a student &amp; allocate a university course list
          </p>
        </div>
        <button
          onClick={goBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-5">
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
                
                {/* Row 1: Name, Phone, City (3 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name field */}
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all"
                    />
                  </div>

                  {/* Phone Number */}
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
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Email, Admission Status (2 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email Address"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all"
                    />
                  </div>

                  {/* Status selection */}
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
                      <option value="Rejected">Rejected</option>
                      <option value="Lost">Lost</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: University, Course Allocation (2 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select University */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select University <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="universityId"
                      required
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
                      required
                      disabled={!selectedUniversity}
                      value={formData.courseIndex}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all ${
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
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Selected Course Summary
                      </span>
                      <span className="px-2 py-0.5 bg-[#112a46] text-white rounded text-xs font-bold">
                        {selectedCourse.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
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
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Remark</span>
                        <span className="font-bold text-gray-800">{selectedCourse.remark || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 4: Remark / Log */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Remark / Counselor Log Notes
                    </label>
                    {['Hold', 'Lost', 'Rejected', 'Follow-Up'].includes(formData.status) && (
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
                      ['Hold', 'Lost', 'Rejected', 'Follow-Up'].includes(formData.status)
                        ? 'Enter reason or next action date...'
                        : 'Enter counselor notes and initial updates here...'
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
                Submit Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
