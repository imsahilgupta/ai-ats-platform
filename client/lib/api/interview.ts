import { apiFetch, apiFetchBlob } from "@/lib/api/client";
import type {
  GenerateInterviewReportPayload,
  InterviewReport,
  InterviewReportSummary,
} from "@/types/interview";

export function generateInterviewReport(payload: GenerateInterviewReportPayload) {
  const formData = new FormData();
  formData.append("resume", payload.resume);
  formData.append("selfDescription", payload.selfDescription);
  formData.append("jobDescription", payload.jobDescription);

  return apiFetch<{ message: string; interviewReport: InterviewReport }>(
    "/interview",
    { method: "POST", body: formData },
  );
}

export function getInterviewReport(interviewId: string) {
  return apiFetch<{ interviewReport: InterviewReport }>(
    `/interview/report/${interviewId}`,
  );
}

export function getAllInterviewReports() {
  return apiFetch<{ interviewReports: InterviewReportSummary[] }>("/interview/");
}

export async function downloadTailoredResumePdf(interviewReportId: string) {
  return apiFetchBlob(`/interview/resume/pdf/${interviewReportId}`, {
    method: "POST",
  });
}

export function deleteInterviewReport(reportId: string) {
  return apiFetch<{ message: string }>(`/interview/report/${reportId}`, {
    method: "DELETE",
  });
}
