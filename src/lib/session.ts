import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-dev-secret");
export const SESSION_COOKIE = "sj_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: MAX_AGE,
  path: "/",
};

/** Creates a signed JWT and attaches it as a cookie on the given NextResponse. */
export async function createSession(
  payload: SessionPayload,
  response: NextResponse,
): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);

  response.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

/** Reads and verifies the session from the incoming request cookie. */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Clears the session cookie on the given NextResponse. */
export function clearSession(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
}
