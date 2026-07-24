import Link from "next/link";
import type { Route } from "next";
import { getAnnouncementItems } from "@/lib/shopify-admin";

const FALLBACK_ITEMS = [
  "Minimum 10% off on all jewellery",
  "Minimum 10% off on womens",
  "Minimum 10% off on mens",
];

export async function AnnouncementBar() {
  let items: string[];
  try {
    const fetched = await getAnnouncementItems();
    items = fetched.length ? fetched : FALLBACK_ITEMS;
  } catch {
    items = FALLBACK_ITEMS;
  }

  const doubled = [...items, ...items];

  return (
    <Link
      href={"/collections/sale" as Route}
      className="block w-full overflow-hidden border-y py-3 cursor-pointer"
      style={{ background: "#120404", borderColor: "rgba(201,169,110,0.18)", contain: "paint" }}
    >
      <div
        className="announcement-track flex w-max items-center gap-12 text-[10px] font-medium uppercase tracking-[0.42em]"
        style={{ color: "var(--gold-pale)" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="whitespace-nowrap">
            {item}
            <span className="mx-6 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
