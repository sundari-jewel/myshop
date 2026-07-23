import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    await connectDB();

    const customer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!customer) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    if (password !== customer.passwordHash) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    await createSession({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    return NextResponse.json({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  } catch (err) {
    console.error("[signin]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
