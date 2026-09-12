import { StudentRecord } from '../../../types';

export interface PaymentItem {
  amount: number;
  date: string;
  paymentMode?: string;
  paymentType?: string;
  nextDueDate?: string;
  remark?: string;
}

export const generatePaySlip = (
  student: StudentRecord,
  pmt: PaymentItem,
  index: number,
  balanceAfter: number,
  cumulativePaid: number
) => {
  if (!student) return;

  const receiptNo = `SLIP-${student._id.slice(-6).toUpperCase()}-${index + 1}`;

  const dateFormatted = new Date(pmt.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nextDueDateFormatted = pmt.nextDueDate
    ? new Date(pmt.nextDueDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student_Pay_Slip_${student.name.replace(/\s+/g, '_')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
    }
    .slip-card {
      width: 100%;
      max-width: 820px;
      background: #ffffff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .receipt-meta {
      text-align: right;
    }
    .badge {
      display: inline-block;
      background: #eef2ff;
      color: #4338ca;
      font-size: 12px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      border: 1px solid #c7d2fe;
    }
    .meta-line {
      font-size: 12px;
      color: #475569;
      margin-top: 2px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
    }
    .sec-heading {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #4338ca;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    .field-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .field-row:last-child { margin-bottom: 0; }
    .f-label { color: #64748b; font-weight: 500; }
    .f-val { color: #0f172a; font-weight: 700; text-align: right; word-break: break-word; }

    .fee-summary {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      border-radius: 16px;
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(15, 23, 42, 0.15);
    }
    .sum-box { text-align: center; }
    .sum-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    .sum-val { font-size: 20px; font-weight: 900; margin-top: 6px; color: #38bdf8; }
    .sum-val.paid { color: #4ade80; }
    .sum-val.rest { color: #f87171; }
    .sum-box.middle { border-left: 1px solid #334155; border-right: 1px solid #334155; }

    .table-container {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 18px;
    }
    td {
      padding: 14px 18px;
      font-size: 13px;
      border-top: 1px solid #e2e8f0;
      color: #1e293b;
    }
    .text-right { text-align: right; }
    .font-bold { font-weight: 800; }

    .note-box {
      background: #fffbebf5;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 12px;
      color: #92400e;
      margin-bottom: 30px;
    }
    .note-title { font-weight: 800; margin-bottom: 2px; }

    .signature-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 50px;
      padding-top: 10px;
    }
    .sig-block {
      width: 230px;
      text-align: center;
    }
    .sig-line {
      border-top: 2px dashed #94a3b8;
      margin-bottom: 8px;
      height: 45px;
    }
    .sig-label { font-size: 12px; font-weight: 800; color: #0f172a; }
    .sig-sub { font-size: 10px; font-weight: 600; color: #64748b; margin-top: 2px; }

    .footer {
      margin-top: 35px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      font-weight: 500;
    }

    .print-btn-bar {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
    .print-btn {
      background: #112a46;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(17, 42, 70, 0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .print-btn:hover { background: #1a3d66; transform: translateY(-1px); }

    @media print {
      body { background: #ffffff; padding: 0; }
      .slip-card { box-shadow: none; border: none; padding: 20px; max-width: 100%; }
      .print-btn-bar { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="print-btn-bar">
    <button class="print-btn" onclick="window.print()">
      🖨️ Print / Download PDF
    </button>
  </div>

  <div class="slip-card">
    <!-- Header -->
    <div class="header">
      <div class="brand" style="display: flex; align-items: center; gap: 14px;">
        <img src="${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png" alt="Company Logo" style="max-height: 55px; width: auto; object-fit: contain;" />
      </div>
      <div class="receipt-meta">
        <div class="badge">Student Fee Payment Receipt</div>
        <div class="meta-line">Receipt No: <strong>#${receiptNo}</strong></div>
        <div class="meta-line">Date: <strong>${dateFormatted}</strong></div>
      </div>
    </div>

    <!-- Student & Academic Grid -->
    <div class="grid-2">
      <div class="section-card">
        <div class="sec-heading">Student Details</div>
        <div class="field-row">
          <span class="f-label">Student ID:</span>
          <span class="f-val">${student._id}</span>
        </div>
        <div class="field-row">
          <span class="f-label">Student Name:</span>
          <span class="f-val">${student.name}</span>
        </div>
        <div class="field-row">
          <span class="f-label">Phone Number:</span>
          <span class="f-val">${student.phoneNumber}</span>
        </div>
        <div class="field-row">
          <span class="f-label">Email Address:</span>
          <span class="f-val">${student.email || 'N/A'}</span>
        </div>
        ${student.city ? `
        <div class="field-row">
          <span class="f-label">City:</span>
          <span class="f-val">${student.city}</span>
        </div>` : ''}
      </div>

      <div class="section-card">
        <div class="sec-heading">Academic & Course Info</div>
        <div class="field-row">
          <span class="f-label">University Name:</span>
          <span class="f-val">${student.universityName}</span>
        </div>
        <div class="field-row">
          <span class="f-label">Course:</span>
          <span class="f-val">${student.courseName}</span>
        </div>
        ${student.specialization ? `
        <div class="field-row">
          <span class="f-label">Specialization:</span>
          <span class="f-val">${student.specialization}</span>
        </div>` : ''}
        ${student.duration ? `
        <div class="field-row">
          <span class="f-label">Duration:</span>
          <span class="f-val">${student.duration} Years</span>
        </div>` : ''}
      </div>
    </div>

    <!-- Fee Overview Banner -->
    <div class="fee-summary">
      <div class="sum-box">
        <div class="sum-label">Total Fee</div>
        <div class="sum-val">₹${Number(student.totalFee || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="sum-box middle">
        <div class="sum-label">Paid Fee (This Slip)</div>
        <div class="sum-val paid">₹${Number(pmt.amount || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="sum-box">
        <div class="sum-label">Rest / Remaining Fee</div>
        <div class="sum-val rest">₹${Number(balanceAfter || 0).toLocaleString('en-IN')}</div>
      </div>
    </div>

    <!-- Payment Transaction Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Payment Type / Mode</th>
            <th>Payment Date</th>
            <th class="text-right">Paid Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${pmt.paymentType || 'Installment Payment'}</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                Mode: <strong>${pmt.paymentMode || 'UPI / Bank'}</strong>
              </div>
            </td>
            <td>${dateFormatted}</td>
            <td class="text-right font-bold" style="color: #15803d; font-size: 15px;">
              ₹${Number(pmt.amount || 0).toLocaleString('en-IN')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    ${pmt.nextDueDate ? `
    <div class="section-card" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
      <span class="f-label" style="font-weight: 700; color: #334155;">Next Payment Due Date:</span>
      <span class="f-val" style="color: #c2410c; font-size: 14px; font-weight: 800;">${nextDueDateFormatted}</span>
    </div>` : ''}



    <!-- Signatures -->
    <div class="signature-area">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-label">Student Sign</div>
        <div class="sig-sub">(${student.name})</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-label">Counsellor Sign</div>
        <div class="sig-sub">(${student.counselorName || 'Authorized Counsellor'})</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      This is a computer-generated Student Pay Slip. Issued by Academic CRM.
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
