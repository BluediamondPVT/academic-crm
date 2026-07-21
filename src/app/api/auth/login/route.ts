import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Tumhare custom response handlers (agar inmein error aaye toh simply NextResponse.json use kar lena)
import { sendSuccess, sendError } from "@/utils/apiResponse"; 

export async function POST(req: Request) {
  try {
    // 1. Connect to MongoDB (Ab yeh safely cached connection use karega)
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return sendError("Email and password are required", 400);
    }

    // 2. Find user by email and select password explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError("Invalid email or password", 401);
    }

    // 3. Compare passwords using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return sendError("Invalid email or password", 401);
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is missing in .env");
      return sendError("Server configuration error", 500);
    }

    // 4. Generate JWT Token
    const tokenPayload = {
      userId: user._id,
      role: user.role,
      name: user.name,
    };
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

    // 5. Setup Response
    const response = sendSuccess("Login successful", { 
      name: user.name, 
      role: user.role,
      email: user.email
    });

    // 6. Set Cookies securely
    const oneDay = 60 * 60 * 24; // in seconds

    response.cookies.set("authToken", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // true on Vercel, false on localhost
      sameSite: "strict",
      path: "/",
      maxAge: oneDay 
    });
    
    response.cookies.set("userRole", user.role, { 
      path: "/",
      maxAge: oneDay
    });
    
    response.cookies.set("userName", user.name, {
      path: "/",
      maxAge: oneDay
    });

    return response;

  } catch (error: any) {
    // Exact error logging in terminal
    console.error("🚨 Login API Error:", error.message || error);
    return sendError("Internal Server Error", 500);
  }
}