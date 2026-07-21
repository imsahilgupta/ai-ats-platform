export type InterviewType = "technical" | "behavioral" | "system-design" | "hr";

export interface ChatTurn {
  role: "interviewer" | "candidate";
  content: string;
  // Always present as an object, but score/feedback are null until the
  // backend evaluates that turn (e.g. the opening interviewer question).
  evaluation?: {
    score: number | null;
    feedback: string | null;
  };
}

export interface CommunicationScore {
  confidence: number;
  clarity: number;
  fillerWordsCount: number;
  pace: string;
}

export interface MockInterviewSession {
  _id: string;
  user: string;
  role: string;
  experienceLevel: string;
  interviewType: InterviewType;
  questions: string[];
  answers: string[];
  chatHistory: ChatTurn[];
  status: "ongoing" | "completed";
  communicationScore?: CommunicationScore;
  overallScore?: number;
  feedbackReport?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartSessionPayload {
  role: string;
  experienceLevel: string;
  interviewType: InterviewType;
}

export interface StartSessionResponse {
  message: string;
  session: MockInterviewSession;
}

export interface SubmitAnswerPayload {
  sessionId: string;
  answer: string;
  durationSeconds: number;
}

export interface SubmitAnswerResponse {
  message: string;
  session: MockInterviewSession;
  completed: boolean;
}
