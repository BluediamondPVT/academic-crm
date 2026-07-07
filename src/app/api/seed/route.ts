import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ROLES } from "@/config/roles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return NextResponse.json({ message: "Users already exist!" });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create([
      {
        name: "Super Admin",
        email: "admin@bditacademic.com",
        password: hashedPassword,
        role: ROLES.ADMIN,
      },
      {
        name: "AbuSalim Counselor",
        email: "counselor@bditacademic.com",
        password: hashedPassword,
        role: ROLES.COUNSELOR,
      }
    ]); 

    return NextResponse.json({ message: "Dummy users created successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create users" }, { status: 500 });
  }
}