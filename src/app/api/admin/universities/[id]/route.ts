import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import University from '@/models/University';

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
