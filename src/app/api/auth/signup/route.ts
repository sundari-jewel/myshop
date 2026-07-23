import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json() as {
      name: string; email: string; phone?: string; password: string;
    };

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "password_too_short" }, { status: 400 });
    }

    await connectDB();

    const exists = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    }

    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      passwordHash: password,
    });

    const response = NextResponse.json({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    }, { status: 201 });

    await createSession({
      id:    String(customer._id),
      name:  customer.name,
      email: customer.email,
      phone: customer.phone,
    }, response);

    return response;
  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
