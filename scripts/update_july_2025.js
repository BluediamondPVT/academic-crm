const mongoose = require('mongoose');

const uri = 'mongodb+srv://bditacademic:bditacademic@bdit-academics.7ipewiv.mongodb.net/bditacademic-CRM?retryWrites=true&w=majority';

// University: mangalayatan university
const MANGALAYATAN_ID = '6a50c7221108eced86290647';
const MANGALAYATAN_NAME = 'mangalayatan university';

// Entry User: Fardeen (Role: ACADEMIC)
const FARDEEN_ID = '6ab9fa80a078ecea852dc52f';
const FARDEEN_NAME = 'Fardeen';
const FARDEEN_ROLE = 'ACADEMIC';

const updatedStudents = [
  // 1. ABDUL REHMAN
  {
    phoneNumber: '7304179882',
    name: 'ABDUL REHMAN',
    email: 'abdul.rehman@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 40000,
    otherAmount: 8000,
    remainingFee: 22000,
    paidToUniversity: 28000,
    profit: 20000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-11-26T00:00:00.000Z'),
    updatedAt: new Date('2025-11-26T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22518358, Password: 6062007. Admission Done. 1st & 2nd Year Fees Paid. Paid to University 28,000.',
    admissionRemarkUpdatedAt: new Date('2025-11-26T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-11-26T00:00:00.000Z'),
        remark: '1st Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000 (LMS ID: 22518358)'
      },
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2026-09-21T00:00:00.000Z'),
        remark: '2nd Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000'
      }
    ]
  },

  // 2. ASIR SHAIKH
  {
    phoneNumber: '9594885822',
    name: 'ASIR SHAIKH',
    email: 'asir.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 40000,
    otherAmount: 8000,
    remainingFee: 22000,
    paidToUniversity: 28000,
    profit: 20000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-07-03T00:00:00.000Z'),
    updatedAt: new Date('2025-07-03T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22504263. 1st & 2nd Year Fees Paid. Paid to University 28,000.',
    admissionRemarkUpdatedAt: new Date('2025-07-03T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO CLASSES',
        date: new Date('2025-07-03T00:00:00.000Z'),
        remark: '1st Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000 (LMS ID: 22504263)'
      },
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO CLASSES',
        date: new Date('2026-07-03T00:00:00.000Z'),
        remark: '2nd Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000'
      }
    ]
  },

  // 3. khan mohd salik
  {
    phoneNumber: '9321641549',
    name: 'khan mohd salik',
    email: 'salik.khan@student.com',
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
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-07-29T00:00:00.000Z'),
    updatedAt: new Date('2025-07-29T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22506413. 28-09-2026 = 15000 for 2nd year.',
    admissionRemarkUpdatedAt: new Date('2025-07-29T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO CLASSES',
        date: new Date('2025-07-29T00:00:00.000Z'),
        remark: '1st Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000 (LMS ID: 22506413)'
      }
    ]
  },

  // 4. SAYYED ALIYA ZEHRA ALI ASGAR
  {
    phoneNumber: '9892152532',
    name: 'SAYYED ALIYA ZEHRA ALI ASGAR',
    email: 'aliya.zehra@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 34000,
    otherAmount: 4000,
    remainingFee: 32000,
    paidToUniversity: 21000,
    profit: 17000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-08-06T00:00:00.000Z'),
    updatedAt: new Date('2025-08-06T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22506350, Password: 25092007. 2nd year fees paid on 19-09-2026 = 14000.',
    admissionRemarkUpdatedAt: new Date('2025-08-06T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-08-06T00:00:00.000Z'),
        remark: '1st Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000'
      },
      {
        paymentType: 'Yearly',
        amount: 14000,
        otherAmount: 0,
        paidToUniversity: 7000,
        profit: 7000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2026-09-19T00:00:00.000Z'),
        remark: '2nd Year Fees Paid on 19-09-2026: 14,000'
      }
    ]
  },

  // 5. SHAIKH USMAN
  {
    phoneNumber: '8928983421',
    name: 'SHAIKH USMAN',
    email: 'usman.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 70000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 35000,
    otherAmount: 4000,
    remainingFee: 31000,
    paidToUniversity: 21500,
    profit: 17500,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-09-16T00:00:00.000Z'),
    updatedAt: new Date('2025-09-16T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22509712, Password: 9052007. 2nd year fees paid on 21-09-2025 = 15000.',
    admissionRemarkUpdatedAt: new Date('2025-09-16T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 20000,
        otherAmount: 4000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO INSTITUTE / CASH',
        date: new Date('2025-09-16T00:00:00.000Z'),
        remark: '1st Year Tuition Fee: 20,000 + Exam/Other Fee: 4,000'
      },
      {
        paymentType: 'Yearly',
        amount: 15000,
        otherAmount: 0,
        paidToUniversity: 7500,
        profit: 7500,
        paymentMode: 'CASH',
        date: new Date('2025-09-21T00:00:00.000Z'),
        remark: '2nd Year Fees Paid on 21-09-2025: 15,000'
      }
    ]
  },

  // 6. NARMEEN SHAIKH
  {
    phoneNumber: '8291684078',
    name: 'NARMEEN SHAIKH',
    email: 'narmeen.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BBA',
    duration: 3,
    totalFee: 66000,
    yearFee: 22000,
    semesterFee: 11000,
    totalPaid: 44000,
    otherAmount: 0,
    remainingFee: 22000,
    paidToUniversity: 26000,
    profit: 18000,
    payoutPercentage: 50,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-10-13T00:00:00.000Z'),
    updatedAt: new Date('2025-10-13T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 12609143, Password: 4012005. 2nd year fees paid 22000. Paid need to proceed for 2nd yr.',
    admissionRemarkUpdatedAt: new Date('2025-10-13T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 22000,
        otherAmount: 0,
        paidToUniversity: 13000,
        profit: 9000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-10-13T00:00:00.000Z'),
        remark: '1st Year Fees Paid: 22,000 (LMS ID: 12609143)'
      },
      {
        paymentType: 'Yearly',
        amount: 22000,
        otherAmount: 0,
        paidToUniversity: 13000,
        profit: 9000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2026-10-13T00:00:00.000Z'),
        remark: '2nd Year Fees Paid: 22,000'
      }
    ]
  }
];

async function updateAll() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');
    const collection = mongoose.connection.db.collection('students');

    for (const stu of updatedStudents) {
      const res = await collection.updateOne(
        { phoneNumber: stu.phoneNumber },
        { $set: stu }
      );
      console.log(`Updated ${stu.name} (${stu.phoneNumber}) -> matched: ${res.matchedCount}, modified: ${res.modifiedCount}`);
    }

    console.log('All 6 July 2025 records successfully updated with exact fees & payments structure!');
    process.exit(0);
  } catch (err) {
    console.error('Update Error:', err);
    process.exit(1);
  }
}

updateAll();
