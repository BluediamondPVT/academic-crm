import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import University from '@/models/University';

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

    const university = await University.findById(id);

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    return NextResponse.json(university, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching university:', error);
    return NextResponse.json({ error: 'Failed to fetch university' }, { status: 500 });
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
    const {
      name,
      aggregation,
      location,
      contactPersonMobile,
      modeOfLearning,
      payout,
      websiteUrl,
      courses,
    } = body;

    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      {
        name,
        aggregation,
        location,
        contactPersonMobile,
        modeOfLearning,
        payout,
        websiteUrl,
        courses,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUniversity) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUniversity, { status: 200 });
  } catch (error: any) {
    console.error('Error updating university:', error);
    return NextResponse.json({ error: error.message || 'Failed to update university' }, { status: 500 });
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

    const deleted = await University.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'University deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting university:', error);
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 });
  }
}

