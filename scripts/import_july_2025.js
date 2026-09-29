const mongoose = require('mongoose');

const uri = 'mongodb+srv://bditacademic:bditacademic@bdit-academics.7ipewiv.mongodb.net/bditacademic-CRM?retryWrites=true&w=majority';

// University: mangalayatan university
const MANGALAYATAN_ID = '6a50c7221108eced86290647';
const MANGALAYATAN_NAME = 'mangalayatan university';

// Entry User: Fardeen (Role: ACADEMIC)
const FARDEEN_ID = '6ab9fa80a078ecea852dc52f';
const FARDEEN_NAME = 'Fardeen';
const FARDEEN_ROLE = 'ACADEMIC';

const july2025Students = [
  {
    name: 'ASIR SHAIKH',
    phoneNumber: '9594885822',
    email: 'asir.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 48000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 48000,
    remainingFee: 0,
    paidToUniversity: 14000,
    profit: 34000,
    payoutPercentage: 20,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-07-03T00:00:00.000Z'),
    updatedAt: new Date('2025-07-03T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22504263. 2nd year Fees 24000 Paid. Need to Proceed for 2nd yr.',
    admissionRemarkUpdatedAt: new Date('2025-07-03T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 48000,
        paidToUniversity: 14000,
        profit: 34000,
        paymentMode: 'GPAY TO CLASSES',
        date: new Date('2025-07-03T00:00:00.000Z'),
        remark: 'Initial Admission & 2nd Year Fees Paid - LMS ID: 22504263'
      }
    ]
  },
  {
    name: 'khan mohd salik',
    phoneNumber: '9321641549',
    email: 'salik.khan@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 24000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 24000,
    remainingFee: 0,
    paidToUniversity: 14000,
    profit: 10000,
    payoutPercentage: 20,
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
        amount: 24000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO CLASSES',
        date: new Date('2025-07-29T00:00:00.000Z'),
        remark: 'Admission Payment - LMS ID: 22506413'
      }
    ]
  },
  {
    name: 'SAYYED ALIYA ZEHRA ALI ASGAR',
    phoneNumber: '9892152532',
    email: 'aliya.zehra@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 38000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 24000,
    remainingFee: 14000,
    paidToUniversity: 14000,
    profit: 10000,
    payoutPercentage: 20,
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
        amount: 24000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-08-06T00:00:00.000Z'),
        remark: 'Admission Payment - LMS ID: 22506350'
      }
    ]
  },
  {
    name: 'SHAIKH USMAN',
    phoneNumber: '8928983421',
    email: 'usman.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 39000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 24000,
    remainingFee: 15000,
    paidToUniversity: 14000,
    profit: 10000,
    payoutPercentage: 20,
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
        amount: 24000,
        paidToUniversity: 14000,
        profit: 10000,
        paymentMode: 'GPAY TO INSTITUTE / CASH',
        date: new Date('2025-09-16T00:00:00.000Z'),
        remark: 'Admission Payment - LMS ID: 22509712'
      }
    ]
  },
  {
    name: 'NARMEEN SHAIKH',
    phoneNumber: '8291684078',
    email: 'narmeen.shaikh@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BBA',
    duration: 3,
    totalFee: 44000,
    yearFee: 22000,
    semesterFee: 11000,
    totalPaid: 44000,
    remainingFee: 0,
    paidToUniversity: 13000,
    profit: 31000,
    payoutPercentage: 20,
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
        amount: 44000,
        paidToUniversity: 13000,
        profit: 31000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-10-13T00:00:00.000Z'),
        remark: '1st & 2nd Year Fees Paid - LMS ID: 12609143'
      }
    ]
  },
  {
    name: 'ABDUL REHMAN',
    phoneNumber: '7304179882',
    email: 'abdul.rehman@student.com',
    city: 'Mumbai',
    universityId: MANGALAYATAN_ID,
    universityName: MANGALAYATAN_NAME,
    courseName: 'BCA',
    duration: 3,
    totalFee: 48000,
    yearFee: 24000,
    semesterFee: 12000,
    totalPaid: 48000,
    remainingFee: 0,
    paidToUniversity: 14000,
    profit: 34000,
    payoutPercentage: 20,
    status: 'Admission',
    session: 'July 2025',
    counselorId: FARDEEN_ID,
    counselorName: FARDEEN_NAME,
    counselorRole: FARDEEN_ROLE,
    createdAt: new Date('2025-11-26T00:00:00.000Z'),
    updatedAt: new Date('2025-11-26T00:00:00.000Z'),
    admissionRemark: 'LMS ID: 22518358, Password: 6062007. Admission Done. Paid to University 14000.',
    admissionRemarkUpdatedAt: new Date('2025-11-26T00:00:00.000Z'),
    payments: [
      {
        paymentType: 'Yearly',
        amount: 48000,
        paidToUniversity: 14000,
        profit: 34000,
        paymentMode: 'CASH TO SIR',
        date: new Date('2025-11-26T00:00:00.000Z'),
        remark: 'Total Fee Paid 48000 - LMS ID: 22518358'
      }
    ]
  }
];

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const studentsCollection = mongoose.connection.db.collection('students');

    for (const stu of july2025Students) {
      // Check if phone number already exists
      const existing = await studentsCollection.findOne({ phoneNumber: stu.phoneNumber });
      if (existing) {
        console.log(`Skipping (already exists): ${stu.name} (${stu.phoneNumber})`);
      } else {
        const res = await studentsCollection.insertOne(stu);
        console.log(`Inserted: ${stu.name} -> ID: ${res.insertedId}`);
      }
    }

    const totalCount = await studentsCollection.countDocuments();
    console.log('Total students in DB now:', totalCount);
    process.exit(0);
  } catch (err) {
    console.error('Import Error:', err);
    process.exit(1);
  }
}

run();
