import { sendSuccess, sendError } from "@/utils/apiResponse";

export async function POST() {
  try {
    const response = sendSuccess("Logged out successfully");

    response.cookies.set("authToken", "", { path: "/", maxAge: 0 });
    response.cookies.set("userRole", "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    return sendError("Failed to logout", 500);
  }
}