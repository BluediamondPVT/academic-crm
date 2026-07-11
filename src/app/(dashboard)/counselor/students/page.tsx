'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Loader2,
  X,
  Phone,
  Building,
  BookOpen,
  User,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Eye
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
  modeOfLearning: string;
  courses: Course[];
}

interface StudentRecord {
  _id: string;
  name: string;
  phoneNumber: string;
  universityId: string;
  universityName: string;
  courseName: string;
  specialization?: string;
  duration?: number;
  totalFee?: number;
  yearFee?: number;
  semesterFee?: number;
  status: string;
  createdAt: string;
}

export default function CounselorStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentToView, setSelectedStudentToView] = useState<StudentRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('ALL');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    universityId: '',
    courseIndex: '',
    status: 'Enrolled',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, universitiesRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/admin/universities'),
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      }

      if (universitiesRes.ok) {
        const universitiesData = await universitiesRes.json();
        setUniversities(Array.isArray(universitiesData) ? universitiesData : []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find selected university object
  const selectedUniversity = universities.find(u => u._id === formData.universityId);

  // Find selected course object
  const selectedCourse = selectedUniversity && formData.courseIndex !== ''
    ? selectedUniversity.courses[Number(formData.courseIndex)]
    : null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'universityId') {
      // Reset course selection when university changes
      setFormData(prev => ({ ...prev, universityId: value, courseIndex: '' }));
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
      const payload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        universityId: selectedUniversity._id,
        universityName: selectedUniversity.name,
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

      setSuccess('Student added successfully!');
      fetchData();

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
        setFormData({
          name: '',
          phoneNumber: '',
          universityId: '',
          courseIndex: '',
          status: 'Enrolled',
        });
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
        if (selectedStudentToView?._id === id) {
          setSelectedStudentToView(null);
        }
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter students based on search and university dropdown
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUniversity =
      filterUniversity === 'ALL' || student.universityId === filterUniversity;

    return matchesSearch && matchesUniversity;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#112a46] tracking-tight">
            Student Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Enroll students and allocate university courses according to university listings
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setSuccess('');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 group"
        >
          <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Add Students
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af]"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Total Enrolled Students
            </p>
            <h3 className="text-3xl font-black text-[#112a46]">{students.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#10b981]"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Active Universities Available
            </p>
            <h3 className="text-3xl font-black text-[#112a46]">{universities.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <Building className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.08)] border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#6366f1]"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Courses Allocated
            </p>
            <h3 className="text-3xl font-black text-[#112a46]">
              {new Set(students.map(s => s.courseName)).size}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student, phone or course..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-gray-500 uppercase">Filter University:</span>
          <select
            value={filterUniversity}
            onChange={e => setFilterUniversity(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Universities</option>
            {universities.map(u => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#112a46]">Enrolled Students List</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
            Showing {filteredStudents.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Student Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Selected University
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Enrolled Course
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Fee / Duration
                </th>
                {/* <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Status
                </th> */}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto py-4">
                      <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-semibold text-gray-600">No students added yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click &quot;Add Students&quot; button to register a student and assign a university course.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#112a46]">{student.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Added {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        {student.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                        <Building className="h-3.5 w-3.5 text-indigo-600" />
                        {student.universityName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#112a46]">{student.courseName}</div>
                      {student.specialization && (
                        <span className="inline-block text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium mt-1">
                          {student.specialization}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>
                        {student.totalFee ? `₹${student.totalFee.toLocaleString()}` : 'N/A'}
                      </div>
                      {student.duration && (
                        <div className="text-xs text-gray-400">{student.duration} Years</div>
                      )}
                    </td>
                    {/* <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'Enrolled'
                          ? 'bg-green-100 text-green-700'
                          : student.status === 'Completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudentToView(student)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Student Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                       


                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL FORM */}
      {isModalOpen && (
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
                    Register a student & select allocated university course
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
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
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl space-y-2">
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Section */}
                {/* <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Admission Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="Lead">Lead</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div> */}

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
      )}

      {/* VIEW STUDENT DETAILS MODAL */}
      {selectedStudentToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#112a46] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <User className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedStudentToView.name}</h3>
                  <p className="text-xs text-blue-200">
                    Student Enrollment &amp; Course Allocation Details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentToView(null)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Personal Information
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Student Name</span>
                    <span className="text-sm font-bold text-[#112a46]">{selectedStudentToView.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Phone Number</span>
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {selectedStudentToView.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Enrollment Date</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedStudentToView.createdAt
                        ? new Date(selectedStudentToView.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Status</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {selectedStudentToView.status || 'Enrolled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* University & Course Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Allocated University &amp; Course
                </h4>
                <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-indigo-600" />
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">University</span>
                      <span className="text-sm font-bold text-indigo-900">
                        {selectedStudentToView.universityName}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-blue-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Course &amp; Specialization</span>
                      <span className="text-sm font-bold text-[#112a46]">
                        {selectedStudentToView.courseName}
                      </span>
                      {selectedStudentToView.specialization && (
                        <span className="ml-2 inline-block text-xs text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-medium">
                          {selectedStudentToView.specialization}
                        </span>
                      )}
                    </div>
                    {selectedStudentToView.duration && (
                      <div className="text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-xs">
                        Duration: {selectedStudentToView.duration} Years
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee Structure */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Fee Structure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                    <span className="text-xs text-gray-400 font-medium block">Total Course Fee</span>
                    <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                      {selectedStudentToView.totalFee
                        ? `₹${selectedStudentToView.totalFee.toLocaleString()}`
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                    <span className="text-xs text-gray-400 font-medium block">Yearly Fee</span>
                    <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                      {selectedStudentToView.yearFee
                        ? `₹${selectedStudentToView.yearFee.toLocaleString()}`
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                    <span className="text-xs text-gray-400 font-medium block">Semester Fee</span>
                    <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                      {selectedStudentToView.semesterFee
                        ? `₹${selectedStudentToView.semesterFee.toLocaleString()}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              {/* <button
                type="button"
                onClick={() => handleDeleteStudent(selectedStudentToView._id)}
                disabled={deletingId === selectedStudentToView._id}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deletingId === selectedStudentToView._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Student
              </button> */}

              <button
                type="button"
                onClick={() => setSelectedStudentToView(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
