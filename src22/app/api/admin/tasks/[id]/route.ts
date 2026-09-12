import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import { verifyApiAuth } from "@/utils/authGuard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const task = await Task.findById(id)
      .populate("assignee", "name email role")
      .populate("assignedBy", "name email role");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching single task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
