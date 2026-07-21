"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_MAX_SIZE = 3 * 1024 * 1024; // mirrors Backend/src/middlewares/file.middleware.js (3MB)

export function UploadDropzone({
  file,
  onFileChange,
  accept = ".pdf,.doc,.docx",
  maxSizeBytes = DEFAULT_MAX_SIZE,
  label = "Upload your resume",
  hint = "PDF or DOCX, up to 3MB",
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;
      if (candidate.size > maxSizeBytes) {
        setError(`File is too large. Max size is ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`);
        return;
      }
      setError(null);
      onFileChange(candidate);
    },
    [maxSizeBytes, onFileChange],
  );

  if (file) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onFileChange(null)}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Remove file"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          validateAndSet(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Upload className="size-4" />
        </span>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">Drag and drop, or click to browse &middot; {hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => validateAndSet(e.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
