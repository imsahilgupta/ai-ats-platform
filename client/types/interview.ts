export type SkillSeverity = "low" | "medium" | "high";

export interface InterviewQuestion {
  question: string;
  intention: string;
  answer: string;
}

export interface SkillGap {
  skill: string;
  severity: SkillSeverity;
}

export interface PreparationPlanDay {
  day: number;
  focus: string;
  tasks: string[];
}

export interface InterviewReportSummary {
  _id: string;
  title?: string;
  matchScore: number;
  createdAt: string;
}

export interface InterviewReport {
  _id: string;
  user: string;
  title?: string;
  jobDescription: string;
  resumeText?: string;
  selfDescription?: string;
  matchScore: number;
  technicalQuestions: InterviewQuestion[];
  behavioralQuestions: InterviewQuestion[];
  skillGaps: SkillGap[];
  preparationPlan: PreparationPlanDay[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateInterviewReportPayload {
  resume: File;
  selfDescription: string;
  jobDescription: string;
}
