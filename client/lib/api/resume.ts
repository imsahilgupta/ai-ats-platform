import { apiFetch } from "@/lib/api/client";
import type { AnalyzeResumePayload, ResumeReport } from "@/types/resume";

export function analyzeResume(payload: AnalyzeResumePayload) {
  const formData = new FormData();
  if (payload.resume) formData.append("resume", payload.resume);
  if (payload.resumeText) formData.append("resumeText", payload.resumeText);
  formData.append("jobDescription", payload.jobDescription);

  return apiFetch<{ message: string; report: ResumeReport }>("/resume/analyze", {
    method: "POST",
    body: formData,
  });
}

export function getResumeHistory() {
  return apiFetch<{ reports: ResumeReport[] }>("/resume/history");
}
