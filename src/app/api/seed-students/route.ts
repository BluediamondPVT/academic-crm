import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

const counselors = [
  { counselorId: '6a5f6dfc471bcb74b65939a9', counselorName: 'Wasi' },
  { counselorId: '6a63363da92377ccc3c6e7eb', counselorName: 'Shardaf' },
  { counselorId: '6a63365aa92377ccc3c6e7ec', counselorName: 'aimaan' },
  { counselorId: '6a63366ca92377ccc3c6e7ed', counselorName: 'rajkumar' }
];

const masterData = [
  { 
    universityName: "dy patil university (Navi Mumbai - Online)", 
    courseName: "BCA - (Bachelor of computer application)", 
    duration: 3,
    totalFee: 132000, 
    yearFee: 44000,
    semesterFee: 22000,
    payoutPercentage: 20 
  },
  { 
    universityName: "AMITY UNIVERSITY (Online)", 
    courseName: "B.Com", 
    duration: 3,
    totalFee: 115200, 
    yearFee: 38400,
    semesterFee: 19200,
    payoutPercentage: 15 
  },
  { 
    universityName: "GLA UNIVERSITY (Online)", 
    courseName: "MBA", 
    duration: 2,
    totalFee: 150000, 
    yearFee: 75000,
    semesterFee: 37500,
    payoutPercentage: 25 
  }
];

const names = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Das', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Bose'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
const sessions = ['January', 'July'];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear all existing student data
    await Student.deleteMany({});
    
    const students = [];
    const now = new Date(); // Reference Point
    
    // We will insert exactly 10 records
    for (let i = 0; i < 10; i++) {
      const selectedMaster = getRandom(masterData);
      const selectedCounselor = getRandom(counselors);
      
      const totalFee = selectedMaster.totalFee;
      
      // Determine payment plan
      const paymentPlans = ['Yearly', 'Semester'];
      const selectedPlan = getRandom(paymentPlans);
      
      let amountPaid = selectedPlan === 'Yearly' ? selectedMaster.yearFee : selectedMaster.semesterFee;
      const remainingFee = totalFee - amountPaid;
      
      let nextDueDate;
      if (i < 3) {
        // Red Zone: Overdue (Jan 2026 to June 2026) -> roughly 30-200 days ago
        const daysAgo = Math.floor(Math.random() * 170) + 30;
        nextDueDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      } else if (i < 6) {
        // Yellow Zone: Upcoming (within next 15-20 days)
        const daysFuture = Math.floor(Math.random() * 6) + 15;
        nextDueDate = new Date(now.getTime() + daysFuture * 24 * 60 * 60 * 1000);
      } else {
        // Safe Zone: Far future (late 2026 or 2027) -> roughly 100-400 days in future
        const daysFarFuture = Math.floor(Math.random() * 300) + 100;
        nextDueDate = new Date(now.getTime() + daysFarFuture * 24 * 60 * 60 * 1000);
      }
      
      // Create payment history record
      const paymentRecord = {
        paymentType: selectedPlan,
        amount: amountPaid,
        paymentMode: 'UPI / QR Code',
        nextDueDate: nextDueDate,
        date: new Date(),
        remark: 'Initial Admission Payment'
      };
      
      students.push({
        name: `${names[i]} ${getRandom(lastNames)}`,
        email: `student${Date.now()}${i}@example.com`,
        phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        city: getRandom(cities),
        universityId: `mock_uni_${Math.floor(Math.random() * 1000)}`,
        universityName: selectedMaster.universityName,
        courseName: selectedMaster.courseName,
        duration: selectedMaster.duration,
        yearFee: selectedMaster.yearFee,
        semesterFee: selectedMaster.semesterFee,
        status: 'Admission',
        session: getRandom(sessions),
        totalFee: totalFee,
        totalPaid: amountPaid,
        remainingFee: remainingFee,
        payoutPercentage: selectedMaster.payoutPercentage,
        nextDueDate: nextDueDate,
        payments: [paymentRecord],
        counselorId: selectedCounselor.counselorId,
        counselorName: selectedCounselor.counselorName,
      });
    }

    await Student.insertMany(students);

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully seeded 10 accurate relational student records with real counselors and payment history!' 
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
