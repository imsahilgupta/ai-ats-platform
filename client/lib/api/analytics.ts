import { apiFetch } from "@/lib/api/client";
import { API_URL } from "@/lib/env";
import type { AdminStatsResponse, AnalyticsResponse, PublicStatsResponse } from "@/types/analytics";

export function getAnalytics() {
  return apiFetch<AnalyticsResponse>("/analytics");
}

export function getAdminStats() {
  return apiFetch<AdminStatsResponse>("/analytics/admin/stats");
}

// Used from Server Components (marketing pages) — plain fetch with ISR-style
// revalidation instead of apiFetch's client-oriented credentials/error shape.
export async function getPublicStats(): Promise<PublicStatsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/analytics/public`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as PublicStatsResponse;
  } catch {
    return null;
  }
}
