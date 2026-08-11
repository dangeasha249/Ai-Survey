import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { getSession } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, institution, department, orcid, bio } = body;
    const session = getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : undefined;
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: session.id },
      {
        $set: {
          ...(clean(name, 120) !== undefined && { name: clean(name, 120) }),
          ...(clean(institution, 200) !== undefined && { institution: clean(institution, 200) }),
          ...(clean(department, 160) !== undefined && { department: clean(department, 160) }),
          ...(clean(orcid, 32) !== undefined && { orcid: clean(orcid, 32) }),
          ...(clean(bio, 1000) !== undefined && { bio: clean(bio, 1000) }),
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully in MongoDB!",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        institution: updatedUser.institution,
        department: updatedUser.department,
        orcid: updatedUser.orcid,
        bio: updatedUser.bio,
        surveysManaged: updatedUser.surveysManaged || 1,
      },
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
