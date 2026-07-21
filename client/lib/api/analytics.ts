import { apiFetch } from "@/lib/api/client";
import type { AdminStatsResponse, AnalyticsResponse } from "@/types/analytics";

export function getAnalytics() {
  return apiFetch<AnalyticsResponse>("/analytics");
}

export function getAdminStats() {
  return apiFetch<AdminStatsResponse>("/analytics/admin/stats");
}
