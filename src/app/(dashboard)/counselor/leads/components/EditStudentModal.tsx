'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Landmark,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Edit3,
  Lock,
} from 'lucide-react';
import { StudentRecord } from '../types';

interface EditStudentModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStudentModal({
  student,
  onClose,
  onSuccess,
}: EditStudentModalProps) {
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

  // Payment tracking states
  const [paymentType, setPaymentType] = useState<'Yearly' | 'Semester' | 'Custom'>('Yearly');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Bank' | 'Cash'>('UPI');
  const [nextDueDate, setNextDueDate] = useState<string>('');
  const [payoutPercentage, setPayoutPercentage] = useState<number | ''>('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phoneNumber: student.phoneNumber || '',
        email: student.email || '',
        remark: student.remark || '',
        city: student.city || '',
        status: student.status || 'New Lead',
      });
      setPayoutPercentage(student.payoutPercentage !== undefined ? student.payoutPercentage : '');
      setError('');
      setSuccess('');
    }
  }, [student]);

  if (!student) return null;

  const handlePaymentPlanChange = (plan: 'Yearly' | 'Semester' | 'Custom') => {
    setPaymentType(plan);
    if (plan === 'Yearly') {
      const yearly = student?.yearFee || (student?.totalFee && student?.duration ? Math.round(student.totalFee / student.duration) : student?.totalFee) || 0;
      setAmountPaid(yearly ? Number(yearly) : '');
    } else if (plan === 'Semester') {
      const sem = student?.semesterFee || (student?.totalFee && student?.duration ? Math.round(student.totalFee / (student.duration * 2)) : 0) || 0;
      setAmountPaid(sem ? Number(sem) : '');
    } else if (plan === 'Custom') {
      setAmountPaid('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'status') {
      if (value === 'Processing' || value === 'Admission') {
        const yearly = student?.yearFee || (student?.totalFee && student?.duration ? Math.round(student.totalFee / student.duration) : student?.totalFee) || 0;
        setPaymentType('Yearly');
        if ((student?.totalPaid || 0) === 0) {
          setAmountPaid(yearly ? Number(yearly) : '');
        }
        setPaymentMode('UPI');
        setNextDueDate('');
        if (value === 'Admission') {
          setPayoutPercentage(student?.payoutPercentage || 0);
        } else {
          setPayoutPercentage('');
        }
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const payload: any = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        remark: formData.remark,
        city: formData.city.trim(),
        status: formData.status,
      };

      if (formData.status === 'Processing' || formData.status === 'Admission') {
        const paidVal = Number(amountPaid) || 0;
        payload.totalPaid = (student.totalPaid || 0) + paidVal;
        if (paidVal > 0) {
          payload.paymentTransaction = {
            paymentType,
            amount: paidVal,
            paymentMode,
            nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : undefined,
          };
        }
        if (formData.status === 'Admission') {
          payload.payoutPercentage = Number(payoutPercentage) || 0;
        }
      }

      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update student');
      }

      setSuccess('Student updated successfully!');
      onSuccess();

      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[96vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#112a46] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Edit3 className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Edit Student Record</h3>
              <p className="text-xs text-blue-200">
                Update details or remark for {student.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter Email
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Landmark className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Admission Status
                </label>
                {student.status === 'Admission' && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Status Locked
                  </span>
                )}
              </div>
              <select
                name="status"                                                                       
                value={formData.status}
                onChange={handleInputChange}
                disabled={student.status === 'Admission'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
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

            {/* Direct Inline Payment Fields */}
            {formData.status === 'Admission' && (
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4 transition-all duration-300">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  Payment details for {formData.status}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Fee Payment Plan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Yearly', 'Semester', 'Custom'] as const).map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => handlePaymentPlanChange(plan)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          paymentType === plan
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-1 ring-indigo-600/20 shadow-xxs'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span>{plan}</span>
                        <span className="text-[9px] font-medium text-gray-400 mt-0.5">
                          {plan === 'Yearly'
                            ? `₹${(student.yearFee || (student.totalFee && student.duration ? Math.round(student.totalFee / student.duration) : student.totalFee || 0)).toLocaleString('en-IN')}`
                            : plan === 'Semester'
                            ? `₹${(student.semesterFee || (student.totalFee && student.duration ? Math.round(student.totalFee / (student.duration * 2)) : 0)).toLocaleString('en-IN')}`
                            : 'Custom'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Amount Paid (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Enter amount"
                        className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value="UPI">UPI / QR Code</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="Cash">Cash Payment</option>
                    </select>
                  </div>
                </div>

                {paymentType === 'Custom' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Next Due Date
                    </label>
                    <input
                      type="date"
                      value={nextDueDate}
                      onChange={(e) => setNextDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                )}

                {/* Inline Summary */}
                {(() => {
                  const totalCourseFee = Number(student.totalFee || 0);
                  const existingPaid = Number(student.totalPaid || 0);
                  const currentPaying = Number(amountPaid) || 0;
                  const remFee = Math.max(0, totalCourseFee - (existingPaid + currentPaying));
                  return (
                    <div className="bg-slate-900 rounded-xl p-3 text-white">
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div>
                          <span className="text-[8px] text-slate-400 block uppercase font-medium">Total</span>
                          <span className="text-xs font-bold block mt-0.5 text-white">
                            ₹{totalCourseFee.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-emerald-300 block uppercase font-medium">Paying Now</span>
                          <span className="text-xs font-bold block mt-0.5 text-emerald-400">
                            ₹{currentPaying.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-amber-300 block uppercase font-medium">Remaining</span>
                          <span className="text-xs font-bold block mt-0.5 text-amber-300">
                            ₹{remFee.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Remark (Adding/changing this updates remarkUpdatedAt timestamp)
                </label>
                {['Hold', 'Lost', 'Follow-Up'].includes(formData.status) && (
                  <span className="text-[11px] font-medium text-amber-600">
                    Enter reason or next action date
                  </span>
                )}
              </div>
              <div className="relative">
                <MessageCircle className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder={
                    ['Hold', 'Lost', 'Follow-Up'].includes(formData.status)
                      ? 'Enter reason or next action date...'
                      : 'Student update / remark'
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  type="text"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
