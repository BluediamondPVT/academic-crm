'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentRecord, University } from './types';
import StudentStats from './components/StudentStats';
import StudentFilters from './components/StudentFilters';
import StudentsTable from './components/StudentsTable';

export default function CounselorStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('ALL');

  useEffect(() => {
    setIsAdmin(document.cookie.includes('userRole=ADMIN'));
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

  const handleSelectStudent = (student: StudentRecord) => {
    router.push(`/counselor/leads/view/${student._id}`);
  };

  const handleEditStudent = (student: StudentRecord) => {
    router.push(`/counselor/leads/edit/${student._id}`);
  };

  const handleDeleteStudent = async (student: StudentRecord) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the enquiry record for ${student.name}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData(); // Refresh the list
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete student record.');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('An error occurred while deleting the student record.');
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight">
            Student Management
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Enroll students and allocate university courses according to university listings
          </p>
        </div>

        <Link
          href="/counselor/leads/create"
          className="px-5 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 group"
        >
          <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Add Enquiry
        </Link>
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
        onSelectStudent={handleSelectStudent}
        onEditStudent={handleEditStudent}
        isAdmin={isAdmin}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  );
}
