import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { Product } from "@/types/commerce";
import { formatPrice } from "@/lib/seo";
import { AddToCartButton } from "./add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-md border border-[var(--line)] bg-[var(--surface)]">
      <Link href={`/products/${product.slug}` as Route} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f4eadc]">
          {product.badge ? (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--ruby)] px-3 py-1 text-xs font-semibold text-white">
              {product.badge}
            </span>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-8 transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jade)]">
            {product.material} / {product.stone}
          </p>
          <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{formatPrice(product.price)}</p>
        </div>
        <AddToCartButton productName={product.name} />
      </div>
    </article>
  );
}
