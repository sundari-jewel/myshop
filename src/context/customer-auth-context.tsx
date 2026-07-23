"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextValue {
  customer: Customer | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (input: { name: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields:      "Please fill in all required fields.",
  password_too_short:  "Use at least 6 characters for your password.",
  email_taken:         "An account already exists for this email.",
  invalid_credentials: "Invalid email or password.",
  internal_error:      "Something went wrong. Please try again.",
};

function friendlyError(code: string): string {
  return ERROR_MESSAGES[code] ?? code;
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  // Restore session from httpOnly cookie via /api/auth/me on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data: Customer | null) => {
        if (data?.id) setCustomer(data);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as Customer & { error?: string };
      if (!res.ok) return { ok: false, error: friendlyError(data.error ?? "internal_error") };
      setCustomer({ id: data.id, name: data.name, email: data.email, phone: data.phone });
      return { ok: true };
    } catch {
      return { ok: false, error: friendlyError("internal_error") };
    }
  }, []);

  const signUp = useCallback(async (input: { name: string; email: string; phone?: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json() as Customer & { error?: string };
      if (!res.ok) return { ok: false, error: friendlyError(data.error ?? "internal_error") };
      setCustomer({ id: data.id, name: data.name, email: data.email, phone: data.phone });
      return { ok: true };
    } catch {
      return { ok: false, error: friendlyError("internal_error") };
    }
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setCustomer(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ customer, ready, signIn, signUp, signOut }),
    [customer, ready, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
