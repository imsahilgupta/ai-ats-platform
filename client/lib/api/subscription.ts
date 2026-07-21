import { apiFetch } from "@/lib/api/client";
import type { Subscription, UpgradeSubscriptionPayload } from "@/types/subscription";

export function getSubscription() {
  return apiFetch<{ subscription: Subscription }>("/subscription");
}

// Direct plan-set with no payment — internal/dev fallback only, never the
// primary upgrade CTA (see lib/api/payment.ts for the real Stripe/eSewa flows).
export function upgradeSubscriptionDirect(payload: UpgradeSubscriptionPayload) {
  return apiFetch<{ message: string; subscription: Subscription }>(
    "/subscription/upgrade",
    { method: "POST", body: JSON.stringify(payload) },
  );
}
