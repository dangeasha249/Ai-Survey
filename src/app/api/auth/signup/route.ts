import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, institution, department, bio, orcid } = body;

    if (!name || !email || !password || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new UserModel({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      // Researcher access is provisioned by an administrator, never selected by a public sign-up form.
      role: "Student",
      institution: institution || "University of Mumbai / Higher Education Cell",
      department: department || "Department of Computer Science",
      bio: bio || "Researcher studying AI tools in education.",
      orcid: orcid || "0000-0002-1825-009X",
    });

    await newUser.save();

    const userPayload = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      institution: newUser.institution,
      department: newUser.department,
      orcid: newUser.orcid,
      bio: newUser.bio,
      surveysManaged: newUser.surveysManaged || 1,
    };

    setSessionCookie(createSession({ id: newUser._id.toString(), email: newUser.email, role: newUser.role }));
    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: userPayload,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create account." },
      { status: 500 }
    );
  }
}
