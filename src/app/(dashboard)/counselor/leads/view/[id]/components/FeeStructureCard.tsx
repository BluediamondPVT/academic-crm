import React from 'react';
import { StudentRecord } from '../../../types';

interface FeeStructureCardProps {
  student: StudentRecord;
}

export const FeeStructureCard: React.FC<FeeStructureCardProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
        <span className="text-emerald-500 font-bold">₹</span>
        Fee Structure
      </h3>

      <div className="space-y-3">
        <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-4 hover:bg-emerald-50/40 transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Total Course Fee</span>
          <span className="text-lg font-black text-emerald-950 mt-0.5 block">
            {student.totalFee
              ? `₹${student.totalFee.toLocaleString('en-IN')}`
              : 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Yearly Fee</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5 block">
              {student.yearFee
                ? `₹${student.yearFee.toLocaleString('en-IN')}`
                : 'N/A'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Semester Fee</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5 block">
              {student.semesterFee
                ? `₹${student.semesterFee.toLocaleString('en-IN')}`
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Total Paid & Remaining Fee */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 hover:bg-emerald-50 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Total Paid</span>
            <span className="text-sm font-black text-emerald-950 mt-0.5 block">
              {student.totalPaid ? `₹${student.totalPaid.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>

          <div className="bg-rose-50/50 border border-rose-100/60 rounded-xl p-3 hover:bg-rose-50 transition-colors">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">Remaining Fee</span>
            <span className="text-sm font-black text-rose-950 mt-0.5 block">
              {student.remainingFee !== undefined ? `₹${student.remainingFee.toLocaleString('en-IN')}` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Payment Mode & Next Due Date */}
        {student.payments && student.payments.length > 0 && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Payment Mode</span>
              <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                {student.payments[student.payments.length - 1].paymentMode || 'N/A'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:bg-slate-100/60 transition-colors">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Next Due Date</span>
              <span className="text-sm font-bold text-slate-700 mt-0.5 block">
                {student.payments[student.payments.length - 1].nextDueDate 
                  ? new Date(student.payments[student.payments.length - 1].nextDueDate!).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        )}

        {/* Payout & Profit */}
        {student.payoutPercentage !== undefined && student.payoutPercentage > 0 && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100/60 pt-3">
            <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-3 hover:bg-indigo-50 transition-colors">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">Payout Ratio</span>
              <span className="text-sm font-black text-indigo-950 mt-0.5 block">
                {student.payoutPercentage}%
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white hover:bg-slate-800 transition-colors">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">Our Profit</span>
              <span className="text-sm font-black text-indigo-200 mt-0.5 block">
                ₹{Math.round(((student.totalPaid || 0) * (student.payoutPercentage || 0)) / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
