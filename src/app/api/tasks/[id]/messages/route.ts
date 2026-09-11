import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { ROLES } from "@/config/roles";
import { verifyApiAuth } from "@/utils/authGuard";

// GET messages for a specific task
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
    const task = await Task.findById(taskId).select("messages assignee assignedBy");
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isAssignee = auth.user.userId === task.assignee?.toString();
    const isAdmin = auth.user.role === ROLES.ADMIN;
    if (!isAssignee && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to view messages" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: task.messages || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST a new message / revert on a task
export async function POST(
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
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if user is either Admin or the assigned member
    const isAssignee = auth.user.userId === task.assignee?.toString();
    const isAdmin = auth.user.role === ROLES.ADMIN;
    if (!isAssignee && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized to send messages on this task" }, { status: 403 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message text cannot be empty" }, { status: 400 });
    }

    // Resolve sender display name
    let senderName = auth.user.name || request.cookies.get("userName")?.value;
    if (!senderName) {
      const userDoc = await User.findById(auth.user.userId).select("name");
      senderName = userDoc?.name || (isAdmin ? "Super Admin" : "Team Member");
    }

    const newMessage = {
      sender: auth.user.userId,
      senderRole: auth.user.role,
      senderName,
      text: text.trim(),
      createdAt: new Date(),
    };

    task.messages.push(newMessage);
    await task.save();

    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: task.messages },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting task message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
