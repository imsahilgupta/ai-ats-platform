"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/components/shared/upload-dropzone";
import { generateInterviewReport } from "@/lib/api/interview";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { ApiError } from "@/types/api";

export function ReportForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [resume, setResume] = useState<File | null>(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const mutation = useMutation({
    mutationFn: generateInterviewReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: qk.interviewReports() });
      toast.success("Career report generated");
      router.push(`/career-report/${data.interviewReport._id}`);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to generate report.");
    },
  });

  const canSubmit = !!resume && selfDescription.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!resume) return;
        mutation.mutate({ resume, selfDescription, jobDescription });
      }}
    >
      <div>
        <Label className="mb-2">Your resume</Label>
        <UploadDropzone file={resume} onFileChange={setResume} />
      </div>

      <div>
        <Label htmlFor="selfDescription" className="mb-2">
          Tell us about yourself
        </Label>
        <Textarea
          id="selfDescription"
          placeholder="Summarize your background, skills, and career goals..."
          className="min-h-28"
          value={selfDescription}
          onChange={(e) => setSelfDescription(e.target.value)}
        />
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
        Generate career report
      </Button>
    </form>
  );
}
