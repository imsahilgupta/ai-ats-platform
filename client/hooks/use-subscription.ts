import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/lib/api/subscription";
import { qk } from "@/lib/query/keys";
import { FREE_PLAN_MONTHLY_LIMIT } from "@/lib/constants";

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: qk.subscription(),
    queryFn: getSubscription,
  });
}

// Optimistic mirror of the backend's reset-window logic (mockInterview.controller.js
// getUsageWindowState) — used for a proactive progress bar only. The real 403 from
// POST /mock-interview/start is always the authoritative enforcement.
export function computeUsageWindow(mockInterviewUsageCount: number, mockInterviewUsageResetAt: string) {
  const resetAt = new Date(mockInterviewUsageResetAt);
  const now = new Date();
  const count = resetAt <= now ? 0 : mockInterviewUsageCount;
  const remaining = Math.max(0, FREE_PLAN_MONTHLY_LIMIT - count);
  return { count, remaining, resetAt, limit: FREE_PLAN_MONTHLY_LIMIT };
}
