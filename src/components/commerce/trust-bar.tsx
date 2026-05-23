import { Gem, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Gem, title: "Certified pieces", copy: "Metal purity and stone details captured per SKU." },
  { icon: ShieldCheck, title: "Secure checkout", copy: "Ready for payment and fraud-control integration." },
  { icon: Truck, title: "Insured shipping", copy: "Designed for high-value order delivery workflows." }
];

export function TrustBar() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)]">
      <div className="container-shell grid gap-6 py-8 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f2e2ca] text-[var(--ruby)]">
                <Icon size={21} />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{item.copy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
