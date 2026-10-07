"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { University } from "../types";
import TrackSelector from "./components/TrackSelector";
import AcademicLeadForm from "./components/AcademicLeadForm";
import InstituteLeadForm from "./components/InstituteLeadForm";

export default function CreateLeadPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  // 🔀 Program Track: 'academic' | 'institute'
  const [programTrack, setProgramTrack] = useState<"academic" | "institute">(
    "academic",
  );

  // Academic Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    remark: "",
    city: "",
    status: "New Lead",
    universityId: "",
    courseIndex: "",
    learningMode: "Online",
    session: "July 2026",
    paymentPlan: "Installments",
    amountPayingNow: "",
    paymentMode: "UPI",
    nextDueDate: "",
  });

  // BDIT Institute Admission Form State
  const [instituteData, setInstituteData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    branch: "",
    parentName: "",
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
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUniversities();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("track") === "institute") {
        setProgramTrack("institute");
      }
    }
  }, []);

  const fetchUniversities = async () => {
    try {
      const res = await fetch("/api/admin/universities");
      if (res.ok) {
        const data = await res.json();
        setUniversities(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const selectedUniversity = universities.find(
    (u) => u._id === formData.universityId,
  );
  const selectedCourse =
    selectedUniversity && formData.courseIndex !== ""
      ? selectedUniversity.courses[Number(formData.courseIndex)]
      : null;

  const handleAcademicChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "universityId") {
      setFormData((prev) => ({
        ...prev,
        universityId: value,
        courseIndex: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInstituteChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setInstituteData((prev) => ({ ...prev, [name]: value }));
  };

  const goBack = () => {
    const isAdmin = document.cookie.includes("userRole=ADMIN");
    router.push(isAdmin ? "/admin/students" : "/counselor/leads");
  };

  // Academic Lead Submit Handler
  const handleAcademicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError("Please enter both student name and phone number.");
      return;
    }

    if (!selectedUniversity || !selectedCourse) {
      setError(
        "Please select both university and course for academic admission.",
      );
      return;
    }

    setFormLoading(true);

    setTimeout(() => {
      setSuccess(`Enquiry created successfully for ACADEMIC!`);
      setFormLoading(false);
      setTimeout(() => {
        goBack();
      }, 1200);
    }, 600);
  };

  // BDIT Institute Lead Submit Handler
  const handleInstituteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!instituteData.firstName.trim()) {
      setError("Please enter student First Name.");
      return;
    }
    if (!instituteData.mobile.trim()) {
      setError("Please enter Student / Parent Mobile number.");
      return;
    }
    if (!instituteData.course) {
      setError("Please select a course.");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch("/api/institute/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instituteData),
      });

      if (res.ok) {
        setSuccess(
          `Student Admission Enquiry for ${instituteData.firstName} ${instituteData.lastName} recorded successfully!`,
        );
        setTimeout(() => {
          goBack();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save student admission enquiry.");
      }
    } catch (err: any) {
      console.error("Error saving institute enquiry:", err);
      setError("An unexpected error occurred while saving the enquiry.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loadingUniversities) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">
          Loading university listings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-gray-800 w-full">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Enquiry</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register student for Academic Degree or BDIT Institute Course
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
        {/* 🔀 Program Track Selector */}
        <TrackSelector
          programTrack={programTrack}
          onTrackChange={setProgramTrack}
        />

        {/* Form Body */}
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

          {programTrack === "academic" ? (
            <AcademicLeadForm
              formData={formData}
              universities={universities}
              selectedUniversity={selectedUniversity}
              selectedCourse={selectedCourse}
              formLoading={formLoading}
              onInputChange={handleAcademicChange}
              onSubmit={handleAcademicSubmit}
              onCancel={goBack}
            />
          ) : (
            <InstituteLeadForm
              instituteData={instituteData}
              formLoading={formLoading}
              onInputChange={handleInstituteChange}
              onSubmit={handleInstituteSubmit}
              onCancel={goBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
