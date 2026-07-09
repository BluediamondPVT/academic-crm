import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { ROLES } from "@/config/roles";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
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
      email,
      password: hashedPassword,
      role: ROLES.COUNSELOR,
    });

    return NextResponse.json(
      { 
        message: "Counselor created successfully", 
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
    console.error("Error creating counselor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
