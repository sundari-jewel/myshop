"use client";

import Image from "next/image";
import { Download, Share2, ShoppingBag, RefreshCw } from "lucide-react";

interface Props {
  resultUrl: string;
  isRefining?: boolean;
  skuId: string;
  sessionId: string;
  jobId: string;
  regenCount: number;
  regenLimit: number;
  onAddToCart: () => void;
  onRegenerate: () => void;
  onClose: () => void;
}

async function track(event: string, skuId: string, sessionId: string, jobId: string) {
  await fetch("/api/tryon/analytics", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ event, skuId, sessionId, jobId }),
  }).catch(() => {});
}

export function ResultStep({
  resultUrl,
  isRefining = false,
  skuId,
  sessionId,
  jobId,
  regenCount,
  regenLimit,
  onAddToCart,
  onRegenerate,
}: Props) {
  const handleDownload = async () => {
    await track("photo_saved", skuId, sessionId, jobId);
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "sundari-tryon.jpg";
    a.click();
  };

  const handleShare = async () => {
    await track("share_tapped", skuId, sessionId, jobId);
    if (navigator.share) {
      navigator.share({ url: resultUrl, title: "My Sundari Try-On" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(resultUrl).catch(() => {});
    }
  };

  const handleCart = async () => {
    await track("add_to_cart", skuId, sessionId, jobId);
    onAddToCart();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Result image */}
      <div className="relative mx-auto aspect-[3/4] w-[min(100%,270px)] overflow-hidden rounded-lg md:w-full md:rounded-xl">
        <Image src={resultUrl} alt="Your try-on result" fill className="object-cover" />
        {isRefining && (
          <div className="absolute inset-0 flex items-end justify-center bg-black/30 pb-4">
            <p className="rounded-full bg-black/60 px-4 py-1.5 text-xs text-[var(--parchment-dim)]">
              Refining your result…
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <button
          onClick={handleCart}
          className="col-span-2 flex items-center justify-center gap-2 rounded-md bg-[var(--gold)] py-2.5 text-xs font-medium text-[var(--bg-dark)] transition-opacity hover:opacity-90 md:rounded-lg md:py-3 md:text-sm"
        >
          <ShoppingBag size={16} />
          Add to Cart
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-md border border-[rgba(138,106,58,0.4)] py-2 text-xs text-[var(--parchment)] transition-colors hover:border-[var(--gold)] md:rounded-lg md:py-2.5 md:text-sm"
        >
          <Download size={15} />
          Save
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-md border border-[rgba(138,106,58,0.4)] py-2 text-xs text-[var(--parchment)] transition-colors hover:border-[var(--gold)] md:rounded-lg md:py-2.5 md:text-sm"
        >
          <Share2 size={15} />
          Share
        </button>
      </div>

      {/* Try another */}
      {regenCount < regenLimit && (
        <button
          onClick={onRegenerate}
          className="flex items-center justify-center gap-2 text-sm text-[var(--parchment-dim)] transition-colors hover:text-[var(--gold)]"
        >
          <RefreshCw size={14} />
          Try another look ({regenLimit - regenCount} left)
        </button>
      )}
    </div>
  );
}
