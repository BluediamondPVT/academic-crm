import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/lib/db";
import InstituteStudent from "@/models/InstituteStudent";
import { verifyApiAuth } from "@/utils/authGuard";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 },
      );
    }

    let filter: any = {};

    // Counselor access restriction
    if (auth.user.role === "COUNSELOR") {
      const userIdStr = (auth.user as any).userId?.toString();
      const userName =
        (auth.user as any).name || req.cookies.get("userName")?.value;
      const orConditions: any[] = [];
      if (userIdStr) orConditions.push({ counselorId: userIdStr });
      if (userName) orConditions.push({ counselorName: userName });

      if (orConditions.length > 0) {
        filter = { $or: orConditions };
      } else {
        filter = { _id: null };
      }
    } else if (auth.user.role === "ADMIN" || auth.user.role === "ACADEMIC") {
      const { searchParams } = new URL(req.url);
      const filterCounselorId = searchParams.get("counselorId");
      const filterCounselorName = searchParams.get("counselorName");
      if (filterCounselorId && filterCounselorId !== "ALL") {
        filter.counselorId = filterCounselorId;
      } else if (filterCounselorName && filterCounselorName !== "ALL") {
        filter.counselorName = filterCounselorName;
      }
    }

    // URL Query Filters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const course = searchParams.get("course");
    const status = searchParams.get("status");
    const source = searchParams.get("source");

    if (course && course !== "ALL") {
      filter.course = course;
    }

    if (status && status !== "ALL") {
      filter.status = status;
    }

    if (source && source !== "ALL") {
      filter.enquiredFrom = source;
    }

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { mobile: searchRegex },
          { city: searchRegex },
          { course: searchRegex },
        ],
      });
    }

    const students = await InstituteStudent.find(filter).sort({
      createdAt: -1,
    });
    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching institute students:", error);
    return NextResponse.json(
      { error: "Failed to fetch institute students" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = await verifyApiAuth(req);
    if (auth.error || !auth.user) {
      return NextResponse.json(
        { error: auth.error || "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      firstName,
      middleName,
      lastName,
      parentName,
      mobile,
      branch,
      alternateMobile,
      parentEmail,
      address,
      dob,
      gender,
      course,
      qualification,
      fatherOccupation,
      institutionName,
      city,
      enquiredFrom,
      status,
      remark,
      courseFee,
    } = body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 },
      );
    }

    if (!mobile || !mobile.trim()) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 },
      );
    }

    if (!course || !course.trim()) {
      return NextResponse.json(
        { error: "Course selection is required" },
        { status: 400 },
      );
    }

    const counselorId = (auth.user as any).userId?.toString() || "";
    const counselorName =
      (auth.user as any).name ||
      req.cookies.get("userName")?.value ||
      "Counselor";
    const counselorRole = auth.user.role;

    const initialRemarkHistory = [];
    if (remark && remark.trim() !== "") {
      initialRemarkHistory.push({
        remark: remark.trim(),
        updatedAt: new Date(),
        status: status || "New Lead",
        updatedBy: counselorName,
      });
    }

    const newStudent = await InstituteStudent.create({
      firstName: firstName.trim(),
      middleName: middleName ? middleName.trim() : "",
      lastName: lastName ? lastName.trim() : "",
      parentName: parentName ? parentName.trim() : "",
      mobile: mobile.trim(),
      branch: branch ? branch.trim() : "",
      alternateMobile: alternateMobile ? alternateMobile.trim() : "",
      parentEmail: parentEmail ? parentEmail.trim().toLowerCase() : "",
      address: address ? address.trim() : "",
      dob: dob || "",
      gender: gender || "",
      course: course.trim(),
      qualification: qualification ? qualification.trim() : "",
      fatherOccupation: fatherOccupation ? fatherOccupation.trim() : "",
      institutionName: institutionName ? institutionName.trim() : "",
      city: city ? city.trim() : "",
      enquiredFrom: enquiredFrom ? enquiredFrom.trim() : "Walk-in",
      status: status || "New Lead",
      counselorId,
      counselorName,
      counselorRole,
      remark: remark ? remark.trim() : "",
      remarkUpdatedAt: remark ? new Date() : undefined,
      remarkHistory: initialRemarkHistory,
      courseFee: Number(courseFee) || 0,
      paidAmount: 0,
      remainingAmount: Number(courseFee) || 0,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Error creating institute student enquiry:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create institute enquiry" },
      { status: 500 },
    );
  }
}
