import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import University from '@/models/University';

export async function GET() {
  try {
    await connectToDatabase();
    const universities = await University.find().sort({ createdAt: -1 });
    return NextResponse.json(universities, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
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
      aggregation,
      location,
      contactPersonMobile,
      modeOfLearning,
      payout,
      websiteUrl,
      courses,
    } = body;

    // Validate required fields
    if (
      !name ||
      !aggregation ||
      !location ||
      !contactPersonMobile ||
      !modeOfLearning ||
      !payout ||
      !websiteUrl ||
      !courses ||
      !Array.isArray(courses) ||
      courses.length === 0
    ) {
      return NextResponse.json(
        { error: 'All fields are required, including at least one course.' },
        { status: 400 }
      );
    }

    const newUniversity = await University.create({
      name,
      aggregation,
      location,
      contactPersonMobile,
      modeOfLearning,
      payout,
      websiteUrl,
      courses,
    });

    return NextResponse.json(
      { message: 'University added successfully', university: newUniversity },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding university:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add university' },
      { status: 500 }
    );
  }
}
