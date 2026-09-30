'use client';

import React, { useState } from 'react';
import {
  Loader2,
  Laptop,
  Phone,
  Mail,
  MapPin,
  Eye,
  Trash2,
  CheckCircle2,
  User,
  GraduationCap,
  Calendar,
  X,
} from 'lucide-react';
import { InstituteRecord } from '../types';

interface InstituteTableProps {
  records: InstituteRecord[];
  loading: boolean;
  onDeleteRecord?: (record: InstituteRecord) => void;
  onUpdateStatus?: (recordId: string, newStatus: string) => void;
}

const getInstituteStatusBadge = (status: string) => {
  switch (status) {
    case 'New Lead':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'Active On Call':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Center Visit':
    case 'Visit':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Demo / Counseling':
    case 'Online Counseling':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'Follow-Up':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Batch Processing':
    case 'Processing':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'Hold':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Lost':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Admission':
    case 'Enrolled':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function InstituteTable({
  records,
  loading,
  onDeleteRecord,
  onUpdateStatus,
}: InstituteTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<InstituteRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#112a46] flex items-center gap-2">
              <Laptop className="h-5 w-5 text-indigo-600" />
              BDIT Institute Enquiries & Admissions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Technical certification & skill-development student enquiries
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold rounded-lg self-start sm:self-auto">
            Showing {records.length} Records
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  #
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Student Name
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Contact & Parent Info
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Enrolled Course
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  City / College
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Source
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  Status
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading BDIT institute records...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="max-w-xs mx-auto py-6">
                      <Laptop className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="font-semibold text-gray-700">No Institute Enquiries Yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click &quot;Add Enquiry&quot; and choose BDIT Institute to record a new student enquiry.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => {
                  const fullName = [r.firstName, r.middleName, r.lastName]
                    .filter(Boolean)
                    .join(' ');

                  const recordId = r._id || r.id || `rec-${idx}`;
                  return (
                    <tr
                      key={recordId}
                      className="hover:bg-indigo-50/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      <td className="px-4 py-4 text-xs font-semibold text-gray-400">
                        {idx + 1}
                      </td>

                      {/* Student Name */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          {fullName}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          {r.gender && (
                            <span className="text-gray-400 font-medium">({r.gender})</span>
                          )}
                          {r.qualification && (
                            <span className="text-slate-500 font-semibold truncate max-w-[130px]">
                              {r.qualification}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact & Parent Info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                          <Phone className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{r.mobile}</span>
                        </div>
                        {r.parentName && (
                          <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[180px]">
                            Parent: <span className="font-medium text-gray-700">{r.parentName}</span>
                          </div>
                        )}
                      </td>

                      {/* Course */}
                      <td className="px-4 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 truncate max-w-[200px]">
                          {r.course || 'Technical Course'}
                        </span>
                      </td>

                      {/* City / College */}
                      <td className="px-4 py-4">
                        <div className="text-xs font-medium text-gray-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                          <span>{r.city || '—'}</span>
                        </div>
                        {r.institutionName && (
                          <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[160px]">
                            {r.institutionName}
                          </div>
                        )}
                      </td>

                      {/* Source */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                          {r.enquiredFrom || 'Walk-in'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${getInstituteStatusBadge(
                            r.status || 'New Lead'
                          )}`}
                        >
                          {r.status || 'New Lead'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-4 text-right"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(r)}
                            title="View Full Details"
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {onDeleteRecord && (
                            <button
                              type="button"
                              onClick={() => onDeleteRecord(r)}
                              title="Delete Record"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔍 Details Modal for Institute Student */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#112a46] to-[#1e40af] text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Laptop className="h-5 w-5 text-blue-200" />
                <div>
                  <h3 className="text-base font-bold">
                    {selectedRecord.firstName} {selectedRecord.lastName}
                  </h3>
                  <p className="text-xs text-blue-200">BDIT Institute Admission Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Course</span>
                  <span className="font-bold text-gray-800">{selectedRecord.course || '—'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Current Status</span>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 text-xs font-bold rounded-md border ${getInstituteStatusBadge(
                      selectedRecord.status
                    )}`}
                  >
                    {selectedRecord.status || 'New Lead'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase block">Enquired From</span>
                  <span className="font-semibold text-gray-700">{selectedRecord.enquiredFrom || 'Walk-in'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#112a46] uppercase tracking-wider">
                    Student Details
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-gray-500">Gender:</span> <span className="font-semibold text-gray-800">{selectedRecord.gender || '—'}</span></p>
                    <p><span className="text-gray-500">Date of Birth:</span> <span className="font-semibold text-gray-800">{selectedRecord.dob || '—'}</span></p>
                    <p><span className="text-gray-500">Qualification:</span> <span className="font-semibold text-gray-800">{selectedRecord.qualification || '—'}</span></p>
                    <p><span className="text-gray-500">College/School:</span> <span className="font-semibold text-gray-800">{selectedRecord.institutionName || '—'}</span></p>
                    <p><span className="text-gray-500">City:</span> <span className="font-semibold text-gray-800">{selectedRecord.city || '—'}</span></p>
                    {selectedRecord.address && (
                      <p><span className="text-gray-500">Address:</span> <span className="font-semibold text-gray-800">{selectedRecord.address}</span></p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#112a46] uppercase tracking-wider">
                    Parent & Contact Info
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-gray-500">Mobile:</span> <span className="font-bold text-indigo-600">{selectedRecord.mobile}</span></p>
                    {selectedRecord.alternateMobile && (
                      <p><span className="text-gray-500">Alternate Mobile:</span> <span className="font-semibold text-gray-800">{selectedRecord.alternateMobile}</span></p>
                    )}
                    <p><span className="text-gray-500">Parent Name:</span> <span className="font-semibold text-gray-800">{selectedRecord.parentName || '—'}</span></p>
                    {selectedRecord.fatherOccupation && (
                      <p><span className="text-gray-500">Father Occupation:</span> <span className="font-semibold text-gray-800">{selectedRecord.fatherOccupation}</span></p>
                    )}
                    {selectedRecord.parentEmail && (
                      <p><span className="text-gray-500">Parent Email:</span> <span className="font-semibold text-gray-800">{selectedRecord.parentEmail}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              {onUpdateStatus && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-600 block mb-2">Update Enquiry Status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'New Lead',
                      'Active On Call',
                      'Center Visit',
                      'Demo / Counseling',
                      'Follow-Up',
                      'Batch Processing',
                      'Hold',
                      'Lost',
                      'Admission',
                    ].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          const recordId = selectedRecord._id || selectedRecord.id;
                          if (recordId) {
                            onUpdateStatus(recordId, st);
                          }
                          setSelectedRecord(prev => (prev ? { ...prev, status: st } : null));
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${selectedRecord.status === st
                            ? 'bg-[#112a46] text-white border-[#112a46]'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
