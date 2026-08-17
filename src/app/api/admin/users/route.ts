import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { requireResearcher } from "@/lib/auth";

// GET all registered users from MongoDB
export async function GET() {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const users = await UserModel.find({}, "-password").sort({ createdAt: -1 }).lean();

    const formattedUsers = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Teacher Participant",
      email: u.email,
      role: u.role || "Student",
      institution: u.institution || "Not Specified",
      department: u.department || "Not Specified",
      createdAt: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently",
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      totalUsers: users.length,
    });
  } catch (error: any) {
    console.error("Admin Users GET Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { success: false, message: "Failed to fetch registered users" },
      { status: 500 }
    );
  }
}

// DELETE a specific user by ID
export async function DELETE(request: Request) {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string" || id.length > 128) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await UserModel.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully.",
    });
  } catch (error: any) {
    console.error("Admin Users DELETE Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// POST create or toggle user role
export async function POST(request: Request) {
  if (!requireResearcher()) {
    return NextResponse.json({ success: false, message: "Researcher authorization required." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, userId, newRole } = body;

    if (!action || !userId || typeof userId !== "string") {
      return NextResponse.json({ success: false, message: "Invalid action parameter" }, { status: 400 });
    }

    // Only allow valid roles
    const allowedRoles = ["Researcher", "Student"];
    if (action === "updateRole" && (!newRole || !allowedRoles.includes(newRole))) {
      return NextResponse.json({ success: false, message: "Invalid role value." }, { status: 400 });
    }

    await connectToDatabase();

    if (action === "updateRole" && userId && newRole) {
      await UserModel.updateOne({ _id: userId }, { role: newRole });
      return NextResponse.json({
        success: true,
        message: `User role updated to ${newRole}.`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action parameter" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin Users POST Error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}

