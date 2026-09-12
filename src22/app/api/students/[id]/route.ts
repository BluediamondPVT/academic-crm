import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import University from '@/models/University';
import { verifyApiAuth } from '@/utils/authGuard';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName = (auth.user as any).name || req.cookies.get('userName')?.value;
      const isOwner = (userIdStr && student.counselorId?.toString() === userIdStr) ||
                      (userName && student.counselorName === userName);
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to view this student record' }, { status: 403 });
      }
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName = (auth.user as any).name || req.cookies.get('userName')?.value;
      const isOwner = (userIdStr && existingStudent.counselorId?.toString() === userIdStr) ||
                      (userName && existingStudent.counselorName === userName);
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this student record' }, { status: 403 });
      }
      delete body.counselorId;
      delete body.counselorName;
    }

    const currentStatus = body.status || existingStudent.status || 'Active On Call';
    const oldStatus = existingStudent.status || 'New Lead';

    // Handle Admission state transitions and remark routing
    if (currentStatus === 'Admission') {
      // Transitioning into Admission
      if (oldStatus !== 'Admission') {
        body.preAdmissionStatus = oldStatus;
        body.preAdmissionRemark = existingStudent.remark || '';
        
        // Automatically lookup payoutPercentage from University settings
        try {
          const uId = body.universityId || existingStudent.universityId;
          const university = await University.findById(uId);
          if (university && university.payout) {
            body.payoutPercentage = parseFloat(university.payout.replace(/[^0-9.]/g, '')) || 0;
          }
        } catch (e) {
          console.error('Error fetching university payout ratio:', e);
        }
        
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

    // Handle new payment transaction if submitted
    if (body.paymentTransaction) {
      const history = [...(existingStudent.payments || [])];
      history.push({
        paymentType: body.paymentTransaction.paymentType || 'Yearly',
        amount: Number(body.paymentTransaction.amount) || 0,
        paymentMode: body.paymentTransaction.paymentMode || 'UPI',
        nextDueDate: body.paymentTransaction.nextDueDate ? new Date(body.paymentTransaction.nextDueDate) : undefined,
        date: new Date(),
        remark: body.paymentTransaction.remark || (body.remark && body.remark.trim() !== '' ? body.remark : (existingStudent.admissionRemark || ''))
      });
      body.payments = history;
      delete body.paymentTransaction;
    }

    // Calculate remaining fee if totalFee or totalPaid are updated/present
    const newTotalFee = body.totalFee !== undefined ? Number(body.totalFee) : existingStudent.totalFee || 0;
    const newTotalPaid = body.totalPaid !== undefined ? Number(body.totalPaid) : existingStudent.totalPaid || 0;
    body.remainingFee = newTotalFee - newTotalPaid;

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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName = (auth.user as any).name || req.cookies.get('userName')?.value;
      const isOwner = (userIdStr && existingStudent.counselorId?.toString() === userIdStr) ||
                      (userName && existingStudent.counselorName === userName);
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this student record' }, { status: 403 });
      }
    }

    await Student.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
