// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { ROLES } from "@/config/roles";

export async function GET() {
  try {
    await connectToDatabase();

    const hashedPassword = await bcrypt.hash("password123", 10);
    const results: string[] = [];

    // 1. Admin User
    const adminExists = await User.findOne({ email: "admin@bditacademic.com" });
    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: "admin@bditacademic.com",
        password: hashedPassword,
        role: ROLES.ADMIN,
        isActive: true,
      });
      results.push("Super Admin created");
    } else {
      results.push("Super Admin already exists");
    }

    // 2. Counselor User
    const counselorExists = await User.findOne({ email: "counselor@bditacademic.com" });
    if (!counselorExists) {
      await User.create({
        name: "Test Counselor",
        email: "counselor@bditacademic.com",
        password: hashedPassword,
        role: ROLES.COUNSELOR,
        isActive: true,
      });
      results.push("Test Counselor created");
    } else {
      results.push("Test Counselor already exists");
    }

    // 3. Academic User
    const academicExists = await User.findOne({ email: "academic@bditacademic.com" });
    if (!academicExists) {
      await User.create({
        name: "Academic Team",
        email: "academic@bditacademic.com",
        password: hashedPassword,
        role: ROLES.ACADEMIC,
        isActive: true,
      });
      results.push("Academic Team created");
    } else {
      results.push("Academic Team already exists");
    }

    return NextResponse.json({
      message: "Database seed completed!",
      details: results,
    });
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}