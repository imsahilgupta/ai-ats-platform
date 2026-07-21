import type { InterviewType } from "@/types/mockInterview";

export interface Badge {
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
}

export interface InterviewPerformance {
  technical: number;
  behavioral: number;
  hr: number;
  overall: number;
}

export interface SessionHistoryEntry {
  id: string;
  role: string;
  type: InterviewType;
  score: number;
  date: string;
}

export interface AnalyticsResponse {
  level: number;
  xp: number;
  badges: Badge[];
  interviewPerformance: InterviewPerformance;
  // Always a number — the backend returns 0 when the user has no resume
  // reports yet (analytics.controller.js), not null. Pair with a resume
  // history check to distinguish "scored 0" from "never analyzed".
  latestResumeScore: number;
  sessionsHistory: SessionHistoryEntry[];
}

export interface AdminStatsResponse {
  totalUsers: number;
  totalSessions: number;
  totalResumes: number;
  activeSubscribers: number;
  monthlyRecurringRevenue: number;
}

export interface PublicStatsResponse {
  totalUsers: number;
  completedMockInterviews: number;
  totalResumes: number;
  careerReports: number;
}
