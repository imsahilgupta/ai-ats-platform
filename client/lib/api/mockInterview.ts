import { apiFetch } from "@/lib/api/client";
import type {
  MockInterviewSession,
  StartSessionPayload,
  StartSessionResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from "@/types/mockInterview";

export function startMockInterviewSession(payload: StartSessionPayload) {
  return apiFetch<StartSessionResponse>("/mock-interview/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitMockInterviewAnswer(payload: SubmitAnswerPayload) {
  return apiFetch<SubmitAnswerResponse>("/mock-interview/answer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMockInterviewResult(sessionId: string) {
  return apiFetch<{ session: MockInterviewSession }>(
    `/mock-interview/result/${sessionId}`,
  );
}
