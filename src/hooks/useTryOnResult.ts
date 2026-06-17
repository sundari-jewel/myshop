"use client";

import { useEffect, useRef, useState } from "react";

export type TryOnStatus = "idle" | "preview_ready" | "refining" | "complete" | "failed";

export interface TryOnResultState {
  status:     TryOnStatus;
  previewUrl: string | null;
  resultUrl:  string | null;
  elapsedMs:  number | null;
  errorCode:  string | null;
}

const POLL_INTERVAL = 3000;
const MAX_POLLS     = 40;

export function useTryOnResult(
  jobId: string | null,
  initialPreviewUrl: string | null = null
): TryOnResultState {
  const [state, setState] = useState<TryOnResultState>({
    status:    "idle",
    previewUrl: initialPreviewUrl,
    resultUrl:  initialPreviewUrl,
    elapsedMs:  null,
    errorCode:  null,
  });

  const pollCount = useRef(0);

  useEffect(() => {
    if (!jobId) return;

    setState({
      status:    "preview_ready",
      previewUrl: initialPreviewUrl,
      resultUrl:  initialPreviewUrl,
      elapsedMs:  null,
      errorCode:  null,
    });
    pollCount.current = 0;

    const timer = setInterval(async () => {
      pollCount.current++;
      try {
        const res  = await fetch(`/api/tryon/result/${jobId}`);
        const data = await res.json() as {
          status:      string;
          previewUrl?: string;
          resultUrl?:  string;
          elapsedMs?:  number;
          errorCode?:  string;
        };

        if (data.status === "complete") {
          clearInterval(timer);
          setState({
            status:    "complete",
            previewUrl: data.previewUrl ?? initialPreviewUrl,
            resultUrl:  data.resultUrl  ?? data.previewUrl ?? initialPreviewUrl,
            elapsedMs:  data.elapsedMs ?? null,
            errorCode:  null,
          });
        } else if (data.status === "processing") {
          setState(prev => ({ ...prev, status: "refining" }));
        } else if (data.status === "failed") {
          clearInterval(timer);
          setState(prev => ({ ...prev, status: "failed", errorCode: data.errorCode ?? "unknown" }));
        } else if (pollCount.current >= MAX_POLLS) {
          clearInterval(timer);
          setState(prev => ({ ...prev, status: "failed", errorCode: "timeout" }));
        }
      } catch {
        // transient — keep polling
      }
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  return state;
}
