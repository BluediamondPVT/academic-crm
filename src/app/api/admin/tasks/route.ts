import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { ROLES } from "@/config/roles";
import { verifyApiAuth } from "@/utils/authGuard";

// GET all tasks (for Admin to view)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    
    // Only Admin can view all tasks
    if (auth.error || !auth.user || auth.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const tasks = await Task.find({})
      .populate('assignee', 'name email role')
      .populate('assignedBy', 'name email role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new task (Admin assigns task to Staff)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    
    // Only Admin can create tasks
    if (auth.error || !auth.user || auth.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, assigneeId, priority, dueDate } = body;

    if (!title || !description || !assigneeId) {
      return NextResponse.json(
        { error: "Title, description, and assignee are required" },
        { status: 400 }
      );
    }

    // Verify assignee exists
    const assigneeUser = await User.findById(assigneeId);
    if (!assigneeUser) {
      return NextResponse.json(
        { error: "Assignee not found" },
        { status: 404 }
      );
    }

    const newTask = await Task.create({
      title,
      description,
      assignee: assigneeId,
      assignedBy: auth.user.userId,
      status: 'PENDING',
      priority: priority || 'MEDIUM',
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
    });

    // Populate for response
    const populatedTask = await Task.findById(newTask._id)
      .populate('assignee', 'name email role')
      .populate('assignedBy', 'name email role');

    return NextResponse.json(
      { success: true, message: "Task created successfully", data: populatedTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
