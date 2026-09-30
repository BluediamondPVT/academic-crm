import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import InstituteStudent from '@/models/InstituteStudent';
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

    const student = await InstituteStudent.findById(id);
    if (!student) {
      return NextResponse.json({ error: 'Institute student not found' }, { status: 404 });
    }

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName = (auth.user as any).name || req.cookies.get('userName')?.value;
      const isOwner =
        (userIdStr && student.counselorId?.toString() === userIdStr) ||
        (userName && student.counselorName === userName);
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching institute student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institute student' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const student = await InstituteStudent.findById(id);
    if (!student) {
      return NextResponse.json({ error: 'Institute student not found' }, { status: 404 });
    }

    const userName =
      (auth.user as any).name || req.cookies.get('userName')?.value || 'Counselor';

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const isOwner =
        (userIdStr && student.counselorId?.toString() === userIdStr) ||
        student.counselorName === userName;
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const body = await req.json();

    // Check if status or remark is being updated to append history
    const isStatusChanged = body.status && body.status !== student.status;
    const isRemarkChanged = body.remark && body.remark !== student.remark;

    if (isStatusChanged || isRemarkChanged) {
      student.remarkHistory = student.remarkHistory || [];
      student.remarkHistory.push({
        remark: body.remark || student.remark || 'Status updated',
        status: body.status || student.status,
        updatedAt: new Date(),
        updatedBy: userName,
      });
      student.remarkUpdatedAt = new Date();
    }

    // Apply allowed fields update
    const updatableFields = [
      'firstName',
      'middleName',
      'lastName',
      'parentName',
      'mobile',
      'alternateMobile',
      'parentEmail',
      'address',
      'dob',
      'gender',
      'course',
      'qualification',
      'fatherOccupation',
      'institutionName',
      'city',
      'enquiredFrom',
      'status',
      'remark',
      'courseFee',
      'paidAmount',
      'remainingAmount',
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        (student as any)[field] = body[field];
      }
    }

    await student.save();
    return NextResponse.json(student, { status: 200 });
  } catch (error: any) {
    console.error('Error updating institute student:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update institute student' },
      { status: 500 }
    );
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

    const student = await InstituteStudent.findById(id);
    if (!student) {
      return NextResponse.json({ error: 'Institute student not found' }, { status: 404 });
    }

    if (auth.user.role === 'COUNSELOR') {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName = (auth.user as any).name || req.cookies.get('userName')?.value;
      const isOwner =
        (userIdStr && student.counselorId?.toString() === userIdStr) ||
        (userName && student.counselorName === userName);
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await InstituteStudent.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Institute student deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting institute student:', error);
    return NextResponse.json(
      { error: 'Failed to delete institute student' },
      { status: 500 }
    );
  }
}
