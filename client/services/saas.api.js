import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Mock Interview APIs
export async function startMockSession({ role, experienceLevel, interviewType }) {
  const response = await api.post("/api/mock-interview/start", { role, experienceLevel, interviewType });
  return response.data;
}

export async function submitMockAnswer({ sessionId, answer, durationSeconds }) {
  const response = await api.post("/api/mock-interview/answer", { sessionId, answer, durationSeconds });
  return response.data;
}

export async function getMockResult(id) {
  const response = await api.get(`/api/mock-interview/result/${id}`);
  return response.data;
}

// Resume & LinkedIn Optimization APIs
export async function analyzeResume(resumeFile) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  const response = await api.post("/api/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function analyzeLinkedin(profileText) {
  const response = await api.post("/api/resume/linkedin", { profileText });
  return response.data;
}

// Job Tracker APIs
export async function getJobApplications() {
  const response = await api.get("/api/job-applications");
  return response.data;
}

export async function createJobApplication(data) {
  const response = await api.post("/api/job-applications", data);
  return response.data;
}

export async function updateJobApplication(id, data) {
  const response = await api.put(`/api/job-applications/${id}`, data);
  return response.data;
}

export async function deleteJobApplication(id) {
  const response = await api.delete(`/api/job-applications/${id}`);
  return response.data;
}

// Analytics APIs
export async function getAnalytics() {
  const response = await api.get("/api/analytics");
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

// Career Assistant APIs
export async function chatAssistant(message, context) {
  const response = await api.post("/api/assistant/chat", { message, context });
  return response.data;
}
