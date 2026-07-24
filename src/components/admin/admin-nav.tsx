"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Sparkles, LogOut, Database,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

const NAV: { href: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/products", label: "Products",   icon: Package },
  { href: "/admin/orders",   label: "Orders",     icon: ShoppingBag },
  { href: "/admin/tryon",    label: "Try-On",     icon: Sparkles },
  { href: "/admin/seed",     label: "Seed DB",    icon: Database },
];

export function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <aside
        className="flex w-full shrink-0 items-center border-b px-2 py-2 lg:w-56 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:px-3 lg:py-6"
        style={{ background: "var(--bg-dark)", borderColor: "rgba(138,106,58,0.18)" }}
      >
      {/* Logo */}
      <div className="hidden px-3 lg:mb-8 lg:block">
        <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--gold-dim)]">Sundari Jewellers</p>
        <p className="font-cormorant mt-0.5 text-xl font-semibold text-[var(--gold)]">Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2.5 text-xs transition-colors lg:gap-3 lg:px-3 lg:text-sm"
              style={{
                background: active ? "rgba(138,106,58,0.18)" : "transparent",
                color:      active ? "var(--gold)" : "var(--cream-muted)",
              }}
            >
              <Icon size={16} strokeWidth={1.6} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => setConfirmLogout(true)}
        className="ml-1 flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2.5 text-xs transition-colors hover:text-red-400 lg:ml-0 lg:gap-3 lg:px-3 lg:text-sm"
        style={{ color: "var(--cream-muted)" }}
      >
        <LogOut size={16} strokeWidth={1.6} />
        Logout
      </button>
      </aside>

      <ConfirmationDialog
        open={confirmLogout}
        title="Leave the admin panel?"
        description="You will be signed out and returned to the admin login page."
        confirmLabel="Log out"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={logout}
      />
    </>
  );
}
