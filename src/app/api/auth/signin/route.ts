import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { createSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIp(req);
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    // Two independent rate-limit gates: one per IP (blocks a single machine from
    // spraying many accounts), one per email (blocks an attacker rotating IPs
    // against a single victim). Either alone will block the request.
    const normalizedEmail = email.toLowerCase().trim();
    const [ipGate, emailGate] = await Promise.all([
      checkRateLimit({
        scope:      "auth:signin:ip",
        identifier: ip,
        max:        20,
        windowMs:   15 * 60 * 1000, // 20 attempts per IP per 15 min
      }),
      checkRateLimit({
        scope:      "auth:signin:email",
        identifier: normalizedEmail,
        max:        10,
        windowMs:   15 * 60 * 1000, // 10 attempts per email per 15 min
      }),
    ]);
    if (!ipGate.allowed || !emailGate.allowed) {
      return NextResponse.json(
        { error: "rate_limit_exceeded" },
        { status: 429 },
      );
    }

    await connectDB();

    const customer = await Customer.findOne({ email: normalizedEmail });
    if (!customer) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    if (password !== customer.passwordHash) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    const response = NextResponse.json({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    await createSession({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    }, response);

    return response;
  } catch (err) {
    console.error("[signin]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
