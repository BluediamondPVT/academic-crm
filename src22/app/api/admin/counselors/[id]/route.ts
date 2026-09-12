import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { ROLES } from "@/config/roles";
import bcrypt from "bcryptjs";
import { verifyApiAuth } from "@/utils/authGuard";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user || auth.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 });
    }

    if (email) {
      const sanitizedEmail = email.trim().toLowerCase();
      if (sanitizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
          return NextResponse.json(
            { error: "A user with this email already exists" },
            { status: 409 }
          );
        }
        user.email = sanitizedEmail;
      }
    }

    if (name) {
      user.name = name;
    }

    if (role && (role === ROLES.COUNSELOR || role === ROLES.ACADEMIC)) {
      user.role = role;
    }

    if (password && password.trim().length > 0) {
      if (password.trim().length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Staff member updated successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating counselor:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update counselor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user || auth.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Counselor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Counselor deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting counselor:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete counselor" },
      { status: 500 }
    );
  }
}
