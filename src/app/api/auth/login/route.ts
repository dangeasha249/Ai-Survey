import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const userPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      department: user.department,
      orcid: user.orcid,
      bio: user.bio,
      surveysManaged: user.surveysManaged || 1,
    };

    setSessionCookie(createSession({ id: user._id.toString(), email: user.email, role: user.role }));
    return NextResponse.json({
      success: true,
      message: "Logged in successfully!",
      user: userPayload,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed." },
      { status: 500 }
    );
  }
}
