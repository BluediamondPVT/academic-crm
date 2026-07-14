import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

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
    } = body;

    // Validate required fields
    if (!name || !phoneNumber || !universityId || !universityName || !courseName || !city) {
      return NextResponse.json(
        { error: 'Name, Phone Number, University, and Course are required fields.' },
        { status: 400 }
      );
    }

    const newStudent = await Student.create({
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
