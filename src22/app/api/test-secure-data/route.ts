import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "@/utils/apiResponse";
import { verifyApiAuth } from "@/utils/authGuard";

export async function GET(req: NextRequest) {
  try {
    // 1. API hit hote hi pehle Auth Guard chalayenge
    const auth = await verifyApiAuth(req);

    // 2. Agar error hai (token nahi hai ya galat hai), toh turant reject kar do
    if (auth.error) {
      return sendError(auth.error, auth.status);
    }

    // 3. Agar yahan tak code aaya, matlab user verified hai. 
    // auth.user mein uska userId aur role available hai.
    const loggedInUser = auth.user;

    // Yahan hum aage ka database logic likh sakte hain (e.g., fetch students)
    
    return sendSuccess("Secure data fetched successfully!", {
      message: "Yeh data sirf verified users ko dikhega",
      user: loggedInUser,
    });
    
  } catch (error) {
    return sendError("Internal Server Error", 500);
  }
}