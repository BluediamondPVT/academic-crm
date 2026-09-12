import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // You can restrict this to your landing page domain in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify API Key for security
    // In production, set EXTERNAL_LEAD_API_KEY in your .env file
    const EXPECTED_API_KEY = process.env.EXTERNAL_LEAD_API_KEY || 'my-super-secret-landing-page-key-123';
    
    const providedApiKey = req.headers.get('x-api-key');
    if (providedApiKey !== EXPECTED_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid API Key.' },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Connect to database
    await connectToDatabase();

    // 3. Parse incoming data
    const body = await req.json();
    const { name, phoneNumber, email, courseName, city } = body;

    // Validate required fields from the landing page
    if (!name || !phoneNumber || !courseName) {
      return NextResponse.json(
        { error: 'Name, Phone Number, and Course Name are required fields.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Set defaults for fields required by the Student model but not provided by the form
    // Since the landing page doesn't have a university dropdown, we use placeholders.
    const defaultUniversityId = 'PENDING_UNIVERSITY_SELECTION';
    const defaultUniversityName = 'To Be Decided';

    // 5. Save to database
    const newLead = await Student.create({
      name: name,
      phoneNumber: phoneNumber,
      email: email || '',
      courseName: courseName,
      city: city || '',
      // Required defaults
      universityId: defaultUniversityId,
      universityName: defaultUniversityName,
      // Default lead settings
      status: 'New Lead', 
      remark: 'Lead received from External Website',
      remarkUpdatedAt: new Date(),
      remarkHistory: [
        {
          remark: 'Lead received from External Website',
          updatedAt: new Date(),
          status: 'New Lead'
        }
      ],
      // Financial defaults
      totalFee: 0,
      totalPaid: 0,
      remainingFee: 0,
      payoutPercentage: 0,
    });

    // 6. Return success response
    return NextResponse.json(
      { message: 'Lead submitted successfully', leadId: newLead._id },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Error receiving external lead:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process lead' },
      { status: 500, headers: corsHeaders }
    );
  }
}
