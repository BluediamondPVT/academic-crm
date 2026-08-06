import React from 'react';
import { Receipt, Clock, Download, MessageSquare } from 'lucide-react';
import { StudentRecord } from '../../../types';
import { generatePaySlip, PaymentItem } from '../utils/paySlipGenerator';

interface PaymentHistorySectionProps {
  student: StudentRecord;
}

export const PaymentHistorySection: React.FC<PaymentHistorySectionProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-emerald-600" />
          Payment &amp; Installments History
        </span>
        {student.payments && student.payments.length > 0 && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            {student.payments.length} Logged
          </span>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {student.payments && student.payments.length > 0 ? (
          student.payments.map((pmt, idx) => {
            const cumulativePaid = student.payments!
              .slice(0, idx + 1)
              .reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const totalCourseFee = Number(student.totalFee || 0);
            const balanceAfter = Math.max(0, totalCourseFee - cumulativePaid);

            return (
              <div key={idx} className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                        # {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {pmt.paymentType || 'Payment'} Plan
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {new Date(pmt.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}{' '}
                        {new Date(pmt.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium text-[10px] uppercase">Paid Amount</span>
                      <span className="text-sm font-black text-emerald-600 block mt-0.5">
                        ₹{pmt.amount ? pmt.amount.toLocaleString('en-IN') : '0'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium text-[10px] uppercase">Remaining Balance</span>
                      <span className="text-sm font-black text-rose-600 block mt-0.5">
                        ₹{balanceAfter.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium text-[10px] uppercase">Payment Mode</span>
                      <span className={`inline-block mt-0.5 font-bold text-[11px] px-2 py-0.5 rounded ${
                        pmt.paymentMode === 'UPI'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : pmt.paymentMode === 'Bank'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {pmt.paymentMode || 'UPI'}
                      </span>
                    </div>
                  </div>
                </div>

                {pmt.nextDueDate && (
                  <div className="mt-3 text-[11px] text-slate-600 flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-150">
                    <span className="font-medium text-slate-500">Next Due Date:</span>
                    <span className="font-bold text-slate-800">
                      {new Date(pmt.nextDueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => generatePaySlip(student, pmt as PaymentItem, idx, balanceAfter, cumulativePaid)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg border border-indigo-150 transition-colors shadow-xs cursor-pointer active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Slip</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : student.totalPaid && student.totalPaid > 0 ? (
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                  # 1
                </span>
                <span className="text-xs font-bold text-slate-800">Initial Payment</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium text-[10px] uppercase">Paid Amount</span>
                  <span className="text-sm font-black text-emerald-600 block mt-0.5">
                    ₹{student.totalPaid.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium text-[10px] uppercase">Remaining Balance</span>
                  <span className="text-sm font-black text-rose-600 block mt-0.5">
                    ₹{(student.remainingFee !== undefined ? student.remainingFee : Math.max(0, (student.totalFee || 0) - student.totalPaid)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium text-[10px] uppercase">Payment Mode</span>
                  <span className="inline-block mt-0.5 font-bold text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                    UPI / Bank
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const balanceAfter = student.remainingFee !== undefined 
                    ? student.remainingFee 
                    : Math.max(0, (student.totalFee || 0) - student.totalPaid!);
                  generatePaySlip(
                    student,
                    {
                      amount: student.totalPaid!,
                      date: student.createdAt || new Date().toISOString(),
                      paymentMode: 'UPI / Bank',
                      paymentType: 'Initial Payment',
                      remark: student.remark || '',
                    },
                    0,
                    balanceAfter,
                    student.totalPaid!
                  );
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg border border-indigo-150 transition-colors shadow-xs cursor-pointer active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Slip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="col-span-full text-xs text-gray-400 italic text-center py-6">
            No payment history recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
