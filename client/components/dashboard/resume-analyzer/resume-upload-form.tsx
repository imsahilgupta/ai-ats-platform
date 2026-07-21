"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDropzone } from "@/components/shared/upload-dropzone";
import { analyzeResume } from "@/lib/api/resume";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";
import type { ResumeReport } from "@/types/resume";

export function ResumeUploadForm({ onAnalyzed }: { onAnalyzed: (report: ResumeReport) => void }) {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qk.resumeHistory() });
      toast.success(`Analysis complete — saved as ${data.report.versionLabel}`);
      onAnalyzed(data.report);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to analyze resume.");
    },
  });

  const canSubmit = jobDescription.trim().length > 0 && (mode === "file" ? !!file : resumeText.trim().length > 0);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        mutation.mutate(
          mode === "file"
            ? { resume: file!, jobDescription }
            : { resumeText, jobDescription },
        );
      }}
    >
      <div>
        <Label className="mb-2">Resume</Label>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "file" | "text")}>
          <TabsList className="mb-3">
            <TabsTrigger value="file">Upload file</TabsTrigger>
            <TabsTrigger value="text">Paste text</TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === "file" ? (
          <UploadDropzone file={file} onFileChange={setFile} />
        ) : (
          <Textarea
            placeholder="Paste your resume text here..."
            className="min-h-40"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        )}
      </div>

      <div>
        <Label htmlFor="jobDescription" className="mb-2">
          Target job description
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description you're targeting..."
          className="min-h-32"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" disabled={!canSubmit || mutation.isPending}>
        {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        Analyze resume
      </Button>
    </form>
  );
}
