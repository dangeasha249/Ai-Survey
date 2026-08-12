import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";

// GET all registered users from MongoDB
export async function GET() {
  try {
    await connectToDatabase();
    const users = await UserModel.find({}, "-password").sort({ createdAt: -1 }).lean();

    const formattedUsers = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name || "Student Participant",
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
    console.error("Admin Users GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch registered users" },
      { status: 500 }
    );
  }
}

// DELETE a specific user by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
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
    console.error("Admin Users DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// POST create or toggle user role
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, newRole } = body;

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
    console.error("Admin Users POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
