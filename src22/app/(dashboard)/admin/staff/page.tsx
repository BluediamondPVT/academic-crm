'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Lock,
  User,
  Trash2,
  Edit,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Key,
  Shield,
  GraduationCap,
  Headset,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { ROLES } from '@/config/roles';

interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive?: boolean;
}

export default function StaffPage() {
  const [counselors, setCounselors] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleTab, setSelectedRoleTab] = useState<'ALL' | 'COUNSELOR' | 'ACADEMIC' | 'STAFF'>('ALL');

  // New staff form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.COUNSELOR as string,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit modal state
  const [editingCounselor, setEditingCounselor] = useState<StaffUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.COUNSELOR as string,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Delete modal state
  const [deletingCounselor, setDeletingCounselor] = useState<StaffUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/counselors');
      if (!res.ok) {
        throw new Error('Failed to fetch staff members');
      }
      const data = await res.json();
      setCounselors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching staff records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/counselors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create staff member');
      }

      setSuccess(data.message || 'Staff member created successfully!');
      setFormData({ name: '', email: '', password: '', role: ROLES.COUNSELOR });
      fetchCounselors();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (counselor: StaffUser) => {
    setEditingCounselor(counselor);
    setEditFormData({
      name: counselor.name,
      email: counselor.email,
      password: '',
      role: counselor.role || ROLES.COUNSELOR,
    });
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCounselor) return;

    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const payload: any = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
      };
      if (editFormData.password.trim().length > 0) {
        payload.password = editFormData.password.trim();
      }

      const res = await fetch(`/api/admin/counselors/${editingCounselor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update staff member');
      }

      setUpdateSuccess('Staff details updated successfully!');
      fetchCounselors();
      setTimeout(() => {
        setEditingCounselor(null);
      }, 1200);
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCounselor) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/counselors/${deletingCounselor._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete staff member');
      }

      setDeletingCounselor(null);
      fetchCounselors();
    } catch (err: any) {
      alert(err.message || 'Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter staff by Tab and Search
  const filteredCounselors = counselors.filter((c) => {
    const matchesRole =
      selectedRoleTab === 'ALL' ? true : c.role === selectedRoleTab;

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const counselorCount = counselors.filter((c) => c.role === ROLES.COUNSELOR).length;
  const academicCount = counselors.filter((c) => c.role === ROLES.ACADEMIC).length;
  const staffCount = counselors.filter((c) => c.role === ROLES.STAFF).length;

  return (
    <div className="space-y-6 font-sans text-gray-800 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#112a46] tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-600" />
            Staff & Counselor Management
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Manage Counselor sales agents and Academic Operations team members
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
            <Headset className="h-3.5 w-3.5" />
            Counselors: <strong className="font-bold">{counselorCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            Academic Team: <strong className="font-bold">{academicCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Staff: <strong className="font-bold">{staffCount}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Form + Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Staff Form Card */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-4">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Add New Staff Member</h2>
                <p className="text-[11px] text-gray-400 font-medium">Create counselor or academic account</p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 mb-4 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-50 p-3 mb-4 border border-green-200 flex items-center gap-2 text-green-700 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@bditacademic.com"
                    className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Role Assignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.COUNSELOR })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.role === ROLES.COUNSELOR
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs ring-1 ring-indigo-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Headset className="h-3.5 w-3.5" />
                    <span>Counselor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.ACADEMIC })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.role === ROLES.ACADEMIC
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs ring-1 ring-purple-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Academic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: ROLES.STAFF })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.role === ROLES.STAFF
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs ring-1 ring-emerald-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Staff (Tasks)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters..."
                    className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Create Staff Account</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
            <p className="font-semibold text-slate-700 mb-0.5">Role Permissions:</p>
            <p className="text-[10px]">
              • <strong>Counselor:</strong> Dedicated leads & admissions registration for assigned students.
            </p>
            <p className="text-[10px]">
              • <strong>Academic:</strong> Full admissions access, partner universities, and student operations.
            </p>
            <p className="text-[10px]">
              • <strong>Staff:</strong> Operational members (like SEO) who receive and manage tasks in their Workspace.
            </p>
          </div>
        </div>

        {/* Staff Directory Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSelectedRoleTab('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRoleTab === 'ALL'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({counselors.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleTab('COUNSELOR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRoleTab === 'COUNSELOR'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Counselors ({counselorCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleTab('ACADEMIC')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRoleTab === 'ACADEMIC'
                    ? 'bg-white text-purple-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Academic Team ({academicCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleTab('STAFF')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRoleTab === 'STAFF'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Staff ({staffCount})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Directory Content List */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mb-2 text-indigo-600" />
              <p className="text-xs font-medium">Loading staff records...</p>
            </div>
          ) : filteredCounselors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-gray-400 text-center">
              <Users className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No staff members found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                {searchQuery
                  ? 'No records match your search criteria. Try a different query.'
                  : 'Add a new counselor or academic member using the form on the left.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCounselors.map((counselor) => {
                const isAcademic = counselor.role === ROLES.ACADEMIC;
                return (
                  <div
                    key={counselor._id}
                    className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              counselor.role === ROLES.ACADEMIC
                                ? 'bg-purple-100 text-purple-700'
                                : counselor.role === ROLES.STAFF
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {counselor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xs font-extrabold text-slate-800 leading-tight">
                              {counselor.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5 select-all">
                              {counselor.email}
                            </p>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${
                            counselor.role === ROLES.ACADEMIC
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : counselor.role === ROLES.STAFF
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {counselor.role === ROLES.ACADEMIC ? (
                            <>
                              <GraduationCap className="h-3 w-3" />
                              <span>Academic</span>
                            </>
                          ) : counselor.role === ROLES.STAFF ? (
                            <>
                              <Users className="h-3 w-3" />
                              <span>Staff</span>
                            </>
                          ) : (
                            <>
                              <Headset className="h-3 w-3" />
                              <span>Counselor</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50">
                        <span>Joined:</span>
                        <span className="font-semibold text-gray-600">
                          {new Date(counselor.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(counselor)}
                        title="Edit Details"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCounselor(counselor)}
                        title="Delete Staff"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Counselor Modal */}
      {editingCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 relative">
            <button
              onClick={() => setEditingCounselor(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Edit Staff Member</h3>
                <p className="text-xs text-gray-400 font-medium">Update role, details, or password</p>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {updateError && (
                <div className="rounded-xl bg-red-50 p-3 border border-red-200 flex items-center gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{updateError}</span>
                </div>
              )}

              {updateSuccess && (
                <div className="rounded-xl bg-green-50 p-3 border border-green-200 flex items-center gap-2 text-green-700 text-xs font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  <span>{updateSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Role Assignment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, role: ROLES.COUNSELOR })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      editFormData.role === ROLES.COUNSELOR
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Headset className="h-3.5 w-3.5" />
                    <span>Counselor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, role: ROLES.ACADEMIC })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      editFormData.role === ROLES.ACADEMIC
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Academic</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  New Password <span className="text-gray-400 font-normal lowercase">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <Key className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    minLength={6}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    placeholder="Enter new password..."
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCounselor(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Delete Staff Member?</h3>
            <p className="text-xs text-gray-500 font-medium mb-6">
              Are you sure you want to remove <span className="font-bold text-slate-800">{deletingCounselor.name}</span> ({deletingCounselor.role})? This account will be deleted permanently.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingCounselor(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
