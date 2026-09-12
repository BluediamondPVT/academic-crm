'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, MapPin, Phone, Globe, DollarSign, GraduationCap, Award, 
  Loader2, X, Plus, FileText, CheckCircle, AlertTriangle, RefreshCcw, 
  Eye, Trash2, Edit2
} from 'lucide-react';

interface Course {
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
}

interface University {
  _id: string;
  name: string;
  aggregation: string;
  location: string;
  contactPersonMobile: string;
  modeOfLearning: 'Online' | 'Distance' | 'Regular';
  payout: string;
  websiteUrl: string;
  courses: Course[];
}

export default function UniversitiesDashboard() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
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
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const res = await fetch('/api/admin/universities');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setUniversities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  };

  const handleRemoveCourse = (indexToRemove: number) => {
    setCourses(courses.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (courses.length === 0) {
      setError('Please add at least one course.');
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, courses }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add university');

      setSuccess('University added successfully!');
      
      // Reset form & Refresh list
      setFormData({
        name: '', aggregation: '', location: '', contactPersonMobile: '',
        modeOfLearning: 'Regular', payout: '', websiteUrl: '',
      });
      setCourses([]);
      fetchUniversities();
      
      // Close modal after brief delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this university?')) return;
    try {
      const res = await fetch(`/api/admin/universities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUniversities(universities.filter(u => u._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate Metrics
  const totalUniversities = universities.length;
  const regularCount = universities.filter(u => u.modeOfLearning === 'Regular').length;
  const onlineCount = universities.filter(u => u.modeOfLearning === 'Online').length;
  const distanceCount = universities.filter(u => u.modeOfLearning === 'Distance').length;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans text-gray-800">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#112a46] tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Overview of your system performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
            <option>All Mode Types</option>
            <option>Regular</option>
            <option>Online</option>
            <option>Distance</option>
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add University
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Box */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden relative p-6 flex justify-between items-center group">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af] rounded-l-2xl"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">TOTAL UNIVERSITIES</p>
            <h3 className="text-3xl font-black text-[#112a46]">{totalUniversities}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        {/* Regular Box */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden relative p-6 flex justify-between items-center">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981] rounded-l-2xl"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">REGULAR</p>
            <h3 className="text-3xl font-black text-[#112a46]">{regularCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </div>

        {/* Online Box */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden relative p-6 flex justify-between items-center">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ef4444] rounded-l-2xl"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">ONLINE</p>
            <h3 className="text-3xl font-black text-[#112a46]">{onlineCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
        </div>

        {/* Distance Box */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden relative p-6 flex justify-between items-center">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f59e0b] rounded-l-2xl"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">DISTANCE</p>
            <h3 className="text-3xl font-black text-[#112a46]">{distanceCount}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center">
            <RefreshCcw className="h-5 w-5 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#112a46]">Recent Universities</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">Showing All Records</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">#</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">University Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Mode</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingData ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading data...
                  </td>
                </tr>
              ) : universities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No universities found.
                  </td>
                </tr>
              ) : (
                universities.map((uni, index) => (
                  <tr key={uni._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#112a46]">{uni.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{uni.websiteUrl}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        uni.modeOfLearning === 'Regular' ? 'bg-green-100 text-green-700' :
                        uni.modeOfLearning === 'Online' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {uni.modeOfLearning}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#112a46]">
                      {uni.contactPersonMobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {uni.location}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/universities/view/${uni._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <Link
                          href={`/admin/universities/edit/${uni._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors shadow-xs"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add University Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-[#112a46]">Add New University</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md text-sm">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">University Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="e.g. Oxford University"
                    />
                  </div>
                </div>

                {/* Aggregation Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Aggregation / Affiliation</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="aggregation"
                      required
                      value={formData.aggregation}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="e.g. UGC, AICTE, NAAC A+"
                    />
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </div>

                {/* Contact Person Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Contact Mobile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="contactPersonMobile"
                      required
                      value={formData.contactPersonMobile}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Mode of Learning Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Mode of Learning</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      name="modeOfLearning"
                      required
                      value={formData.modeOfLearning}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none appearance-none bg-white"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Online">Online</option>
                      <option value="Distance">Distance</option>
                    </select>
                  </div>
                </div>

                {/* Payout Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Payout Structure</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="payout"
                      required
                      value={formData.payout}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="e.g. 10% per admission, Flat $500"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase">Website URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="websiteUrl"
                      required
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                      placeholder="https://www.example.edu"
                    />
                  </div>
                </div>

                {/* Dynamic Courses Section */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-2 border-t border-gray-100 mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Offered Courses & Fees Details
                    </label>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-semibold">
                      {courses.length} Added
                    </span>
                  </div>
                  
                  {/* Course Entry Form */}
                  <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Course Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Course Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={courseForm.name}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. BBA, BCA, MBA"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Specialization / Full Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Specialization / Full Name</label>
                        <input
                          type="text"
                          name="specialization"
                          value={courseForm.specialization}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. Finance, Physics/Chemistry"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Duration */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Duration (Years) *</label>
                        <input
                          type="number"
                          name="duration"
                          min="1"
                          max="10"
                          value={courseForm.duration}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. 3"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Total Fee */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Total Fee (₹) *</label>
                        <input
                          type="number"
                          name="totalFee"
                          min="0"
                          value={courseForm.totalFee}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. 199200"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Per Year Fee */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Per Year Fee (₹) *</label>
                        <input
                          type="number"
                          name="yearFee"
                          min="0"
                          value={courseForm.yearFee}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. 66400"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>

                      {/* Semester Fee */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Semester Fee (₹) *</label>
                        <input
                          type="number"
                          name="semesterFee"
                          min="0"
                          value={courseForm.semesterFee}
                          onChange={handleCourseFormChange}
                          placeholder="e.g. 33200"
                          className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAddCourse}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm outline-none"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Course to List
                      </button>
                    </div>
                  </div>

                  {/* Courses List Table */}
                  <div className="border border-gray-150 rounded-xl overflow-hidden bg-white max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-gray-100/80 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150">Course Name</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150">Specialization</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150 text-center">Duration</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150 text-right">Total Fee</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150 text-right">Year Fee</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150 text-right">Sem Fee</th>
                          <th className="px-3 py-2 font-bold text-gray-600 border-b border-gray-150 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {courses.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-3 py-6 text-center text-gray-400 italic">
                              No courses added to this university yet.
                            </td>
                          </tr>
                        ) : (
                          courses.map((course, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-3 py-2 font-bold text-gray-800">{course.name}</td>
                              <td className="px-3 py-2 text-gray-500">{course.specialization || 'N/A'}</td>
                              <td className="px-3 py-2 text-center text-gray-600 font-medium">{course.duration} Yrs</td>
                              <td className="px-3 py-2 text-right text-gray-800 font-semibold">₹{course.totalFee.toLocaleString('en-IN')}</td>
                              <td className="px-3 py-2 text-right text-gray-600 font-medium">₹{course.yearFee.toLocaleString('en-IN')}</td>
                              <td className="px-3 py-2 text-right text-gray-600 font-medium">₹{course.semesterFee.toLocaleString('en-IN')}</td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourse(index)}
                                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  title="Remove Course"
                                >
                                  <X className="h-3.5 w-3.5" />
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

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save University</span>
                  )}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
