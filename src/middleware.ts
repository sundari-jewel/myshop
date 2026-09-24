import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin/* except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = token ? await verifyAdminToken(token) : false;
    if (!valid) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all /api/admin/* except /api/admin/auth
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = token ? await verifyAdminToken(token) : false;
    if (!valid) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  // Protect /api/shopify/token — this is a Shopify OAuth callback that exposes an Admin API token.
  // Only signed-in admins should be able to reach it.
  if (pathname.startsWith("/api/shopify/token")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = token ? await verifyAdminToken(token) : false;
    if (!valid) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/shopify/:path*"],
};
