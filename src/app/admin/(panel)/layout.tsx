import { AdminNav } from "@/components/admin/admin-nav";
import "../admin.css";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: "var(--bg-deep)" }}>
      <AdminNav />
      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
