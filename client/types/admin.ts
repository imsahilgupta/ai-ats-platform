import type { Plan } from "@/types/subscription";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  plan: Plan;
  joinedAt: string;
}

export interface AdminSubscriptionEntry {
  id: string;
  username: string;
  email: string;
  plan: Plan;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export type AdminReportType = "career" | "resume" | "mock-interview";

export interface AdminReportEntry {
  id: string;
  type: AdminReportType;
  user: string;
  score: number;
  createdAt: string;
}

export interface AdminGrowthResponse {
  series: { date: string; users: number }[];
  newSignups7d: number;
  activeSessions: number;
  monthlyGrowthPercent: number;
}

export interface AdminDatabaseCollection {
  name: string;
  documents: number;
  sizeMb: number;
}

export interface AdminDatabaseResponse {
  status: "connected" | "disconnected";
  collections: AdminDatabaseCollection[];
}

export interface AdminSystemResponse {
  uptimeSeconds: number;
  cpuLoadPercent: number;
  memory: { usedMb: number; totalMb: number; percent: number };
  nodeVersion: string;
  platform: string;
  env: string;
  dbStatus: "connected" | "disconnected";
  dbLatencyMs: number | null;
}
