import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyApiAuth } from "@/utils/authGuard";
import { ROLES } from "@/config/roles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const task = await Task.findById(taskId)
      .populate("assignee", "name email role")
      .populate("assignedBy", "name email role");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAssignee = task.assignee?._id?.toString() === auth.user.userId;
    const isAdmin = auth.user.role === ROLES.ADMIN;
    if (!isAssignee && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to view this task" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching single workspace task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Find the task and ensure it belongs to the logged-in user or admin
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAssignee = task.assignee?.toString() === auth.user.userId;
    const isAdmin = auth.user.role === ROLES.ADMIN;
    if (!isAssignee && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to update this task" }, { status: 403 });
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
