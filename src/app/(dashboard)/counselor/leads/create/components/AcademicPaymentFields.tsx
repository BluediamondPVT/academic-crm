'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

interface AcademicPaymentFieldsProps {
  paymentPlan: string;
  amountPayingNow: string;
  paymentMode: string;
  nextDueDate: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

export default function AcademicPaymentFields({
  paymentPlan,
  amountPayingNow,
  paymentMode,
  nextDueDate,
  onInputChange,
}: AcademicPaymentFieldsProps) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 mb-4 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-[#112a46]" />
        Payment Plan &amp; Token Fee Details (Optional)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payment Plan */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Payment Plan
          </label>
          <select
            name="paymentPlan"
            value={paymentPlan}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
          >
            <option value="Installments">Installment Schedule</option>
            <option value="Full">Full Upfront Payment</option>
          </select>
        </div>

        {/* Amount Paying Now */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Amount Paying Now (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
              ₹
            </span>
            <input
              type="number"
              name="amountPayingNow"
              value={amountPayingNow}
              onChange={onInputChange}
              placeholder="e.g. 5000"
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            value={paymentMode}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium transition-all bg-white"
          >
            <option value="UPI">UPI / QR Code</option>
            <option value="Bank">Bank Transfer / NEFT</option>
            <option value="Cash">Cash</option>
            <option value="Card">Debit / Credit Card</option>
          </select>
        </div>

        {/* Next Due Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Next Due Date
          </label>
          <input
            type="date"
            name="nextDueDate"
            value={nextDueDate}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
