'use client';

import React from 'react';
import { User, Loader2 } from 'lucide-react';
import { University, Course } from '../../types';
import AcademicCourseAllocation from './AcademicCourseAllocation';
import AcademicPaymentFields from './AcademicPaymentFields';

interface AcademicLeadFormProps {
  formData: {
    name: string;
    phoneNumber: string;
    email: string;
    city: string;
    status: string;
    universityId: string;
    courseIndex: string;
    learningMode: string;
    session: string;
    paymentPlan: string;
    amountPayingNow: string;
    paymentMode: string;
    nextDueDate: string;
    remark: string;
  };
  universities: University[];
  selectedUniversity?: University;
  selectedCourse?: Course | null;
  formLoading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AcademicLeadForm({
  formData,
  universities,
  selectedUniversity,
  selectedCourse,
  formLoading,
  onInputChange,
  onSubmit,
  onCancel,
}: AcademicLeadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* SECTION 1: Student Personal Details */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-[#112a46]" />
          Student Personal Details
        </h3>

        <div className="space-y-4">
          {/* Row 1: Name, Phone, City */}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
                placeholder="Enter City"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
              />
            </div>
          </div>

          {/* Row 2: Email, Admission Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
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
                onChange={onInputChange}
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

      {/* SECTION 2: Academic Course Allocation */}
      <AcademicCourseAllocation
        universities={universities}
        universityId={formData.universityId}
        courseIndex={formData.courseIndex}
        learningMode={formData.learningMode}
        session={formData.session}
        selectedUniversity={selectedUniversity}
        selectedCourse={selectedCourse}
        onInputChange={onInputChange}
      />

      {/* SECTION 3: Payment Plan & Token Fee */}
      <AcademicPaymentFields
        paymentPlan={formData.paymentPlan}
        amountPayingNow={formData.amountPayingNow}
        paymentMode={formData.paymentMode}
        nextDueDate={formData.nextDueDate}
        onInputChange={onInputChange}
      />

      {/* SECTION 4: Counselor Log Notes */}
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
          onChange={onInputChange}
          placeholder={
            ['Hold', 'Lost', 'Follow-Up'].includes(formData.status)
              ? 'Enter reason or next action date...'
              : 'Enter counselor notes and initial updates here...'
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all text-gray-800 leading-relaxed resize-y min-h-[90px]"
        />
      </div>

      {/* Footer Submission Actions */}
      <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
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
  );
}
