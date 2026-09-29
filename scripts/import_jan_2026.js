const mongoose = require('mongoose');

const uri = 'mongodb+srv://bditacademic:bditacademic@bdit-academics.7ipewiv.mongodb.net/bditacademic-CRM?retryWrites=true&w=majority';

// University: mangalayatan university
const MANGALAYATAN_ID = '6a50c7221108eced86290647';
const MANGALAYATAN_NAME = 'mangalayatan university';

// Entry User: Fardeen (Role: ACADEMIC)
const FARDEEN_ID = '6ab9fa80a078ecea852dc52f';
const FARDEEN_NAME = 'Fardeen';
const FARDEEN_ROLE = 'ACADEMIC';

const jan2026Students = [
  // 1. NABILA SARNAIK
  {
    name: 'NABILA SARNAIK',
    phoneNumber: '9819074864',
    email: 'nabila.sarnaik@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'MBA',
    duration: 2,
    totalFee: 68000,
    yearFee: 34000,
    semesterFee: 17000,
    totalPaid: 30000,
    otherAmount: 4000,
    remainingFee: 34000,
    paidToUniversity: 19000,
    profit: 15000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-15T00:00:00.000Z'),
    updatedAt: new Date('2026-01-15T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12604127. 1st Year Paid: 34,000. Paid to University: 19,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-15T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 30000,
        otherAmount: 4000,
        paidToUniversity: 19000,
        profit: 15000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-15T00:00:00.000Z'),
        remark: '1st Year MBA Fees: 34,000 (LMS ID: 12604127)'
      }
    ]
  },

  // 2. NAWAZ NAUSHAD SAYED
  {
    name: 'NAWAZ NAUSHAD SAYED',
    phoneNumber: '9892758500',
    email: 'nawaz.sayed@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 20000,
    otherAmount: 4000,
    remainingFee: 46000,
    paidToUniversity: 14000,
    profit: 10000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-18T00:00:00.000Z'),
    updatedAt: new Date('2026-01-18T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12604302. 1st Year Paid: 24,000. Paid to University: 14,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-18T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-18T00:00:00.000Z'),
        remark: '1st Year BCA Fees: 24,000 (LMS ID: 12604302)'
      }
    ]
  },

  // 3. MOHD GUFRAN IRFAN QURESHI
  {
    name: 'MOHD GUFRAN IRFAN QURESHI',
    phoneNumber: '9324442419',
    email: 'gufran.qureshi@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'MCA',
    duration: 2,
    totalFee: 68000,
    yearFee: 34000,
    semesterFee: 17000,
    totalPaid: 30000,
    otherAmount: 4000,
    remainingFee: 34000,
    paidToUniversity: 19000,
    profit: 15000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-20T00:00:00.000Z'),
    updatedAt: new Date('2026-01-20T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12604129. 1st Year Paid: 34,000. Paid to University: 19,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-20T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 30000,
        otherAmount: 4000,
        paidToUniversity: 19000,
        profit: 15000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-20T00:00:00.000Z'),
        remark: '1st Year MCA Fees: 34,000 (LMS ID: 12604129)'
      }
    ]
  },

  // 4. SHAFIYA ALI IMRAN SHAIKH
  {
    name: 'SHAFIYA ALI IMRAN SHAIKH',
    phoneNumber: '8454082404',
    email: 'shafiya.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 20000,
    otherAmount: 4000,
    remainingFee: 46000,
    paidToUniversity: 14000,
    profit: 10000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-22T00:00:00.000Z'),
    updatedAt: new Date('2026-01-22T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12603999. 1st Year Paid: 24,000. Paid to University: 14,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-22T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-22T00:00:00.000Z'),
        remark: '1st Year BCA Fees: 24,000 (LMS ID: 12603999)'
      }
    ]
  },

  // 5. NAZIR HAIDER ALI SHAIKH
  {
    name: 'NAZIR HAIDER ALI SHAIKH',
    phoneNumber: '8828089251',
    email: 'nazir.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'MBA',
    specialization: 'Finance',
    duration: 2,
    totalFee: 68000,
    yearFee: 34000,
    semesterFee: 17000,
    totalPaid: 30000,
    otherAmount: 4000,
    remainingFee: 34000,
    paidToUniversity: 19000,
    profit: 15000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-25T00:00:00.000Z'),
    updatedAt: new Date('2026-01-25T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12603989. MBA (Finance). 1st Year Paid: 34,000. Paid to University: 19,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-25T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 30000,
        otherAmount: 4000,
        paidToUniversity: 19000,
        profit: 15000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-25T00:00:00.000Z'),
        remark: '1st Year MBA (Finance) Fees: 34,000 (LMS ID: 12603989)'
      }
    ]
  },

  // 6. MOHD NADEEM CHOUDHARY
  {
    name: 'MOHD NADEEM CHOUDHARY',
    phoneNumber: '9129545034',
    email: 'nadeem.choudhary@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BBA',
    duration: 3,
    totalFee: 66000,
    yearFee: 22000,
    semesterFee: 11000,
    totalPaid: 22000,
    otherAmount: 0,
    remainingFee: 44000,
    paidToUniversity: 13000,
    profit: 9000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'January 2026',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2026-01-28T00:00:00.000Z'),
    updatedAt: new Date('2026-01-28T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12603996. 1st Year Paid: 22,000. Paid to University: 13,000.',
    admissionRemarkUpdatedAt: new Date('2026-01-28T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly Plan',
        amount: 22000,
        otherAmount: 0,
        paidToUniversity: 13000,
        profit: 9000,
        paymentMode: 'UPI / Bank',
        date: new Date('2026-01-28T00:00:00.000Z'),
        remark: '1st Year BBA Fees: 22,000 (LMS ID: 12603996)'
      }
    ]
  }
];

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const collection = mongoose.connection.db.collection('students');

    for (const stu of jan2026Students) {
      const existing = await collection.findOne({ phoneNumber: stu.phoneNumber });
      if (existing) {
        console.log(`Skipping (already exists): ${stu.name} (${stu.phoneNumber})`);
      } else {
        const res = await collection.insertOne(stu);
        console.log(`Inserted: ${stu.name} -> ID: ${res.insertedId}`);
      }
    }

    const total = await collection.countDocuments();
    console.log('Total students in Database now:', total);
    process.exit(0);
  } catch (err) {
    console.error('Import Error:', err);
    process.exit(1);
  }
}

run();
