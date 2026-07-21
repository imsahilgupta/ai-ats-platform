export type ResumeSourceType = "pdf" | "docx" | "text";

export interface WeakBulletPoint {
  before: string;
  after: string;
}

export interface ResumeReport {
  _id: string;
  user: string;
  atsScore: number;
  formattingProblems: string[];
  missingKeywords: string[];
  weakBulletPoints: WeakBulletPoint[];
  experienceQualityReport: string;
  versionLabel: string;
  sourceType: ResumeSourceType;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyzeResumePayload {
  resume?: File;
  resumeText?: string;
  jobDescription: string;
}
