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
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const currentStatus = body.status || existingStudent.status || 'Active On Call';
    const oldStatus = existingStudent.status || 'New Lead';

    // Handle Admission state transitions and remark routing
    if (currentStatus === 'Admission') {
      // Transitioning into Admission
      if (oldStatus !== 'Admission') {
        body.preAdmissionStatus = oldStatus;
        body.preAdmissionRemark = existingStudent.remark || '';
        
        // The remark in body.remark is the new admission remark
        const newAdmissionRemark = (body.remark || '').trim();
        body.admissionRemark = newAdmissionRemark;
        body.admissionRemarkUpdatedAt = new Date();
        
        // Keep the pre-admission remark in body.remark so it doesn't get overridden by admission remark
        body.remark = existingStudent.remark || '';
        
        // Update history log if new remark is provided
        if (newAdmissionRemark !== '') {
          const history = [...(existingStudent.remarkHistory || [])];
          history.push({
            remark: newAdmissionRemark,
            updatedAt: new Date(),
            status: 'Admission'
          });
          body.remarkHistory = history;
        }
      } else {
        // Already in Admission status, editing student
        if (body.remark !== undefined) {
          const oldAdmissionRemark = (existingStudent.admissionRemark || '').trim();
          const newAdmissionRemark = (body.remark || '').trim();
          
          if (oldAdmissionRemark !== newAdmissionRemark) {
            body.admissionRemark = newAdmissionRemark;
            body.admissionRemarkUpdatedAt = new Date();
            
            // Push updated admission remark to history
            if (newAdmissionRemark !== '') {
              const history = [...(existingStudent.remarkHistory || [])];
              history.push({
                remark: newAdmissionRemark,
                updatedAt: new Date(),
                status: 'Admission'
              });
              body.remarkHistory = history;
            }
          }
          // Prevent overwriting the pre-admission remark field
          body.remark = existingStudent.remark || '';
        }
      }
    } else {
      // Transitioning OUT of Admission back to a normal status
      if (oldStatus === 'Admission') {
        // If they changed status back, body.remark is a new pre-admission remark
        const newPreAdmissionRemark = (body.remark || '').trim();
        body.remark = newPreAdmissionRemark;
        body.remarkUpdatedAt = new Date();
        
        if (newPreAdmissionRemark !== '') {
          const history = [...(existingStudent.remarkHistory || [])];
          history.push({
            remark: newPreAdmissionRemark,
            updatedAt: new Date(),
            status: currentStatus
          });
          body.remarkHistory = history;
        }
      } else {
        // Regular pre-admission update
        if (body.remark !== undefined) {
          const oldRemark = (existingStudent.remark || '').trim();
          const newRemark = (body.remark || '').trim();
          if (oldRemark !== newRemark) {
            if (newRemark === '') {
              body.remarkUpdatedAt = undefined;
            } else {
              body.remarkUpdatedAt = new Date();
              const history = [...(existingStudent.remarkHistory || [])];
              if (history.length === 0 && oldRemark !== '') {
                history.push({
                  remark: oldRemark,
                  updatedAt: existingStudent.remarkUpdatedAt || existingStudent.updatedAt || new Date(),
                  status: oldStatus
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
