import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export function getAiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "";
  const message = serverMessage.toString().toLowerCase();

  if (message.includes("rate limit") || error?.response?.status === 429) {
    return "We hit a temporary rate limit. Please wait a moment and try again.";
  }

  if (
    message.includes("timeout") ||
    message.includes("timed out") ||
    error?.response?.status === 504
  ) {
    return "The AI took too long to respond. Please try again in a moment.";
  }

  if (
    message.includes("invalid ai") ||
    message.includes("invalid response") ||
    message.includes("malformed") ||
    message.includes("empty response")
  ) {
    return "The AI returned an incomplete response. Please try again.";
  }

  if (
    (message.includes("upload") || message.includes("file")) &&
    (message.includes("fail") ||
      message.includes("error") ||
      message.includes("size") ||
      message.includes("type"))
  ) {
    return "The file could not be processed. Please try a PDF or DOCX under 5MB.";
  }

  return fallback;
}

// Mock Interview APIs
export async function startMockSession({
  role,
  experienceLevel,
  interviewType,
}) {
  const response = await api.post("/api/mock-interview/start", {
    role,
    experienceLevel,
    interviewType,
  });
  return response.data;
}

export async function submitMockAnswer({ sessionId, answer, durationSeconds }) {
  const response = await api.post("/api/mock-interview/answer", {
    sessionId,
    answer,
    durationSeconds,
  });
  return response.data;
}

export async function getMockResult(id) {
  const response = await api.get(`/api/mock-interview/result/${id}`);
  return response.data;
}

// Resume APIs
export async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription || "");
  const response = await api.post("/api/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getResumeHistory() {
  const response = await api.get("/api/resume/history");
  return response.data;
}

// Analytics APIs
export async function getAnalytics() {
  const response = await api.get("/api/analytics");
  return response.data;
}

export async function getAdminStats() {
  const response = await api.get("/api/analytics/admin/stats");
  return response.data;
}

// Subscription APIs
export async function getSubscription() {
  const response = await api.get("/api/subscription");
  return response.data;
}

export async function upgradeSubscription(plan) {
  const response = await api.post("/api/subscription/upgrade", { plan });
  return response.data;
}
