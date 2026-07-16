'use client';

import React from 'react';
import { User, Phone, Building, X, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';
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
                    student.status === 'Enrolled'
                      ? 'bg-green-100 text-green-700'
                      : student.status === 'Completed'
                      ? 'bg-blue-100 text-blue-700'
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

          {/* Fee Structure */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Fee Structure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 font-medium block">Total Course Fee</span>
                <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                  {student.totalFee
                    ? `₹${student.totalFee.toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 font-medium block">Yearly Fee</span>
                <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                  {student.yearFee
                    ? `₹${student.yearFee.toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                <span className="text-xs text-gray-400 font-medium block">Semester Fee</span>
                <span className="text-base font-extrabold text-[#112a46] mt-1 block">
                  {student.semesterFee
                    ? `₹${student.semesterFee.toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>
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
