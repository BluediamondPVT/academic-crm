import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  role: string;
  name?: string;
  [key: string]: any;
}

export async function verifyApiAuth(req: NextRequest) {
  try {
    // Cookie se token nikalna
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return { user: null as AuthUser | null, error: "Unauthorized: Token missing", status: 401 };
    }

    // Token ko secret key se verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    
    // Agar valid hai, toh user payload return karna (ismai userId aur role hoga)
    return { user: decoded, error: null, status: 200 };
  } catch (error) {
    return { user: null as AuthUser | null, error: "Unauthorized: Invalid or expired token", status: 401 };
  }
}