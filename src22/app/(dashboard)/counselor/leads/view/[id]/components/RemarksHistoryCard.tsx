import React from 'react';
import { MessageSquare } from 'lucide-react';
import { RemarkHistoryEntry } from '../../../types';

interface RemarksHistoryCardProps {
  filteredHistory?: RemarkHistoryEntry[];
  displayRemark?: string;
}

export const RemarksHistoryCard: React.FC<RemarksHistoryCardProps> = ({ filteredHistory, displayRemark }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-500" />
          Counselor Remarks &amp; History
        </h3>
        {filteredHistory && filteredHistory.length > 0 && (
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold border border-slate-200/40">
            {filteredHistory.length} entry{filteredHistory.length > 1 ? 'ies' : ''}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {filteredHistory && filteredHistory.length > 0 ? (
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {[...filteredHistory].reverse().map((hist, idx) => (
              <div key={idx} className="flex gap-3 relative">
                <div className="h-6 w-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10">
                  <MessageSquare className="h-3 w-3 text-slate-500" />
                </div>
                <div className="space-y-1 w-full pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-semibold">
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
                          : hist.status === 'Hold' || hist.status === 'Follow-Up'
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
                  <div className="text-sm font-medium text-slate-800 bg-slate-50/50 border border-slate-100 rounded-lg p-3 mt-1 shadow-2xs leading-relaxed whitespace-pre-wrap">
                    {hist.remark}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
            <div className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
              {displayRemark ? (
                displayRemark
              ) : (
                <span className="text-gray-400 italic">No remark provided yet.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
