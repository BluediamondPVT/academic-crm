import React from 'react';
import { User, Phone, Building, X, Mail, MapPin, Calendar, MessageSquare, CreditCard, Clock, Receipt } from 'lucide-react';
import { StudentRecord } from '../types';

interface ViewStudentModalProps {
  student: StudentRecord | null;
  onClose: () => void;
}

export default function ViewStudentModal({ student, onClose }: ViewStudentModalProps) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#112a46] text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <User className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{student.name}</h3>
              <p className="text-xs text-blue-200">
                Student Enrollment &amp; Course Allocation Details
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Personal Information
            </h4>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Student Name</span>
                <span className="text-sm font-bold text-[#112a46] flex items-center gap-1.5 mt-0.5">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  {student.name}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Phone Number</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {student.phoneNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Email Address</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {student.email || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">City</span>
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {student.city}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Enrollment Date</span>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Status</span>
                <span
                  className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.status === 'Admission'
                      ? 'bg-green-100 text-green-700'
                      : student.status === 'Lost'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {student.status || 'Active On Call'}
                </span>
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Counselor Remarks &amp; History</span>
              {student.remarkHistory && student.remarkHistory.length > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded-full font-bold">
                  {student.remarkHistory.length} log{student.remarkHistory.length > 1 ? 's' : ''}
                </span>
              )}
            </h4>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              {student.remarkHistory && student.remarkHistory.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-205">
                  {/* Map through history in reverse (newest first) */}
                  {[...student.remarkHistory].reverse().map((hist, idx) => (
                    <div key={idx} className="flex gap-3 relative">
                      {/* Timeline dot */}
                      <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 z-10">
                        <MessageSquare className="h-3 w-3 text-indigo-600" />
                      </div>
                      <div className="space-y-1 w-full pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] bg-gray-200/60 text-gray-600 px-2 py-0.5 rounded font-semibold">
                            {new Date(hist.updatedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            {new Date(hist.updatedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {hist.status && (
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                              hist.status === 'Admission'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : hist.status === 'Lost'
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : hist.status === 'Hold'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {hist.status}
                            </span>
                          )}
                          {idx === 0 && (
                            <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold border border-green-100">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-800 bg-white border border-gray-100 rounded-lg p-3 mt-1 shadow-sm leading-relaxed whitespace-pre-wrap">
                          {hist.remark}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Last Remark Change:</span>
                      {student.remarkUpdatedAt ? (
                        <span className="text-[10px] bg-gray-200/60 text-gray-600 px-2 py-0.5 rounded font-semibold">
                          {new Date(student.remarkUpdatedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          {new Date(student.remarkUpdatedAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            })}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">No date recorded</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-800 bg-white border border-gray-100 rounded-lg p-3 mt-1.5 shadow-sm max-w-2xl leading-relaxed whitespace-pre-wrap">
                      {student.remark ? (
                        student.remark
                      ) : (
                        <span className="text-gray-400 italic">No remark provided yet. Use the Edit option to update.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* University & Course Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Allocated University &amp; Course
            </h4>
            <div className="bg-linear-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-600" />
                <div>
                  <span className="text-xs text-gray-400 block font-medium">University</span>
                  <span className="text-sm font-bold text-indigo-900">
                    {student.universityName}
                  </span>
                </div>
              </div>

              <div className="border-t border-blue-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Course &amp; Specialization</span>
                  <span className="text-sm font-bold text-[#112a46]">
                    {student.courseName}
                  </span>
                  {student.specialization && (
                    <span className="ml-2 inline-block text-xs text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-medium">
                      {student.specialization}
                    </span>
                  )}
                </div>
                {student.duration && (
                  <div className="text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-blue-100 shadow-xs">
                    Duration: {student.duration} Years
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fee Structure Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Fee Structure &amp; Financial Summary</span>
              {student.payoutPercentage !== undefined && student.payoutPercentage > 0 && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                  Payout Ratio: {student.payoutPercentage}%
                </span>
              )}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 font-medium block">Total Course Fee</span>
                <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                  {student.totalFee
                    ? `₹${student.totalFee.toLocaleString('en-IN')}`
                    : 'N/A'}
                </span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
                <span className="text-xs text-emerald-600 font-bold block">Total Paid</span>
                <span className="text-base font-extrabold text-emerald-950 mt-1 block">
                  {student.totalPaid ? `₹${student.totalPaid.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>

              <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3.5">
                <span className="text-xs text-rose-600 font-bold block">Remaining Fee</span>
                <span className="text-base font-extrabold text-rose-950 mt-1 block">
                  {student.remainingFee !== undefined ? `₹${student.remainingFee.toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-3.5">
                <span className="text-xs text-indigo-300 font-medium block">Our Profit</span>
                <span className="text-base font-extrabold text-indigo-200 mt-1 block">
                  {student.totalPaid && student.payoutPercentage
                    ? `₹${Math.round((student.totalPaid * student.payoutPercentage) / 100).toLocaleString('en-IN')}`
                    : '₹0'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-xs text-gray-400 font-medium block">Yearly Fee</span>
                <span className="text-sm font-bold text-gray-700 mt-0.5 block">
                  {student.yearFee ? `₹${student.yearFee.toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-xs text-gray-400 font-medium block">Semester Fee</span>
                <span className="text-sm font-bold text-gray-700 mt-0.5 block">
                  {student.semesterFee ? `₹${student.semesterFee.toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Installments History Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Payment &amp; Installments History</span>
              {student.payments && student.payments.length > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  {student.payments.length} payment{student.payments.length > 1 ? 's' : ''} recorded
                </span>
              )}
            </h4>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              {student.payments && student.payments.length > 0 ? (
                <div className="space-y-3">
                  {student.payments.map((pmt, idx) => {
                    const cumulativePaid = student.payments!
                      .slice(0, idx + 1)
                      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
                    const totalCourseFee = Number(student.totalFee || 0);
                    const balanceAfter = Math.max(0, totalCourseFee - cumulativePaid);

                    return (
                      <div key={idx} className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs hover:border-indigo-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                              Installment #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {pmt.paymentType || 'Payment'} Plan
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span>
                              {new Date(pmt.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}{' '}
                              {new Date(pmt.date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                          <div>
                            <span className="text-gray-400 block font-medium">Amount Paid</span>
                            <span className="text-sm font-black text-emerald-600 block mt-0.5">
                              ₹{pmt.amount ? pmt.amount.toLocaleString('en-IN') : '0'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Remaining Balance</span>
                            <span className="text-sm font-black text-rose-600 block mt-0.5">
                              ₹{balanceAfter.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Payment Mode</span>
                            <span className={`inline-block mt-0.5 font-bold text-xs px-2 py-0.5 rounded ${
                              pmt.paymentMode === 'UPI'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : pmt.paymentMode === 'Bank'
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {pmt.paymentMode || 'UPI'}
                            </span>
                          </div>
                        </div>

                        {pmt.nextDueDate && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 text-xs flex items-center justify-between text-gray-700">
                            <span className="font-medium text-gray-500">Next Due Date:</span>
                            <span className="font-bold">
                              {new Date(pmt.nextDueDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}

                        {pmt.remark && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/80 rounded-lg p-2 flex items-start gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span><strong className="text-gray-700">Note:</strong> {pmt.remark}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : student.totalPaid && student.totalPaid > 0 ? (
                <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                        Installment #1
                      </span>
                      <span className="text-xs font-bold text-slate-700">Admission Initial Payment</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div>
                      <span className="text-gray-400 block font-medium">Paid Amount</span>
                      <span className="text-sm font-black text-emerald-600 block mt-0.5">
                        ₹{student.totalPaid.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Remaining Balance</span>
                      <span className="text-sm font-black text-rose-600 block mt-0.5">
                        ₹{(student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - student.totalPaid)).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Payment Mode</span>
                      <span className="inline-block mt-0.5 font-bold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                        UPI / Bank
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic py-2 text-center">
                  No payment transaction recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
