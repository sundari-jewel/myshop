import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const shop = req.nextUrl.searchParams.get("shop");

  if (!code || !shop) {
    return NextResponse.json({ error: "missing code or shop param" }, { status: 400 });
  }

  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
  });

  const data = await res.json() as { access_token?: string; error?: string };

  if (!data.access_token) {
    return NextResponse.json({ error: "no token returned", detail: data }, { status: 400 });
  }

  // Automatically write the new token to .env.local
  try {
    const envPath = join(process.cwd(), ".env.local");
    let env = readFileSync(envPath, "utf-8");
    env = env.replace(
      /SHOPIFY_ADMIN_ACCESS_TOKEN=.*/,
      `SHOPIFY_ADMIN_ACCESS_TOKEN=${data.access_token}`,
    );
    writeFileSync(envPath, env, "utf-8");
  } catch (err) {
    console.error("[shopify/token] failed to write .env.local:", err);
  }

  return NextResponse.json({
    success: true,
    message: ".env.local updated. Restart your dev server now (Ctrl+C then npm run dev).",
    access_token: data.access_token,
  });
}
