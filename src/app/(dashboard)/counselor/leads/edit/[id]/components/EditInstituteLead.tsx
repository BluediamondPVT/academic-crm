"use client";

import React, { useState, useEffect } from "react";
import {
  Laptop,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import {
  INSTITUTE_COURSES,
  INSTITUTE_SOURCES,
  INSTITUTE_STATUSES,
  INSTITUTE_BRANCHES,
} from "../../../constants";

interface EditInstituteLeadProps {
  studentId: string;
  onBack: () => void;
}

export default function EditInstituteLead({
  studentId,
  onBack,
}: EditInstituteLeadProps) {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    branch: "",
    mobile: "",
    alternateMobile: "",
    parentEmail: "",
    address: "",
    dob: "",
    gender: "",
    course: "",
    qualification: "",
    fatherOccupation: "",
    institutionName: "",
    city: "",
    enquiredFrom: "",
    status: "New Lead",
    remark: "",
  });

  const [remarkHistory, setRemarkHistory] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      fetchInstituteStudent();
    }
  }, [studentId]);

  const fetchInstituteStudent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/institute/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          branch: data.branch || "",
          mobile: data.mobile || "",
          alternateMobile: data.alternateMobile || "",
          parentEmail: data.parentEmail || "",
          address: data.address || "",
          dob: data.dob || "",
          gender: data.gender || "",
          course: data.course || "",
          qualification: data.qualification || "",
          fatherOccupation: data.fatherOccupation || "",
          institutionName: data.institutionName || "",
          city: data.city || "",
          enquiredFrom: data.enquiredFrom || "",
          status: data.status || "New Lead",
          remark: data.remark || "",
        });
        setRemarkHistory(
          Array.isArray(data.remarkHistory) ? data.remarkHistory : [],
        );
      } else {
        setError("Failed to fetch student enquiry details.");
      }
    } catch (err) {
      console.error("Error fetching institute student:", err);
      setError("An error occurred while loading student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!formData.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch(`/api/institute/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("Institute student enquiry updated successfully!");
        setTimeout(() => {
          onBack();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update student enquiry.");
      }
    } catch (err: any) {
      console.error("Error updating institute student:", err);
      setError("An unexpected error occurred while saving.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">Loading student enquiry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-gray-800 w-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Laptop className="h-5 w-5 text-indigo-600" />
              Edit Institute Student Enquiry
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Update technical course enquiry details and counselor log
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Messages */}
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6"
      >
        {/* Row 1: First, Middle, Last */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Alternate Mobile
            </label>
            <input
              type="tel"
              name="alternateMobile"
              value={formData.alternateMobile}
              onChange={handleChange}
              placeholder="Alternate mobile"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
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
              value={formData.parentEmail}
              onChange={handleChange}
              placeholder="Parent Email"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 4: Course, Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer font-semibold"
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
              Enquiry Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer font-bold"
            >
              {INSTITUTE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Qualification, Father Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Student Qualification"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Father Occupation
            </label>
            <input
              type="text"
              name="fatherOccupation"
              value={formData.fatherOccupation}
              onChange={handleChange}
              placeholder="Occupation"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Row 6: College Name, City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              College / School Name
            </label>
            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="Institution Name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City Name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Row 7: Date of Birth, Enquired From */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Enquired From (Source)
            </label>
            <select
              name="enquiredFrom"
              value={formData.enquiredFrom}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              <option value="">Select Source</option>
              {INSTITUTE_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Institute Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              <option value="">Select Branch</option>
              {INSTITUTE_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 8: Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Address
          </label>
          <textarea
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            placeholder="Complete Address"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
          />
        </div>

        {/* Row 9: Remark Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-indigo-600" />
            Counselor Remark / Update Note
          </label>
          <textarea
            name="remark"
            rows={3}
            value={formData.remark}
            onChange={handleChange}
            placeholder="Enter reason for status change or update notes..."
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
          />
        </div>

        {/* Remark History Audit Log */}
        {remarkHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-150 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Previous Counselor Updates ({remarkHistory.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {remarkHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                    <span>{item.updatedBy || "Counselor"}</span>
                    <span>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString("en-IN")
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.status}
                      </span>
                    )}
                    <span className="text-gray-800 font-medium">
                      {item.remark}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="pt-6 border-t border-gray-150 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
