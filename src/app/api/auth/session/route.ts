import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ success: true, user: null });

  try {
    await connectToDatabase();
    const user = await UserModel.findById(session.id).lean();
    if (!user) return NextResponse.json({ success: true, user: null });
    return NextResponse.json({ success: true, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, institution: user.institution, department: user.department, orcid: user.orcid, bio: user.bio, surveysManaged: user.surveysManaged || 1 } });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to restore session." }, { status: 503 });
  }
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ success: true });
}
