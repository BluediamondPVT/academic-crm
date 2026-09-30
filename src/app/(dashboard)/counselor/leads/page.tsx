'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentRecord, University, InstituteRecord } from './types';
import { INSTITUTE_COURSES, DEFAULT_INSTITUTE_RECORDS } from './constants';
import TrackSwitcherTabs from './components/TrackSwitcherTabs';
import AcademicView from './components/AcademicView';
import InstituteView from './components/InstituteView';

export default function CounselorStudentsPage() {
  const router = useRouter();

  // 🔀 Active Track: 'academic' | 'institute'
  const [activeTrack, setActiveTrack] = useState<'academic' | 'institute'>('academic');

  // Academic State
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUniversity, setFilterUniversity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // BDIT Institute State
  const [instituteRecords, setInstituteRecords] = useState<InstituteRecord[]>([]);
  const [instituteLoading, setInstituteLoading] = useState(false);
  const [instituteSearch, setInstituteSearch] = useState('');
  const [instituteFilterCourse, setInstituteFilterCourse] = useState('ALL');
  const [instituteFilterSource, setInstituteFilterSource] = useState('ALL');
  const [instituteFilterStatus, setInstituteFilterStatus] = useState('ALL');

  useEffect(() => {
    setIsAdmin(document.cookie.includes('userRole=ADMIN'));
    fetchData();
    loadInstituteRecords();
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

  const loadInstituteRecords = async () => {
    setInstituteLoading(true);
    try {
      const res = await fetch('/api/institute/students');
      if (res.ok) {
        const data = await res.json();
        setInstituteRecords(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading institute records:', err);
    } finally {
      setInstituteLoading(false);
    }
  };

  const handleInstituteStatusUpdate = async (recordId: string, newStatus: string) => {
    // Optimistic UI update
    setInstituteRecords(prev =>
      prev.map(r => ((r._id === recordId || r.id === recordId) ? { ...r, status: newStatus } : r))
    );

    try {
      const res = await fetch(`/api/institute/students/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        loadInstituteRecords();
      }
    } catch (err) {
      console.error('Error updating institute status:', err);
      loadInstituteRecords();
    }
  };

  const handleInstituteDelete = async (record: InstituteRecord) => {
    const recordId = record._id || record.id;
    if (!recordId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete enquiry record for ${record.firstName} ${record.lastName || ''}?`
    );
    if (!confirmDelete) return;

    // Optimistic delete
    setInstituteRecords(prev => prev.filter(r => r._id !== recordId && r.id !== recordId));

    try {
      const res = await fetch(`/api/institute/students/${recordId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete institute record.');
        loadInstituteRecords();
      }
    } catch (err) {
      console.error('Error deleting institute record:', err);
      alert('An error occurred while deleting the record.');
      loadInstituteRecords();
    }
  };

  // Filter Academic students
  const filteredStudents = students.filter(student => {
    if (!isAdmin && student.status === 'Admission') {
      return false;
    }

    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.city && student.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesUniversity =
      filterUniversity === 'ALL' || student.universityId === filterUniversity;

    const matchesStatus =
      filterStatus === 'ALL' || (student.status || 'New Lead') === filterStatus;

    return matchesSearch && matchesUniversity && matchesStatus;
  });

  // Filter Institute records
  const filteredInstituteRecords = instituteRecords.filter(r => {
    const fullName = `${r.firstName} ${r.middleName || ''} ${r.lastName || ''}`.toLowerCase();
    const matchesSearch =
      !instituteSearch ||
      fullName.includes(instituteSearch.toLowerCase()) ||
      r.mobile.includes(instituteSearch) ||
      (r.course && r.course.toLowerCase().includes(instituteSearch.toLowerCase())) ||
      (r.city && r.city.toLowerCase().includes(instituteSearch.toLowerCase()));

    const matchesCourse =
      instituteFilterCourse === 'ALL' || r.course === instituteFilterCourse;

    const matchesSource =
      instituteFilterSource === 'ALL' || r.enquiredFrom === instituteFilterSource;

    const matchesStatus =
      instituteFilterStatus === 'ALL' || (r.status || 'New Lead') === instituteFilterStatus;

    return matchesSearch && matchesCourse && matchesSource && matchesStatus;
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
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete student record.');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('An error occurred while deleting the student record.');
    }
  };

  const handleAcademicStatusClick = (statusName: string) => {
    if (statusName === 'Total Enquiries') {
      setFilterStatus('ALL');
    } else if (statusName === 'Active Universities') {
      // No action
    } else {
      setFilterStatus(prev => (prev === statusName ? 'ALL' : statusName));
    }
  };

  const handleInstituteStatusClick = (statusName: string) => {
    if (statusName === 'Total Enquiries') {
      setInstituteFilterStatus('ALL');
    } else {
      setInstituteFilterStatus(prev => (prev === statusName ? 'ALL' : statusName));
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* 🔀 Program Track Switcher Tabs */}
      <TrackSwitcherTabs
        activeTrack={activeTrack}
        onTrackChange={track => {
          setActiveTrack(track);
          if (track === 'academic') {
            setFilterStatus('ALL');
          } else {
            setInstituteFilterStatus('ALL');
          }
        }}
      />

      {/* Main Track View */}
      {activeTrack === 'academic' ? (
        <AcademicView
          students={students}
          universities={universities}
          filteredStudents={filteredStudents}
          loading={loading}
          isAdmin={isAdmin}
          filterStatus={filterStatus}
          onFilterStatusChange={handleAcademicStatusClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterUniversity={filterUniversity}
          onFilterUniversityChange={setFilterUniversity}
          onSelectStudent={handleSelectStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      ) : (
        <InstituteView
          records={instituteRecords}
          filteredRecords={filteredInstituteRecords}
          loading={instituteLoading}
          activeStatus={instituteFilterStatus}
          onStatusClick={handleInstituteStatusClick}
          searchTerm={instituteSearch}
          onSearchChange={setInstituteSearch}
          filterCourse={instituteFilterCourse}
          onFilterCourseChange={setInstituteFilterCourse}
          filterSource={instituteFilterSource}
          onFilterSourceChange={setInstituteFilterSource}
          courses={INSTITUTE_COURSES}
          onDeleteRecord={handleInstituteDelete}
          onUpdateStatus={handleInstituteStatusUpdate}
        />
      )}
    </div>
  );
}
