import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  role: "Researcher" | "Student";
};

const COOKIE_NAME = "aiedu_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random value of at least 32 characters.");
  }
  return value;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export function getSession(): SessionUser | null {
  try {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    const [payload, receivedSignature] = token.split(".");
    if (!payload || !receivedSignature) return null;
    const expectedSignature = signature(payload);
    const valid = timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
    if (!valid) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionUser & { exp: number };
    if (!decoded.id || !decoded.email || !decoded.role || decoded.exp < Date.now()) return null;
    return { id: decoded.id, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

export function requireResearcher() {
  const session = getSession();
  return session?.role === "Researcher" ? session : null;
}
