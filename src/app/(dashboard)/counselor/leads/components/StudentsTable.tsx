'use client';

import React from 'react';
import { Loader2, User, Phone, Building, Eye, Mail, Edit, Trash2 } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentsTableProps {
  students: StudentRecord[];
  loading: boolean;
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  isAdmin?: boolean;
  onDeleteStudent?: (student: StudentRecord) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active On Call':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'Visit':
      return 'bg-purple-50 text-purple-700 border border-purple-100';
    case 'Online Counseling':
      return 'bg-cyan-50 text-cyan-700 border border-cyan-100';
    case 'Hold':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'Lost':
      return 'bg-red-50 text-red-700 border border-red-100';
    case 'Admission':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-100';
  }
};

export default function StudentsTable({
  students,
  loading,
  onSelectStudent,
  onEditStudent,
  isAdmin = false,
  onDeleteStudent,
}: StudentsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#112a46]">Enrolled Students List</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
          Showing {students.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                #
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Name
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Number
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                City
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                 Course
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Status
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Remark
              </th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="max-w-xs mx-auto py-4">
                    <User className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-600">No students added yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click &quot;Add Enquiry&quot; button to register a student and assign a university course.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-[#112a46]">{student.name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 bg-gray-100 px-1 py-1 rounded-lg">
                      <Phone className="h-3.5 w-3.5 text-gray-500" />
                      {student.phoneNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                      <Building className="h-3.5 w-3.5 text-indigo-600" />
                      {student.city}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs font-bold text-[#112a46]">{student.courseName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        student.status === 'Admission' ? (student.preAdmissionStatus || 'Processing') : student.status
                      )}`}
                    >
                      {student.status === 'Admission' ? (student.preAdmissionStatus || 'Processing') : student.status}
                    </span> 
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1 min-w-[200px] max-w-[400px]">
                      {student.status === 'Admission' ? (
                        <>
                          {student.remarkUpdatedAt && (student.preAdmissionRemark || student.remark) && (
                            <span className="text-[10px] font-semibold text-gray-400">
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
                          )}
                          {(student.preAdmissionRemark || student.remark) ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg wrap-break-word">
                              {student.preAdmissionRemark || student.remark}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No remark</span>
                          )}
                        </>
                      ) : (
                        <>
                          {student.remarkUpdatedAt && student.remark && (
                            <span className="text-[10px] font-semibold text-gray-400">
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
                          )}
                          {student.remark ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg wrap-break-word">
                              {student.remark}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No remark</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Student Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Student & Remark"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDeleteStudent?.(student)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
