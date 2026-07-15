import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Check if remark is being updated and set timestamp
    if (body.remark !== undefined) {
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
      const oldRemark = (existingStudent.remark || '').trim();
      const newRemark = (body.remark || '').trim();
      if (oldRemark !== newRemark) {
        if (newRemark === '') {
          body.remarkUpdatedAt = null;
        } else {
          body.remarkUpdatedAt = new Date();
          
          const currentStatus = body.status || existingStudent.status || 'Active On Call';
          const history = [...(existingStudent.remarkHistory || [])];
          if (history.length === 0 && oldRemark !== '') {
            history.push({
              remark: oldRemark,
              updatedAt: existingStudent.remarkUpdatedAt || existingStudent.updatedAt || new Date(),
              status: existingStudent.status || 'Active On Call'
            });
          }
          history.push({
            remark: newRemark,
            updatedAt: new Date(),
            status: currentStatus
          });
          body.remarkHistory = history;
        }
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error: any) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: error.message || 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
