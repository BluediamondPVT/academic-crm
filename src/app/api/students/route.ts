import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import University from '@/models/University';

export async function GET() {
  try {
    await connectToDatabase();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      phoneNumber,
      email,
      remark,
      universityId,
      universityName,
      courseName,
      specialization,
      duration,
      totalFee,
      yearFee,
      semesterFee,
      status,
      counselorName,
      city,
      totalPaid,
    } = body;

    // Validate required fields
    if (!name || !phoneNumber || !universityId || !universityName || !courseName || !city) {
      return NextResponse.json(
        { error: 'Name, Phone Number, University, and Course are required fields.' },
        { status: 400 }
      );
    }

    const feeTotal = Number(totalFee) || 0;
    const paidTotal = Number(totalPaid) || 0;
    const remainingFee = feeTotal - paidTotal;

    const isAdmission = status === 'Admission';
    const payments = body.paymentTransaction ? [{
      paymentType: body.paymentTransaction.paymentType || 'Yearly',
      amount: Number(body.paymentTransaction.amount) || 0,
      paymentMode: body.paymentTransaction.paymentMode || 'UPI',
      nextDueDate: body.paymentTransaction.nextDueDate ? new Date(body.paymentTransaction.nextDueDate) : undefined,
      date: new Date(),
      remark: body.paymentTransaction.remark || remark || ''
    }] : [];

    // Automatically lookup payoutPercentage from University settings
    let coursePayout = 0;
    try {
      const university = await University.findById(universityId);
      if (university && university.payout) {
        coursePayout = parseFloat(university.payout.replace(/[^0-9.]/g, '')) || 0;
      }
    } catch (e) {
      console.error('Error fetching university payout:', e);
    }

    const newStudent = await Student.create({
      name,
      phoneNumber,
      email,
      remark: isAdmission ? '' : remark,
      remarkUpdatedAt: isAdmission ? undefined : (remark && remark.trim() !== '' ? new Date() : undefined),
      remarkHistory: remark && remark.trim() !== '' ? [{ remark: remark.trim(), updatedAt: new Date(), status: status || 'Active On Call' }] : [],
      admissionRemark: isAdmission ? remark : undefined,
      admissionRemarkUpdatedAt: isAdmission ? new Date() : undefined,
      preAdmissionStatus: isAdmission ? 'New Lead' : undefined,
      preAdmissionRemark: isAdmission ? '' : undefined,
      universityId,
      universityName,
      courseName,
      specialization,
      duration,
      totalFee: feeTotal,
      yearFee,
      semesterFee,
      payoutPercentage: coursePayout,
      totalPaid: paidTotal,
      remainingFee,
      payments,
      status: status || 'Active On Call',
      counselorName,
      city,
    });

    return NextResponse.json(
      { message: 'Student added successfully', student: newStudent },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add student' },
      { status: 500 }
    );
  }
}
