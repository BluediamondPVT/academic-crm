'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, MapPin, Phone, Globe, DollarSign, GraduationCap, Award, 
  Loader2, X, Plus, CheckCircle, AlertCircle, ArrowLeft, Save,
  ExternalLink, Sparkles
} from 'lucide-react';

interface Course {
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
}

interface UniversityFormData {
  name: string;
  aggregation: string;
  location: string;
  contactPersonMobile: string;
  modeOfLearning: 'Online' | 'Distance' | 'Regular';
  payout: string;
  websiteUrl: string;
}

export default function EditUniversityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [formData, setFormData] = useState<UniversityFormData>({
    name: '',
    aggregation: '',
    location: '',
    contactPersonMobile: '',
    modeOfLearning: 'Regular',
    payout: '',
    websiteUrl: '',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState({
    name: '',
    specialization: '',
    duration: '',
    totalFee: '',
    yearFee: '',
    semesterFee: '',
  });
  
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchUniversityDetails(id);
    }
  }, [id]);

  const fetchUniversityDetails = async (universityId: string) => {
    setLoadingData(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/universities/${universityId}`);
      if (!res.ok) {
        throw new Error('Failed to load university details');
      }
      const data = await res.json();
      setFormData({
        name: data.name || '',
        aggregation: data.aggregation || '',
        location: data.location || '',
        contactPersonMobile: data.contactPersonMobile || '',
        modeOfLearning: data.modeOfLearning || 'Regular',
        payout: data.payout || '',
        websiteUrl: data.websiteUrl || '',
      });
      
      const fetchedCourses = Array.isArray(data.courses) ? data.courses.map((c: any) => {
        if (typeof c === 'string') {
          return {
            name: c,
            specialization: '',
            duration: 3,
            totalFee: 0,
            yearFee: 0,
            semesterFee: 0
          };
        }
        return c;
      }) : [];
      setCourses(fetchedCourses);
    } catch (err: any) {
      setError(err.message || 'Error fetching university');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
  };

  const handleCourseFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseForm(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate yearFee and semesterFee
      if (name === 'totalFee' || name === 'duration') {
        const total = Number(updated.totalFee);
        const dur = Number(updated.duration);
        if (!isNaN(total) && !isNaN(dur) && dur > 0) {
          const yrFee = Math.round(total / dur);
          const semFee = Math.round(yrFee / 2);
          updated.yearFee = String(yrFee);
          updated.semesterFee = String(semFee);
        }
      }
      return updated;
    });
    setSuccess('');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, specialization, duration, totalFee, yearFee, semesterFee } = courseForm;
    
    if (!name || !duration || !totalFee || !yearFee || !semesterFee) {
      alert('Please fill out all course details (Name, Duration, Total Fee, Year Fee, Semester Fee).');
      return;
    }

    const newCourse: Course = {
      name: name.trim(),
      specialization: specialization.trim() || undefined,
      duration: Number(duration),
      totalFee: Number(totalFee),
      yearFee: Number(yearFee),
      semesterFee: Number(semesterFee),
    };

    const isDuplicate = courses.some(
      c => c.name.toLowerCase() === newCourse.name.toLowerCase() && 
           c.specialization?.toLowerCase() === newCourse.specialization?.toLowerCase()
    );
    
    if (isDuplicate) {
      alert('This course/specialization has already been added.');
      return;
    }
    
    setCourses([...courses, newCourse]);
    setCourseForm({
      name: '',
      specialization: '',
      duration: '',
      totalFee: '',
      yearFee: '',
      semesterFee: '',
    });
    setSuccess('');
  };

  const handleRemoveCourse = (indexToRemove: number) => {
    setCourses(courses.filter((_, index) => index !== indexToRemove));
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (courses.length === 0) {
      setError('Please ensure at least one course is added.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/universities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courses,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update university');
      }

      setSuccess('University updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#f8f9fc]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#112a46] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-600 animate-pulse">
          Loading university details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fc] to-[#f8f9fc] p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Top Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-gray-600 hover:text-[#112a46] text-sm font-semibold shadow-sm border border-gray-200/80 backdrop-blur-md transition-all duration-200 mb-5 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Universities</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 tracking-wide uppercase">
                  Edit Mode
                </span>
                {formData.modeOfLearning && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      formData.modeOfLearning === 'Regular'
                        ? 'bg-green-100 text-green-700'
                        : formData.modeOfLearning === 'Online'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {formData.modeOfLearning}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#112a46] tracking-tight mt-2 flex items-center gap-3">
                {formData.name || 'Edit University'}
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Update university profile, contact details, payout structure, and offered courses.
              </p>
            </div>

            {formData.websiteUrl && (
              <a
                href={formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 shadow-sm transition-all"
              >
                <span>Visit Website</span>
                <ExternalLink className="h-4 w-4 text-gray-500" />
              </a>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-bold">Unable to save changes</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="text-sm text-emerald-900">
                <p className="font-bold">{success}</p>
                <p className="text-xs text-emerald-700">All modifications have been saved to the database.</p>
              </div>
            </div>
            <Link
              href="/admin/universities"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              View All Universities
            </Link>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Details Card */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 overflow-hidden">
            <div className="px-7 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Building className="h-5 w-5 text-[#112a46]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#112a46]">General Information</h2>
                  <p className="text-xs text-gray-500">Core identity and accreditation details</p>
                </div>
              </div>
            </div>

            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  University Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Oxford University"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Aggregation */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Aggregation / Affiliation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Award className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="aggregation"
                    required
                    value={formData.aggregation}
                    onChange={handleInputChange}
                    placeholder="e.g. UGC, AICTE, NAAC A+"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. London, UK"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Contact Mobile */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Contact Person Mobile <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contactPersonMobile"
                    required
                    value={formData.contactPersonMobile}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic & Financial Card */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 overflow-hidden">
            <div className="px-7 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#112a46]">Academic & Financial Setup</h2>
                  <p className="text-xs text-gray-500">Learning mode, web presence, and commission payout</p>
                </div>
              </div>
            </div>

            <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mode of Learning */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Mode of Learning <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="modeOfLearning"
                    required
                    value={formData.modeOfLearning}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none appearance-none"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Online">Online</option>
                    <option value="Distance">Distance</option>
                  </select>
                </div>
              </div>

              {/* Payout */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Payout Structure <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="payout"
                    required
                    value={formData.payout}
                    onChange={handleInputChange}
                    placeholder="e.g. 15% per admission, Flat $600"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="websiteUrl"
                    required
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.example.edu"
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] text-sm font-medium text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 overflow-hidden">
            <div className="px-7 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#112a46]">Offered Courses & Programs</h2>
                  <p className="text-xs text-gray-500">Manage available degrees and certifications</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              </span>
            </div>

            <div className="p-7 space-y-5">
              {/* Course Entry Form */}
              <div className="p-5 bg-gray-50/60 border border-gray-200/80 rounded-2xl space-y-4">
                <h3 className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                  Add New Course Detail
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Course Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={courseForm.name}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. BBA, BCA, MBA"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Specialization / Full Name
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={courseForm.specialization}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. Finance, Physics/Chemistry"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Duration (Years) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      max="10"
                      value={courseForm.duration}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. 3"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>

                  {/* Total Fee */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Total Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="totalFee"
                      min="0"
                      value={courseForm.totalFee}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. 199200"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>

                  {/* Per Year Fee */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Per Year Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearFee"
                      min="0"
                      value={courseForm.yearFee}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. 66400"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>

                  {/* Semester Fee */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Semester Fee (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="semesterFee"
                      min="0"
                      value={courseForm.semesterFee}
                      onChange={handleCourseFormChange}
                      placeholder="e.g. 33200"
                      className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#112a46]/20 focus:border-[#112a46] transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="px-6 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm outline-none"
                  >
                    <Plus className="h-4 w-4" />
                    Add Course to List
                  </button>
                </div>
              </div>

              {/* Courses List Table */}
              <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200">Course Name</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200">Specialization</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200 text-center">Duration</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200 text-right">Total Fee</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200 text-right">Year Fee</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200 text-right">Sem Fee</th>
                      <th className="px-4 py-3 font-bold text-[#112a46] border-b border-gray-200 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400 font-medium italic">
                          No courses added to this university yet.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-800">{course.name}</td>
                          <td className="px-4 py-3 text-gray-500">{course.specialization || 'N/A'}</td>
                          <td className="px-4 py-3 text-center text-gray-600 font-semibold">{course.duration} Yrs</td>
                          <td className="px-4 py-3 text-right text-gray-800 font-bold">₹{course.totalFee.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-right text-gray-600 font-semibold">₹{course.yearFee.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-right text-gray-600 font-semibold">₹{course.semesterFee.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse(index)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove Course"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sticky Footer / Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/admin/universities"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save University Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
