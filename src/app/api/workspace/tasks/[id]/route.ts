import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import { verifyApiAuth } from "@/utils/authGuard";
import { ROLES } from "@/config/roles";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    
    if (auth.error || !auth.user || auth.user.role !== ROLES.STAFF) {
      return NextResponse.json({ error: "Unauthorized. Staff access required." }, { status: 403 });
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the task and ensure it belongs to the logged-in user
    const task = await Task.findOne({ _id: taskId, assignee: auth.user.userId });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 404 });
    }

    task.status = status;
    await task.save();

    return NextResponse.json({ success: true, message: "Task updated successfully", data: task }, { status: 200 });
  } catch (error) {
    console.error("Error updating workspace task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
