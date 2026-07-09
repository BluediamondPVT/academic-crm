// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ROLES } from "@/config/roles";

export async function GET() {
  try {
    await connectToDatabase();

    // Check if demo users already exist
    const adminExists = await User.findOne({ email: "admin@bditacademic.com" });
    
    if (adminExists) {
        return NextResponse.json({ message: "Database already seeded!" });
    }

    // Encrypt the password once
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin User
    await User.create({
      name: "Super Admin",
      email: "admin@bditacademic.com",
      password: hashedPassword,
      role: ROLES.ADMIN,
      isActive: true,
    });

    // Create Counselor User
    await User.create({
      name: "Test Counselor",
      email: "counselor@bditacademic.com",
      password: hashedPassword,
      role: ROLES.COUNSELOR,
      isActive: true,
    });

    return NextResponse.json({ message: "Database successfully seeded with demo users!" });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}