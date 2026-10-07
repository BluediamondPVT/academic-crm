"use client";

import React from "react";
import { Laptop, Loader2 } from "lucide-react";
import {
  INSTITUTE_COURSES,
  INSTITUTE_SOURCES,
  INSTITUTE_BRANCHES,
} from "../../constants";

interface InstituteLeadFormProps {
  instituteData: {
    branch: string;
    firstName: string;
    middleName: string;
    lastName: string;
    parentName?: string;
    mobile: string;
    alternateMobile: string;
    parentEmail: string;
    address: string;
    dob: string;
    gender: string;
    course: string;
    qualification: string;
    fatherOccupation: string;
    institutionName: string;
    city: string;
    enquiredFrom: string;
  };
  formLoading: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function InstituteLeadForm({
  instituteData,
  formLoading,
  onInputChange,
  onSubmit,
  onCancel,
}: InstituteLeadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 mb-6 flex items-center gap-2">
          <Laptop className="h-4 w-4 text-[#112a46]" />
          Student Admission Enquiry
        </h3>

        <div className="space-y-5">
          {/* Row 1: First Name, Middle Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={instituteData.firstName}
                onChange={onInputChange}
                placeholder="First Name"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={instituteData.middleName}
                onChange={onInputChange}
                placeholder="Middle Name"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={instituteData.lastName}
                onChange={onInputChange}
                placeholder="Last Name"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Mobile, Alternate Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Student / Parent Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                required
                value={instituteData.mobile}
                onChange={onInputChange}
                placeholder="10 digit mobile number"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Alternate Mobile
              </label>
              <input
                type="tel"
                name="alternateMobile"
                value={instituteData.alternateMobile}
                onChange={onInputChange}
                placeholder="Alternate mobile"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Parent Email, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Parent Email
              </label>
              <input
                type="email"
                name="parentEmail"
                value={instituteData.parentEmail}
                onChange={onInputChange}
                placeholder="Parent Email"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={instituteData.gender}
                onChange={onInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 4: Address, Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Course
              </label>
              <select
                name="course"
                value={instituteData.course}
                onChange={onInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all cursor-pointer"
              >
                <option value="">Select Course</option>
                {INSTITUTE_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={instituteData.dob}
                onChange={onInputChange}
                placeholder="mm/dd/yyyy"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Row 5: Course, Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                College / School Name
              </label>
              <input
                type="text"
                name="institutionName"
                value={instituteData.institutionName}
                onChange={onInputChange}
                placeholder="Institution Name"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={instituteData.qualification}
                onChange={onInputChange}
                placeholder="Student Qualification"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Row 6: Father Occupation, College / School Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Father Occupation
              </label>
              <input
                type="text"
                name="fatherOccupation"
                value={instituteData.fatherOccupation}
                onChange={onInputChange}
                placeholder="Occupation"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={instituteData.city}
                onChange={onInputChange}
                placeholder="City Name"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Row 7: Branch & Enquired From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Branch
              </label>
              <select
                name="branch"
                value={instituteData.branch || ""}
                onChange={onInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all cursor-pointer"
              >
                <option value="">Select Branch</option>
                {INSTITUTE_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Enquired From
              </label>
              <select
                name="enquiredFrom"
                value={instituteData.enquiredFrom}
                onChange={onInputChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all cursor-pointer"
              >
                <option value="">Select Source</option>
                {INSTITUTE_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Address, Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={instituteData.address}
                onChange={onInputChange}
                placeholder="Complete Address"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all resize-y"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-6 border-t border-gray-150 flex items-center justify-end gap-3">
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
              Submit Form
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
