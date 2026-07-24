"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PhotoUploadStep } from "./photo-upload-step";
import { GeneratingStep } from "./generating-step";
import { ResultStep } from "./result-step";
import { useTryOnResult } from "@/hooks/useTryOnResult";

type Step = "upload" | "generating" | "preview" | "result" | "error";

interface Props {
  skuId:            string;
  productName:      string;
  isHandJewellery?: boolean;
  open:             boolean;
  onClose:          () => void;
  onAddToCart:      () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  rate_limit_exceeded: "You've reached the daily try-on limit. Please try again tomorrow.",
  no_face:             "We couldn't detect a face. Try a front-facing photo in good lighting.",
  low_confidence:      "We couldn't find the right placement point. Try a clearer photo.",
  ear_not_visible:     "Ears aren't visible. Try a photo with hair pulled back.",
  hand_not_visible:    "Hand isn't visible. Try a photo showing your hand clearly.",
  neck_not_visible:    "Neck isn't fully visible. Try a lower neckline or different angle.",
};

export function TryOnDrawer({ skuId, productName, isHandJewellery = false, open, onClose, onAddToCart }: Props) {
  const [step,       setStep]       = useState<Step>("upload");
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [jobId,      setJobId]      = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [regenCount, setRegenCount] = useState(0);
  const [errorMsg,   setErrorMsg]   = useState<string | null>(null);
  const drawerRef                   = useRef<HTMLDivElement>(null);
  const REGEN_LIMIT = 3;

  const { status, resultUrl, previewUrl: polledPreview } = useTryOnResult(
    step === "generating" || step === "preview" ? jobId : null,
    previewUrl
  );

  // As soon as polling reports preview_ready or refining, show the preview
  useEffect(() => {
    if ((status === "preview_ready" || status === "refining") && polledPreview) {
      setStep("preview");
    }
    if (status === "complete") setStep("result");
    if (status === "failed") {
      if (step !== "preview") { setStep("error"); setErrorMsg("Try-on generation failed. Please try again."); }
    }
  }, [status, polledPreview, step]);

  useEffect(() => {
    if (!open) {
      setStep("upload"); setSessionId(null); setJobId(null);
      setPreviewUrl(null); setRegenCount(0); setErrorMsg(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handlePhotoSelected = useCallback(async (file: File, _preview: string) => {
    setStep("generating");
    setErrorMsg(null);

    const fd = new FormData();
    fd.append("photo", file);
    fd.append("skuId", skuId);

    try {
      const res  = await fetch("/api/tryon/session", { method: "POST", body: fd });
      const data = await res.json() as {
        sessionId?:  string;
        jobId?:      string;
        previewUrl?: string;
        error?:      string;
      };

      if (!res.ok || !data.sessionId || !data.jobId) {
        setStep("error");
        setErrorMsg(ERROR_MESSAGES[data.error ?? ""] ?? "Something went wrong. Please try again.");
        return;
      }

      setSessionId(data.sessionId);
      setPreviewUrl(data.previewUrl ?? null);
      setJobId(data.jobId);
    } catch {
      setStep("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  }, [skuId]);

  const handleRegenerate = useCallback(async () => {
    if (!sessionId) return;
    setStep("generating");
    try {
      const res  = await fetch("/api/tryon/regenerate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json() as { jobId?: string; regenCount?: number };
      if (data.jobId) { setJobId(data.jobId); setRegenCount(data.regenCount ?? regenCount + 1); }
    } catch {
      setStep("error");
      setErrorMsg("Could not regenerate. Please try again.");
    }
  }, [sessionId, regenCount]);

  if (!open) return null;

  const displayUrl = resultUrl ?? polledPreview ?? previewUrl;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div
        ref={drawerRef}
        role="dialog" aria-modal="true" aria-label="Virtual Try-On"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-[92vw] max-w-sm flex-col bg-[var(--bg-dark)] pb-[env(safe-area-inset-bottom)] shadow-2xl md:w-full md:max-w-md"
        style={{ borderLeft: "1px solid rgba(138,106,58,0.2)" }}
      >
        <div className="flex items-center justify-between border-b border-[rgba(138,106,58,0.15)] px-3 py-2.5 md:px-6 md:py-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] opacity-80 md:text-xs">Virtual Try-On</p>
            <h2 className="font-cormorant mt-0.5 text-base text-[var(--parchment)] md:text-lg">{productName}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--parchment-dim)] hover:text-[var(--parchment)]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-6">
          {step === "upload" && (
            <PhotoUploadStep onPhotoSelected={handlePhotoSelected} isHandJewellery={isHandJewellery} />
          )}
          {step === "generating" && <GeneratingStep />}
          {(step === "preview" || step === "result") && displayUrl && sessionId && jobId && (
            <ResultStep
              resultUrl={displayUrl}
              isRefining={step === "preview"}
              skuId={skuId}
              sessionId={sessionId}
              jobId={jobId}
              regenCount={regenCount}
              regenLimit={REGEN_LIMIT}
              onAddToCart={onAddToCart}
              onRegenerate={handleRegenerate}
              onClose={onClose}
            />
          )}
          {step === "error" && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <p className="text-[var(--parchment-dim)]">{errorMsg}</p>
              <button
                onClick={() => { setStep("upload"); setErrorMsg(null); }}
                className="rounded-lg border border-[rgba(138,106,58,0.4)] px-6 py-2.5 text-sm text-[var(--parchment)] hover:border-[var(--gold)]"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
