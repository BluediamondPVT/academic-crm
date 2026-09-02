import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { ROLES } from "@/config/roles";
import bcrypt from "bcryptjs";
import { verifyApiAuth } from "@/utils/authGuard";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    if (auth.error || !auth.user || auth.user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }
    
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const assignedRole = (role === ROLES.ACADEMIC) ? ROLES.ACADEMIC : ROLES.COUNSELOR;

    // Trim and lowercase email
    const sanitizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: sanitizedEmail,
      password: hashedPassword,
      role: assignedRole,
    });

    return NextResponse.json(
      { 
        message: `${assignedRole === ROLES.ACADEMIC ? "Academic staff" : "Counselor"} created successfully`, 
        user: { 
          id: newUser._id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating staff user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(request);
    if (auth.error || !auth.user || (auth.user.role !== ROLES.ADMIN && auth.user.role !== ROLES.ACADEMIC)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role");

    let query: any = { role: { $in: [ROLES.COUNSELOR, ROLES.ACADEMIC] } };
    if (roleParam && (roleParam === ROLES.COUNSELOR || roleParam === ROLES.ACADEMIC)) {
      query = { role: roleParam };
    }

    const staffMembers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(staffMembers, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}
