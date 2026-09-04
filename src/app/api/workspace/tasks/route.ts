import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import { verifyApiAuth } from "@/utils/authGuard";
import { ROLES } from "@/config/roles";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    
    if (auth.error || !auth.user || auth.user.role !== ROLES.STAFF) {
      return NextResponse.json({ error: "Unauthorized. Staff access required." }, { status: 403 });
    }

    // Fetch tasks assigned to the current user
    const tasks = await Task.find({ assignee: auth.user.userId })
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workspace tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
