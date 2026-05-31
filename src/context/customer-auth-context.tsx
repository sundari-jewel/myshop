"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface StoredCustomer extends Customer {
  password: string;
}

interface AuthContextValue {
  customer: Customer | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (input: { name: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const CUSTOMERS_KEY = "sundari_customers";
const SESSION_KEY = "sundari_customer_session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readCustomers(): StoredCustomer[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMERS_KEY) ?? "[]") as StoredCustomer[];
  } catch {
    return [];
  }
}

function writeCustomers(customers: StoredCustomer[]) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

function publicCustomer(customer: StoredCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  };
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const sessionEmail = localStorage.getItem(SESSION_KEY);
      if (sessionEmail) {
        const stored = readCustomers().find((item) => item.email === sessionEmail);
        if (stored) setCustomer(publicCustomer(stored));
      }
    } finally {
      setReady(true);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalized = normalizeEmail(email);
    const stored = readCustomers().find((item) => item.email === normalized);
    if (!stored || stored.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }

    localStorage.setItem(SESSION_KEY, stored.email);
    setCustomer(publicCustomer(stored));
    return { ok: true };
  }, []);

  const signUp = useCallback(async (input: { name: string; email: string; phone?: string; password: string }) => {
    const normalized = normalizeEmail(input.email);
    if (input.password.length < 6) {
      return { ok: false, error: "Use at least 6 characters for your password." };
    }

    const customers = readCustomers();
    if (customers.some((item) => item.email === normalized)) {
      return { ok: false, error: "An account already exists for this email." };
    }

    const stored: StoredCustomer = {
      id: `cust-${Date.now()}`,
      name: input.name.trim(),
      email: normalized,
      phone: input.phone?.trim() || undefined,
      password: input.password,
    };

    writeCustomers([...customers, stored]);
    localStorage.setItem(SESSION_KEY, stored.email);
    setCustomer(publicCustomer(stored));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCustomer(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ customer, ready, signIn, signUp, signOut }), [customer, ready, signIn, signOut, signUp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
