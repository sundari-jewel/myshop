"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "warning" | "danger";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "warning",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onCancel, open, pending]);

  if (!open) return null;

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-3 backdrop-blur-sm md:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-[min(88vw,360px)] overflow-hidden rounded-md border p-4 shadow-[0_28px_90px_rgba(0,0,0,0.65)] md:w-full md:max-w-md md:rounded-lg md:p-6"
        style={{
          backgroundColor: "var(--bg-dark)",
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(201,169,110,0.13), transparent 38%), linear-gradient(160deg, rgba(42,14,14,0.45), transparent 58%)",
          borderColor: "rgba(201,169,110,0.32)",
          color: "var(--cream)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, var(--gold), transparent)" }}
        />

        <button
          type="button"
          aria-label="Close confirmation"
          onClick={onCancel}
          disabled={pending}
          className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full transition-colors hover:bg-[rgba(201,169,110,0.12)] disabled:opacity-50 md:right-3 md:top-3 md:size-9"
          style={{ color: "var(--cream-muted)" }}
        >
          <X size={16} />
        </button>

        <div
          className="mb-3 grid size-9 place-items-center rounded-full md:mb-5 md:size-12"
          style={{
            background: tone === "danger" ? "rgba(155,28,28,0.16)" : "rgba(201,169,110,0.1)",
            border: `1px solid ${tone === "danger" ? "rgba(239,68,68,0.28)" : "rgba(201,169,110,0.3)"}`,
            color: tone === "danger" ? "rgb(248,113,113)" : "var(--gold)",
          }}
        >
          <AlertTriangle className="size-[17px] md:size-[21px]" strokeWidth={1.7} />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "var(--gold-dim)" }}>
          Please confirm
        </p>
        <h2 id={titleId} className="display-font mt-1.5 pr-7 text-2xl font-semibold leading-tight md:mt-2 md:pr-8 md:text-3xl">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-xs leading-5 md:mt-3 md:text-sm md:leading-6" style={{ color: "var(--cream-muted)" }}>
          {description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 md:mt-7 md:gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="focus-ring min-h-10 rounded-sm border px-2 text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-[rgba(201,169,110,0.08)] disabled:opacity-50 md:min-h-11 md:px-4 md:text-[10px] md:tracking-[0.18em]"
            style={{ borderColor: "rgba(201,169,110,0.32)", color: "var(--gold-pale)" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="focus-ring inline-flex min-h-10 items-center justify-center gap-1.5 rounded-sm px-2 text-[9px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-90 disabled:opacity-60 md:min-h-11 md:gap-2 md:px-4 md:text-[10px] md:tracking-[0.18em]"
            style={{
              background: tone === "danger" ? "var(--ruby)" : "var(--gold)",
              color: tone === "danger" ? "white" : "var(--bg-deep)",
            }}
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : null}
            {pending ? "Please wait" : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
