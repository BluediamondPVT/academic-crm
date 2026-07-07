import { sendSuccess, sendError } from "@/utils/apiResponse";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1. Connect to MongoDB
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return sendError("Email and password are required", 400);
    }

    // 2. Find user by email. 
    // Note: Humein '.select("+password")' use karna padega kyunki humne schema mein password ko 'select: false' rakha tha (for security).
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return sendError("Invalid email or password", 401);
    }

    // 3. Compare passwords using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return sendError("Invalid email or password", 401);
    }

    // 4. Generate Real JWT Token
    const tokenPayload = {
      userId: user._id,
      role: user.role,
    };
    
    // Token 1 din ke liye valid rahega
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

    // 5. Send Response and Set Cookies
    const response = sendSuccess("Login successful", { 
      name: user.name, 
      role: user.role 
    });

    // Dummy token hata ke ab REAL token set kar rahe hain
    response.cookies.set("authToken", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      path: "/",
      maxAge: 60 * 60 * 24 // 1 Day
    });
    
    response.cookies.set("userRole", user.role, { 
      path: "/",
      maxAge: 60 * 60 * 24 // 1 Day
    });
    
    // Also set the user's display name in a cookie for UI display
    response.cookies.set("userName", user.name, {
      path: "/",
      maxAge: 60 * 60 * 24 // 1 Day
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return sendError("Internal Server Error", 500);
  }
}