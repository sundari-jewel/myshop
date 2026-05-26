"use client";

import { useState } from "react";
import {
  Database, Trash2, RefreshCw, CheckCircle2, XCircle,
  Package, ShoppingBag, Sparkles, BarChart2, Clock, Loader2,
} from "lucide-react";

interface SeedSummary {
  products:        { slug: string; action: string }[];
  orders:          number;
  tryonConfigs:    number;
  tryonSessions:   number;
  tryonJobs:       number;
  analyticsEvents: number;
}

interface SeedResult {
  ok:      boolean;
  summary: SeedSummary;
}

type Phase = "idle" | "seeding" | "clearing" | "done" | "error";

const ENTITY_ICONS: Record<string, typeof Package> = {
  Products:       Package,
  Orders:         ShoppingBag,
  "Try-On Config": Sparkles,
  "Try-On Sessions": Clock,
  "Try-On Jobs":  RefreshCw,
  "Analytics Events": BarChart2,
};

export default function AdminSeedPage() {
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [result,  setResult]  = useState<SeedResult | null>(null);
  const [cleared, setCleared] = useState(false);
  const [error,   setError]   = useState("");

  async function safeJson<T>(res: Response): Promise<T> {
    const text = await res.text();
    if (!text) throw new Error(`Server returned empty response (HTTP ${res.status})`);
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Invalid JSON from server: ${text.slice(0, 120)}`);
    }
  }

  async function runSeed(reset = false) {
    setPhase("seeding");
    setResult(null);
    setCleared(false);
    setError("");
    try {
      const url = reset ? "/api/admin/seed?reset=true" : "/api/admin/seed";
      const res  = await fetch(url, { method: "POST" });
      const data = await safeJson<SeedResult & { error?: string }>(res);
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Seed failed");
      setResult(data);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }

  async function clearAll() {
    if (!confirm("This will delete ALL seed data from every collection. Continue?")) return;
    setPhase("clearing");
    setResult(null);
    setError("");
    try {
      const res  = await fetch("/api/admin/seed", { method: "DELETE" });
      const data = await safeJson<{ ok: boolean; error?: string; message?: string }>(res);
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Clear failed");
      setCleared(true);
      setPhase("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  }

  const busy = phase === "seeding" || phase === "clearing";

  const entityRows = result
    ? [
        { label: "Products",          value: `${result.summary.products.filter(p => p.action === "inserted").length} inserted, ${result.summary.products.filter(p => p.action === "skipped").length} skipped` },
        { label: "Orders",            value: `${result.summary.orders} created` },
        { label: "Try-On Config",     value: `${result.summary.tryonConfigs} upserted` },
        { label: "Try-On Sessions",   value: `${result.summary.tryonSessions} created` },
        { label: "Try-On Jobs",       value: `${result.summary.tryonJobs} created` },
        { label: "Analytics Events",  value: `${result.summary.analyticsEvents} created` },
      ]
    : [];

  return (
    <div className="mx-auto max-w-2xl p-8" style={{ color: "var(--cream)" }}>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Database size={22} className="text-[var(--gold)]" />
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-[var(--gold)]">Seed Database</h1>
          <p className="mt-0.5 text-sm text-[var(--cream-muted)]">
            Populate all collections with realistic dummy data for development and testing
          </p>
        </div>
      </div>

      {/* What gets seeded */}
      <div className="mb-6 rounded-xl p-6 space-y-3" style={{ background: "var(--bg-dark)", border: "1px solid rgba(138,106,58,0.18)" }}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dim)]">What gets seeded</h2>
        {[
          { Icon: Package,    label: "6 Products",            detail: "From the Sundari catalog — bridal, daily gold, diamond edit" },
          { Icon: ShoppingBag,label: "12 Orders",             detail: "Varied statuses, payment methods, real Indian addresses" },
          { Icon: Sparkles,   label: "6 Try-On Configs",      detail: "Per-product SKU config, first 3 enabled with jewellery types" },
          { Icon: Clock,      label: "8 Try-On Sessions",     detail: "Mix of active and expired sessions with photo keys" },
          { Icon: RefreshCw,  label: "8 Try-On Jobs",         detail: "Complete, failed, and processing job states" },
          { Icon: BarChart2,  label: "~24 Analytics Events",  detail: "tryon_started, result_viewed, add_to_cart, share_tapped…" },
        ].map(({ Icon, label, detail }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon size={14} className="mt-0.5 shrink-0 text-[var(--gold-dim)]" />
            <div>
              <span className="text-sm font-medium text-[var(--cream)]">{label}</span>
              <span className="ml-2 text-xs text-[var(--cream-muted)]">{detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => runSeed(false)}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
          style={{ background: "var(--gold)", color: "var(--bg-dark)" }}
        >
          {phase === "seeding" ? <Loader2 size={15} className="animate-spin" /> : <Database size={15} />}
          {phase === "seeding" ? "Seeding…" : "Seed (skip existing)"}
        </button>

        <button
          onClick={() => runSeed(true)}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-sm disabled:opacity-50"
          style={{ background: "rgba(138,106,58,0.15)", border: "1px solid rgba(138,106,58,0.3)", color: "var(--gold)" }}
        >
          {phase === "seeding" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Reset &amp; Re-seed
        </button>

        <button
          onClick={clearAll}
          disabled={busy}
          className="ml-auto flex items-center gap-2 rounded-lg px-5 py-3 text-sm disabled:opacity-50 hover:text-red-400 transition-colors"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(239,68,68,0.7)" }}
        >
          {phase === "clearing" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {phase === "clearing" ? "Clearing…" : "Clear All Data"}
        </button>
      </div>

      {/* Results */}
      {phase === "done" && result && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(34,197,94,0.25)" }}>
          <div className="flex items-center gap-2 px-5 py-3" style={{ background: "rgba(34,197,94,0.08)", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Seed complete</span>
          </div>
          <div className="divide-y" style={{ divideColor: "rgba(138,106,58,0.08)" }}>
            {entityRows.map(({ label, value }) => {
              const Icon = ENTITY_ICONS[label] ?? Database;
              return (
                <div key={label} className="flex items-center justify-between px-5 py-3" style={{ background: "var(--bg-dark)" }}>
                  <div className="flex items-center gap-2.5">
                    <Icon size={13} className="text-[var(--gold-dim)]" />
                    <span className="text-sm text-[var(--cream)]">{label}</span>
                  </div>
                  <span className="text-xs text-emerald-400">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {cleared && phase === "idle" && (
        <div className="flex items-center gap-2 rounded-xl px-5 py-4 text-sm" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(239,68,68,0.8)" }}>
          <CheckCircle2 size={14} />
          All data cleared successfully.
        </div>
      )}

      {phase === "error" && (
        <div className="flex items-center gap-2 rounded-xl px-5 py-4 text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgb(248,113,113)" }}>
          <XCircle size={14} />
          {error || "Something went wrong. Check the server logs."}
        </div>
      )}

      {/* Notes */}
      <div className="mt-8 space-y-1.5 text-xs text-[var(--cream-muted)]">
        <p>• <strong className="text-[var(--cream)]">Seed (skip existing)</strong> — inserts only what&apos;s missing. Safe to run multiple times.</p>
        <p>• <strong className="text-[var(--cream)]">Reset &amp; Re-seed</strong> — clears orders, try-on data, then re-inserts everything. Products are kept.</p>
        <p>• <strong className="text-[var(--cream)]">Clear All Data</strong> — wipes every collection including products. Cannot be undone.</p>
      </div>
    </div>
  );
}
