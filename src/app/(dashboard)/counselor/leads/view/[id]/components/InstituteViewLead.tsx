"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Laptop,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Building,
  Edit,
  Clock,
} from "lucide-react";
import { InstituteRecord, InstituteRemarkHistory } from "../../../types";

interface InstituteViewLeadProps {
  studentId: string;
  onBack: () => void;
}

const getInstituteStatusBadge = (status: string) => {
  switch (status) {
    case "New Lead":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "Active On Call":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Center Visit":
    case "Visit":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Demo / Counseling":
    case "Online Counseling":
      return "bg-teal-50 text-teal-700 border-teal-200";
    case "Follow-Up":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Batch Processing":
    case "Processing":
      return "bg-pink-50 text-pink-700 border-pink-200";
    case "Hold":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Lost":
      return "bg-red-50 text-red-700 border-red-200";
    case "Admission":
    case "Enrolled":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function InstituteViewLead({
  studentId,
  onBack,
}: InstituteViewLeadProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<InstituteRecord | null>(null);

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
        setStudent(data);
      } else {
        setError("Failed to fetch student record details.");
      }
    } catch (err) {
      console.error("Error fetching institute student:", err);
      setError("An error occurred while loading student details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">
          Loading institute lead details...
        </p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto my-12 shadow-sm">
        <div className="p-3 bg-red-50 text-red-500 rounded-full">
          <ArrowLeft className="h-6 w-6 cursor-pointer" onClick={onBack} />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Failed to load lead</p>
          <p className="text-sm text-gray-500 mt-1">
            {error || "Student record not found."}
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fullName = [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6 font-sans text-gray-800 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
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
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${getInstituteStatusBadge(
                  student.status,
                )}`}
              >
                {student.status}
              </span>
              {student.branch && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {student.branch}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Enquiry ID:{" "}
              <span className="font-mono text-gray-700">
                {student._id || student.id}
              </span>{" "}
              • BDIT Institute Lead
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/counselor/leads/edit/${student._id || student.id}?track=institute`,
            )
          }
          className="px-4 py-2 bg-[#112a46] hover:bg-[#1a3d66] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit Enquiry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Personal & Academic Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Student Information */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Student Contact &amp; Personal Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Primary Mobile
                </span>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                  <Phone className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{student.mobile}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Alternate Mobile
                </span>
                <span className="font-semibold text-gray-700">
                  {student.alternateMobile || "—"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Parent Email
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span>{student.parentEmail || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Gender
                </span>
                <span className="font-semibold text-gray-800">
                  {student.gender || "—"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Date of Birth
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>{student.dob || "—"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  City
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>{student.city || "—"}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Address
                </span>
                <p className="font-medium text-gray-800 leading-relaxed">
                  {student.address || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Institute Academic Course & Education */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <Laptop className="h-4 w-4 text-indigo-600" />
              Course &amp; Academic Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    Enrolled Technical Course
                  </span>
                  <span className="text-sm font-bold text-[#112a46]">
                    {student.course}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-white text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                  BDIT Tech
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Student Qualification
                </span>
                <span className="font-semibold text-gray-800">
                  {student.qualification || "—"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Father Occupation
                </span>
                <span className="font-semibold text-gray-800">
                  {student.fatherOccupation || "—"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  College / School Name
                </span>
                <span className="font-semibold text-gray-800">
                  {student.institutionName || "—"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Enquired From (Source)
                </span>
                <span className="font-semibold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 inline-block">
                  {student.enquiredFrom || "Walk-in"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-semibold mb-0.5">
                  Institute Branch
                </span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 inline-block">
                  {student.branch || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Counselor Log & Remarks */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4 flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Counselor Updates &amp; Log
              </h3>
              {student.remarkHistory && student.remarkHistory.length > 0 && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                  {student.remarkHistory.length} updates
                </span>
              )}
            </div>

            {/* Current Remark */}
            <div>
              <span className="text-xs font-bold text-gray-700 block mb-1">
                Latest Counselor Note
              </span>
              <p className="text-xs text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed italic">
                {student.remark || "No counselor remark added yet."}
              </p>
            </div>

            {/* Remark History Log */}
            {student.remarkHistory && student.remarkHistory.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-gray-100 flex flex-col flex-1">
                <span className="text-xs font-bold text-gray-700 block">
                  Update History ({student.remarkHistory.length})
                </span>
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {[...student.remarkHistory].reverse().map(
                    (h: InstituteRemarkHistory, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-50/90 rounded-xl border border-gray-200 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                          <span className="font-bold text-gray-700">{h.updatedBy || "Counselor"}</span>
                          <span>
                            {h.updatedAt
                              ? new Date(h.updatedAt).toLocaleString("en-IN")
                              : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {h.status && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {h.status}
                            </span>
                          )}
                          {i === 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Latest
                            </span>
                          )}
                          <span className="text-gray-800 font-medium">
                            {h.remark}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
