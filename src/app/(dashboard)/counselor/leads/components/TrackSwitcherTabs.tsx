'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, GraduationCap, Laptop } from 'lucide-react';

interface TrackSwitcherTabsProps {
  activeTrack: 'academic' | 'institute';
  onTrackChange: (track: 'academic' | 'institute') => void;
}

export default function TrackSwitcherTabs({
  activeTrack,
  onTrackChange,
}: TrackSwitcherTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-150">
      <div className="inline-flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-2xl border border-gray-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => onTrackChange('academic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTrack === 'academic'
              ? 'bg-[#112a46] text-white shadow-md font-extrabold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>1. Academic (University Degree)</span>
        </button>

        <button
          type="button"
          onClick={() => onTrackChange('institute')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTrack === 'institute'
              ? 'bg-[#112a46] text-white shadow-md font-extrabold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Laptop className="h-4 w-4" />
          <span>2. BDIT Institute (Tech Courses)</span>
        </button>
      </div>

      <Link
        href={`/counselor/leads/create?track=${activeTrack}`}
        className="px-5 py-2.5 bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 group self-start sm:self-auto cursor-pointer"
      >
        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span>Add Enquiry</span>
      </Link>
    </div>
  );
}
