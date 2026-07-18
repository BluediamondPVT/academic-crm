'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Landmark,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Edit3,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { StudentRecord } from '../../types';

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLeadPage({ params }: EditLeadPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromAdmissions = searchParams.get('from') === 'admissions';
  const [studentId, setStudentId] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    remark: '',
    city: '',
    status: 'New Lead',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setIsAdmin(document.cookie.includes('userRole=ADMIN'));
  }, []);

  useEffect(() => {
    params.then(res => {
      setStudentId(res.id);
    });
  }, [params]);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setFormData({
          name: data.name || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          remark: data.status === 'Admission' ? (data.admissionRemark || '') : (data.remark || ''),
          city: data.city || '',
          status: data.status || 'New Lead',
        });
      } else {
        setError('Failed to fetch student record details.');
      }
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('An error occurred while loading student details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        status: value,
        remark: value === 'Admission'
          ? (student?.admissionRemark || '')
          : (student?.remark || '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const goBack = () => {
    router.push(fromAdmissions ? '/admissions' : (isAdmin ? '/admin/students' : '/counselor/leads'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      setError('Please enter both student name and phone number.');
      return;
    }

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        remark: formData.remark,
        city: formData.city.trim(),
        status: formData.status,
      };

      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update student');
      }

      setSuccess('Enquiry updated successfully!');

      setTimeout(() => {
        goBack();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#112a46]" />
        <p className="text-xs text-gray-400 mt-2">Loading lead details...</p>
      </div>
    );
  }

  // Determine disabled states based on the role and original values
  const isNameDisabled = !isAdmin && !!student?.name;
  const isPhoneDisabled = !isAdmin && !!student?.phoneNumber;
  const isEmailDisabled = !isAdmin && !!student?.email;
  const isCityDisabled = !isAdmin && !!student?.city;

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">View / Edit Enquiry</h1>
          <p className="text-sm text-gray-500 mt-1">Update details for {student?.name}</p>
        </div>
        <button
          onClick={goBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Enquiry Details */}
            <div>
              <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100 mb-4">
                Enquiry Details
              </h3>
              
              {/* Enquiry Form Fields */}
              <div className="space-y-6">
                
                {/* Row 1: Name, Phone, City (3 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        required
                        disabled={isNameDisabled}
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isNameDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phoneNumber"
                        required
                        disabled={isPhoneDisabled}
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Phone"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isPhoneDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* City field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name="city"
                        required
                        disabled={isCityDisabled}
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter City"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                        type="text"
                      />
                      {isCityDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Email, Status (2 inputs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        disabled={isEmailDisabled}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-150 pr-8"
                      />
                      {isEmailDisabled && (
                        <Lock className="h-3.5 w-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Status selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Admission Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-semibold text-gray-800 transition-all bg-white"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Active On Call">Active On Call</option>
                      <option value="Visit">Visit</option>
                      <option value="Online Counseling">Online Counseling</option>
                      <option value="Follow-Up">Follow-Up</option>
                      <option value="Processing">Processing</option>
                      <option value="Hold">Hold</option>
                      
                      <option value="Lost">Lost</option>
                      <option value="Admission">Admission</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Remark (last remark) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Remark / Counselor Log Notes
                    </label>
                    {['Hold', 'Lost', 'Follow-Up'].includes(formData.status) && (
                      <span className="text-[11px] font-medium text-amber-600">
                        Enter reason or next action date
                      </span>
                    )}
                  </div>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    placeholder={
                      ['Hold', 'Lost', 'Follow-Up'].includes(formData.status)
                        ? 'Enter reason or next action date...'
                        : 'Enter counselor notes and updates here...'
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all text-gray-800 leading-relaxed resize-y min-h-[100px]"
                  />
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2 bg-[#112a46] hover:bg-[#1a3d66] active:scale-98 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
