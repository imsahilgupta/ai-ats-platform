"use client";

import Link from "next/link";
import { FileText, Upload, X } from "lucide-react";
import { useUpdateProfileDetailsMutation } from "@/hooks/use-profile-details";

export function ResumeFileCard({ resumeFileName }: { resumeFileName: string | null }) {
  const mutation = useUpdateProfileDetailsMutation();

  if (resumeFileName) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <FileText className="size-4 text-primary" />
          <p className="text-sm text-foreground">{resumeFileName}</p>
        </div>
        <button onClick={() => mutation.mutate({ resumeFileName: null })} aria-label="Remove resume">
          <X className="size-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:border-primary/50">
        <Upload className="size-4" />
        Upload your resume
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) mutation.mutate({ resumeFileName: file.name });
          }}
        />
      </label>
      <p className="text-center text-xs text-muted-foreground">
        Or run a full <Link href="/resume-analyzer" className="text-primary hover:underline">ATS analysis</Link> instead.
      </p>
    </div>
  );
}
