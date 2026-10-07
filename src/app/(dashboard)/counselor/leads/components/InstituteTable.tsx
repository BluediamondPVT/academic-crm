'use client';

import React from 'react';
import {
  Loader2,
  Laptop,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { InstituteRecord } from '../types';

interface InstituteTableProps {
  records: InstituteRecord[];
  loading: boolean;
  isAdmin?: boolean;
  onSelectRecord?: (record: InstituteRecord) => void;
  onEditRecord?: (record: InstituteRecord) => void;
  onDeleteRecord?: (record: InstituteRecord) => void;
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
  isAdmin = true,
  onSelectRecord,
  onEditRecord,
  onDeleteRecord,
}: InstituteTableProps) {
  return (
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
                Contact & Details
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
              <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Latest Update / Remark
              </th>
              <th className="px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  Loading BDIT institute records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
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

                const latestHistory =
                  r.remarkHistory && r.remarkHistory.length > 0
                    ? r.remarkHistory[r.remarkHistory.length - 1]
                    : null;
                const latestRemark = latestHistory?.remark || r.remark;
                const latestDate = latestHistory?.updatedAt || r.remarkUpdatedAt;
                const updatedBy = latestHistory?.updatedBy || r.counselorName;

                const recordId = r._id || r.id || `rec-${idx}`;
                return (
                  <tr
                    key={recordId}
                    className="hover:bg-gray-50/50 transition-colors"
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

                    {/* Contact Info */}
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
                      {r.branch && (
                        <div className="mt-1">
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {r.branch}
                          </span>
                        </div>
                      )}
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
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${getInstituteStatusBadge(
                          r.status || 'New Lead'
                        )}`}
                      >
                        {r.status || 'New Lead'}
                      </span>
                    </td>

                    {/* Latest Update / Remark */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 max-w-[220px]">
                        {latestDate && (
                          <span className="text-[10px] font-semibold text-gray-400">
                            {updatedBy ? `${updatedBy} • ` : ''}
                            {new Date(latestDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            {new Date(latestDate).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                        {latestRemark ? (
                          <div
                            title={latestRemark}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg truncate max-w-full"
                          >
                            {latestRemark}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No remark</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onSelectRecord && (
                          <button
                            type="button"
                            onClick={() => onSelectRecord(r)}
                            title="View Student Details"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEditRecord && (
                          <button
                            type="button"
                            onClick={() => onEditRecord(r)}
                            title="Edit Student & Remark"
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {isAdmin && onDeleteRecord && (
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(r)}
                            title="Delete Enquiry"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
  );
}
