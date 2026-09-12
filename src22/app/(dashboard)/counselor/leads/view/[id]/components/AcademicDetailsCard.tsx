import React from 'react';
import { Building } from 'lucide-react';
import { StudentRecord } from '../../../types';

interface AcademicDetailsCardProps {
  student: StudentRecord;
}

export const AcademicDetailsCard: React.FC<AcademicDetailsCardProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
        <Building className="h-4 w-4 text-sky-500" />
        Academic Details
      </h3>
      
      <div className="bg-linear-to-br from-indigo-50/40 via-blue-50/30 to-sky-50/20 border border-indigo-100/60 rounded-xl p-4 space-y-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">University</span>
          <span className="text-sm font-black text-indigo-950 block mt-0.5">
            {student.universityName}
          </span>
        </div>

        <div className="border-t border-indigo-100/50 pt-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">Course &amp; Specialization</span>
          <span className="text-sm font-bold text-slate-800 block mt-0.5">
            {student.courseName}
          </span>
          {student.specialization && (
            <span className="mt-1.5 inline-block text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-medium">
              {student.specialization}
            </span>
          )}
        </div>

        {student.duration && (
          <div className="border-t border-indigo-100/50 pt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Course Duration</span>
            <span className="font-bold text-indigo-950 bg-white px-2 py-1 rounded border border-indigo-100/60 shadow-xxs">
              {student.duration} Years
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
