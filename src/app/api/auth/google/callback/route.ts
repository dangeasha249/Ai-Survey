import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSession, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // User denied access or error from Google
    if (error || !code) {
      return NextResponse.redirect(`${appUrl}/?auth=signin&error=google_denied`);
    }

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${appUrl}/?auth=signin&error=google_not_configured`);
    }

    // Step 1: Exchange authorization code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      return NextResponse.redirect(`${appUrl}/?auth=signin&error=google_token_failed`);
    }

    // Step 2: Fetch user profile from Google
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${appUrl}/?auth=signin&error=google_no_email`);
    }

    // Step 3: Find or create user in MongoDB
    await connectToDatabase();

    const email = profile.email.toLowerCase().trim();
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Create new user from Google profile (no password for OAuth users)
      user = await UserModel.create({
        name: profile.name || email.split("@")[0],
        email,
        role: "Student",
        institution: "Higher Education Institute",
        department: "Not Specified",
      });
    }

    // Step 4: Create session and set cookie
    const sessionToken = createSession({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.redirect(`${appUrl}/`);
    setSessionCookie(sessionToken);

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.redirect(`${appUrl}/?auth=signin&error=google_server_error`);
  }
}
