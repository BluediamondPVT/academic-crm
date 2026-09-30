'use client';

import React from 'react';
import { GraduationCap, Laptop } from 'lucide-react';

interface TrackSelectorProps {
  programTrack: 'academic' | 'institute';
  onTrackChange: (track: 'academic' | 'institute') => void;
}

export default function TrackSelector({
  programTrack,
  onTrackChange,
}: TrackSelectorProps) {
  return (
    <div className="p-5 md:p-6 bg-gradient-to-r from-[#112a46] to-[#1e40af] text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block mb-1">
            Step 1: Choose Admission Track
          </span>
          <h2 className="text-lg font-bold">Choose Admission Program</h2>
        </div>

        {/* 2 Interactive Track Options */}
        <div className="grid grid-cols-2 gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => onTrackChange('academic')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              programTrack === 'academic'
                ? 'bg-white text-[#112a46] shadow-md font-extrabold'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="h-4 w-4 shrink-0" />
            <span>1. Academic (Degree)</span>
          </button>

          <button
            type="button"
            onClick={() => onTrackChange('institute')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              programTrack === 'institute'
                ? 'bg-white text-[#112a46] shadow-md font-extrabold'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Laptop className="h-4 w-4 shrink-0" />
            <span>2. BDIT Institute</span>
          </button>
        </div>
      </div>
    </div>
  );
}
