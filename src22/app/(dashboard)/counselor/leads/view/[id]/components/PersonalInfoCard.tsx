import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { StudentRecord } from '../../../types';

interface PersonalInfoCardProps {
  student: StudentRecord;
  displayStatus: string;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ student, displayStatus }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
        <User className="h-4 w-4 text-indigo-500" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student Name */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <User className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Student Name</span>
            <span className="text-sm font-bold text-[#112a46]">{student.name}</span>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Phone Number</span>
            <span className="text-sm font-semibold text-slate-700">{student.phoneNumber}</span>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Email Address</span>
            <span className="text-sm font-semibold text-slate-700 block truncate">{student.email || 'N/A'}</span>
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">City</span>
            <span className="text-sm font-semibold text-slate-700">{student.city}</span>
          </div>
        </div>

        {/* Enrollment Date */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Enrollment Date</span>
            <span className="text-sm font-medium text-slate-700">
              {student.createdAt
                ? new Date(student.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Admission Status */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 hover:bg-slate-50 transition-colors">
          <div className={`p-2 rounded-lg ${
            displayStatus === 'Admission'
              ? 'bg-green-50 text-green-600'
              : displayStatus === 'Lost'
              ? 'bg-red-50 text-red-600'
              : displayStatus === 'Hold' || displayStatus === 'Follow-Up'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-blue-50 text-blue-600'
          }`}>
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Admission Status</span>
            <span className="text-sm font-semibold text-slate-700">{displayStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
