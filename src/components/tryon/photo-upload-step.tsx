"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Camera } from "lucide-react";
import Image from "next/image";

interface Props {
  onPhotoSelected: (file: File, preview: string) => void;
  isHandJewellery?: boolean;
}

type PreflightError = { code: string; message: string };

async function runFacePreflight(preview: string): Promise<PreflightError | null> {
  // @ts-ignore — FaceDetector is experimental; not available in all browsers
  if (typeof FaceDetector === "undefined") return null;

  return new Promise((resolve) => {
    const img  = document.createElement("img");
    img.src    = preview;
    img.onload = async () => {
      try {
        // @ts-ignore
        const detector = new FaceDetector({ fastMode: true });
        const faces    = await detector.detect(img);

        if (faces.length === 0) {
          resolve({ code: "no_face", message: "We couldn't detect a face. Try a front-facing photo in good lighting." });
        } else if (faces.length > 1) {
          resolve({ code: "multiple_faces", message: "Please use a photo with only one person." });
        } else {
          const { width: fw, height: fh } = faces[0].boundingBox;
          if (fw * fh < img.width * img.height * 0.15) {
            resolve({ code: "face_too_small", message: "Please use a closer photo — face should fill most of the frame." });
          } else {
            resolve(null);
          }
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
  });
}

export function PhotoUploadStep({ onPhotoSelected, isHandJewellery = false }: Props) {
  const [preview,      setPreview]      = useState<string | null>(null);
  const [dragging,     setDragging]     = useState(false);
  const [preflightErr, setPreflightErr] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setPreflightErr(null);

      if (!isHandJewellery) {
        const err = await runFacePreflight(url);
        if (err) {
          setPreflightErr(err.message);
          return;
        }
      }

      onPhotoSelected(file, url);
    },
    [onPhotoSelected, isHandJewellery]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col gap-6">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
          dragging
            ? "border-[var(--gold)] bg-[rgba(138,106,58,0.08)]"
            : "border-[rgba(138,106,58,0.3)] hover:border-[var(--gold)]"
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-48 h-64">
            <Image src={preview} alt="Your photo" fill className="object-cover rounded-lg" />
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(138,106,58,0.3)] text-[var(--gold)]">
              <Upload size={28} />
            </div>
            <div className="text-center">
              <p className="font-medium text-[var(--parchment)]">Drop your photo here</p>
              <p className="mt-1 text-sm text-[var(--parchment-dim)]">or click to browse · JPG, PNG · max 10 MB</p>
            </div>
          </>
        )}
      </div>

      {preflightErr && (
        <p className="rounded-lg bg-red-900/20 px-4 py-3 text-sm text-red-300">{preflightErr}</p>
      )}

      <div className="flex items-start gap-3 rounded-lg bg-[rgba(138,106,58,0.06)] px-4 py-3 text-sm text-[var(--parchment-dim)]">
        <Camera size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />
        <span>
          {isHandJewellery
            ? "For best results, use a photo showing your hand clearly in good lighting."
            : "For best results, use a front-facing photo with your face and neck clearly visible, in good lighting."}
        </span>
      </div>

      <p className="text-center text-xs text-[var(--parchment-dim)] opacity-70">
        Your photo is processed securely and deleted within 24 hours.
      </p>
    </div>
  );
}
