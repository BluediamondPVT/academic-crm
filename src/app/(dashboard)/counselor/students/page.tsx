'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { StudentRecord, University } from './types';
import StudentStats from './components/StudentStats';
import StudentFilters from './components/StudentFilters';
import StudentsTable from './components/StudentsTable';
import AddStudentModal from './components/AddStudentModal';
import ViewStudentModal from './components/ViewStudentModal';

export default function CounselorStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentToView, setSelectedStudentToView] = useState<StudentRecord | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('ALL');

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

  // Filter students based on search and university dropdown
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUniversity =
      filterUniversity === 'ALL' || student.universityId === filterUniversity;

    return matchesSearch && matchesUniversity;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-1 font-sans text-gray-800">
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
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 group"
        >
          <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Add Students
        </button>
      </div>

      {/* Overview Stats */}
      <StudentStats students={students} universities={universities} />

      {/* Filter & Search Controls */}
      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterUniversity={filterUniversity}
        onFilterUniversityChange={setFilterUniversity}
        universities={universities}
      />

      {/* Students Table */}
      <StudentsTable
        students={filteredStudents}
        loading={loading}
        onSelectStudent={setSelectedStudentToView}
      />

      {/* Add Student Modal Form */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        universities={universities}
        onSuccess={fetchData}
      />

      {/* View Student Details Modal */}
      <ViewStudentModal
        student={selectedStudentToView}
        onClose={() => setSelectedStudentToView(null)}
      />
    </div>
  );
}
