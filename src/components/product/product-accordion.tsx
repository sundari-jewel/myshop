"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type AccordionItem = {
  label: string;
  content: React.ReactNode;
};

function AccordionRow({ label, content }: AccordionItem) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(138,106,58,0.2)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--foreground)" }}>
          {label}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          style={{
            color: "var(--gold-dim)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {content}
        </div>
      )}
    </div>
  );
}

type ProductAccordionProps = {
  description: string;
  material: string;
  stone: string;
  weight?: string;
  purity?: string;
};

export function ProductAccordion({
  description,
  material,
  stone,
  weight,
  purity,
}: ProductAccordionProps) {
  return (
    <div style={{ borderTop: "1px solid rgba(138,106,58,0.2)" }}>
      <AccordionRow
        label="Description"
        content={<p>{description}</p>}
      />
      <AccordionRow
        label="Specifications"
        content={
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {[
              ["Material", material],
              ["Stone", stone],
              ...(weight ? [["Weight", weight]] : []),
              ...(purity ? [["Purity", purity]] : []),
              ["Finish", "Hand-polished"],
              ["Origin", "Handcrafted in India"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-[0.14em] mb-0.5" style={{ color: "var(--gold-dim)" }}>{k}</dt>
                <dd className="font-medium" style={{ color: "var(--foreground)" }}>{v}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <AccordionRow
        label="Care & Storage"
        content={
          <ul className="flex flex-col gap-2">
            {[
              "Store in the velvet pouch provided, away from other jewellery.",
              "Avoid contact with perfume, hairspray, and chlorine.",
              "Remove before swimming, bathing, or vigorous exercise.",
              "Wipe gently with a soft, lint-free cloth after each wear.",
              "Professional cleaning recommended every 12 months.",
            ].map((tip) => (
              <li key={tip} className="flex gap-2">
                <span style={{ color: "var(--gold)", flexShrink: 0 }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        }
      />
      <AccordionRow
        label="Shipping & Returns"
        content={
          <ul className="flex flex-col gap-2">
            {[
              "Free insured shipping across India on all orders.",
              "Delivered within 5–7 business days; expedited available.",
              "30-day exchange policy — no questions asked.",
              "Each piece ships in a Sundari branded gift box.",
            ].map((tip) => (
              <li key={tip} className="flex gap-2">
                <span style={{ color: "var(--gold)", flexShrink: 0 }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
