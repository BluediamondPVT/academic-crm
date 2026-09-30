'use client';

import React from 'react';
import {
  Laptop,
  Sparkles,
  PhoneCall,
  MapPin,
  UserCheck,
  Clock,
  Activity,
  PauseCircle,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { InstituteRecord } from '../types';

interface InstituteStatsProps {
  records: InstituteRecord[];
  activeStatus?: string;
  onStatusClick?: (statusName: string) => void;
}

export default function InstituteStats({
  records,
  activeStatus = 'ALL',
  onStatusClick,
}: InstituteStatsProps) {
  const stats = [
    {
      name: 'Total Enquiries',
      count: records.length,
      icon: Laptop,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50/80 backdrop-blur-xs',
      activeClass: 'border-indigo-500 ring-2 ring-indigo-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-indigo-100 hover:border-indigo-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'New Lead',
      count: records.filter(r => (r.status || 'New Lead') === 'New Lead').length,
      icon: Sparkles,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50/80 backdrop-blur-xs',
      activeClass: 'border-cyan-500 ring-2 ring-cyan-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-cyan-100 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Active On Call',
      count: records.filter(r => r.status === 'Active On Call').length,
      icon: PhoneCall,
      color: 'text-blue-600',
      bg: 'bg-blue-50/80 backdrop-blur-xs',
      activeClass: 'border-blue-500 ring-2 ring-blue-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-blue-100 hover:border-blue-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Center Visit',
      count: records.filter(r => r.status === 'Center Visit' || r.status === 'Visit').length,
      icon: MapPin,
      color: 'text-purple-600',
      bg: 'bg-purple-50/80 backdrop-blur-xs',
      activeClass: 'border-purple-500 ring-2 ring-purple-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-purple-100 hover:border-purple-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Demo / Counseling',
      count: records.filter(r => r.status === 'Demo / Counseling' || r.status === 'Online Counseling').length,
      icon: UserCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50/80 backdrop-blur-xs',
      activeClass: 'border-teal-500 ring-2 ring-teal-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-teal-100 hover:border-teal-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Follow-Up',
      count: records.filter(r => r.status === 'Follow-Up').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50/80 backdrop-blur-xs',
      activeClass: 'border-amber-500 ring-2 ring-amber-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-amber-100 hover:border-amber-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Batch Processing',
      count: records.filter(r => r.status === 'Batch Processing' || r.status === 'Processing').length,
      icon: Activity,
      color: 'text-pink-600',
      bg: 'bg-pink-50/80 backdrop-blur-xs',
      activeClass: 'border-pink-500 ring-2 ring-pink-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-pink-100 hover:border-pink-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Hold',
      count: records.filter(r => r.status === 'Hold').length,
      icon: PauseCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50/80 backdrop-blur-xs',
      activeClass: 'border-yellow-500 ring-2 ring-yellow-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-yellow-100 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Lost',
      count: records.filter(r => r.status === 'Lost').length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50/80 backdrop-blur-xs',
      activeClass: 'border-red-500 ring-2 ring-red-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-red-100 hover:border-red-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
    {
      name: 'Admission',
      count: records.filter(r => r.status === 'Admission' || r.status === 'Enrolled').length,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/80 backdrop-blur-xs',
      activeClass: 'border-emerald-500 ring-2 ring-emerald-500/15 bg-white/90 shadow-lg -translate-y-1',
      inactiveClass: 'border-emerald-100 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-md hover:bg-white/80',
    },
  ];

  return (
    <div className="mb-8">
      {/* 5-column grid on desktop, 2 cols on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {stats.map(item => {
          const isActive =
            item.name === 'Total Enquiries'
              ? activeStatus === 'ALL'
              : activeStatus === item.name;

          return (
            <div
              key={item.name}
              onClick={() => {
                if (onStatusClick) {
                  onStatusClick(item.name);
                }
              }}
              className={`group relative rounded-2xl border bg-white/40 backdrop-blur-lg p-4.5 flex items-center justify-between overflow-hidden transition-all duration-300 cursor-pointer select-none ${isActive ? item.activeClass : item.inactiveClass
                }`}
            >
              <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-current opacity-[0.03] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="min-w-0 flex-1 pr-3">
                <h3 className="text-2xl font-black text-[#112a46] tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
                  {item.count}
                </h3>
                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mt-0.5 truncate" title={item.name}>
                  {item.name}
                </p>
              </div>

              <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 border border-white/50 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
