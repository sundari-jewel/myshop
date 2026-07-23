"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { Eye, EyeOff, Gem, Loader2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useCustomerAuth } from "@/context/customer-auth-context";

type Mode = "signin" | "signup";

export function CustomerAuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp } = useCustomerAuth();
  const nextPath = searchParams.get("next") || "/account";
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const alternateHref = useMemo(() => {
    const base = isSignup ? "/signin" : "/signup";
    return `${base}?next=${encodeURIComponent(nextPath)}` as Route;
  }, [isSignup, nextPath]);

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = isSignup
      ? await signUp({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      : await signIn(form.email, form.password);

    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(nextPath as Route);
  }

  return (
    <div className="bg-[var(--surface)]">
      <div className="container-shell grid min-h-[72vh] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section
          className="relative overflow-hidden border bg-[var(--bg-dark)] p-7 text-[var(--cream)] sm:p-9"
          style={{ borderColor: "rgba(201,169,110,0.24)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-55"
            style={{
              background:
                "linear-gradient(135deg, rgba(14,4,4,0.96), rgba(42,14,14,0.8)), url('/assets/Final_product_reveal.webp')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold-light)]">
              <Gem size={16} />
              Sundari Circle
            </p>
            <h1 className="display-font mt-4 max-w-xl text-5xl font-semibold leading-[0.95] sm:text-6xl">
              {isSignup ? "Create your jewellery vault" : "Welcome back to your vault"}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--cream-muted)]">
              Save wishlists, keep cart pieces across visits, and move through checkout with your details ready.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-[var(--gold-pale)]">
              <p className="flex items-center gap-3 border-t pt-3" style={{ borderColor: "rgba(201,169,110,0.22)" }}>
                <LockKeyhole size={16} />
                Secure cart and checkout flow
              </p>
              <p className="flex items-center gap-3 border-t pt-3" style={{ borderColor: "rgba(201,169,110,0.22)" }}>
                <Gem size={16} />
                Wishlist pieces saved to your account
              </p>
            </div>
          </div>
        </section>

        <section className="border bg-[var(--surface-card)] p-5 shadow-[0_24px_70px_rgba(82,45,12,0.1)] sm:p-7" style={{ borderColor: "rgba(138,106,58,0.18)" }}>
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--ruby)]">
              {isSignup ? "Sign up" : "Sign in"}
            </p>
            <h2 className="display-font mt-2 text-4xl font-semibold">
              {isSignup ? "Start your account" : "Access your account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {isSignup ? (
              <Field
                icon={<UserRound size={17} />}
                label="Full name"
                value={form.name}
                onChange={(value) => set("name", value)}
                placeholder="Priya Sharma"
                required
              />
            ) : null}
            <Field
              icon={<Mail size={17} />}
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => set("email", value)}
              placeholder="you@example.com"
              required
            />
            {isSignup ? (
              <Field
                icon={<Phone size={17} />}
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(value) => set("phone", value)}
                placeholder="+91 98765 43210"
              />
            ) : null}
            <label>
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">Password</span>
              <span
                className="focus-within:ring-2 focus-within:ring-[var(--gold)] grid h-12 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sm border bg-white px-3"
                style={{ borderColor: "rgba(138,106,58,0.2)" }}
              >
                <span className="text-[var(--gold-dim)]"><LockKeyhole size={17} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="h-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[rgba(107,66,38,0.58)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[var(--gold-dim)] transition-colors hover:text-[var(--gold)]"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {error ? <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-[var(--bg-dark)] px-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--gold-pale)] transition-opacity disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
            {isSignup ? "Already have an account?" : "New to Sundari?"}{" "}
            <Link href={alternateHref} className="font-bold text-[var(--ruby)]">
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">{label}</span>
      <span
        className="focus-within:ring-2 focus-within:ring-[var(--gold)] grid h-12 grid-cols-[auto_1fr] items-center gap-3 rounded-sm border bg-white px-3"
        style={{ borderColor: "rgba(138,106,58,0.2)" }}
      >
        <span className="text-[var(--gold-dim)]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[rgba(107,66,38,0.58)]"
        />
      </span>
    </label>
  );
}
