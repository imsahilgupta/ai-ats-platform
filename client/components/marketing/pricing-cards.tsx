import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_PRICING } from "@/lib/constants";
import type { Plan } from "@/types/subscription";

const PLAN_FEATURES: Record<Plan, string[]> = {
  FREE: ["3 mock interviews / month", "Unlimited resume analyses", "Career strategy reports", "Basic analytics"],
  PRO: [
    "Unlimited mock interviews",
    "Unlimited resume analyses",
    "Unlimited career strategy reports",
    "Full analytics & skill tracking",
    "Priority AI response times",
  ],
  ENTERPRISE: ["Everything in PRO", "Team progress dashboard", "Dedicated onboarding", "Priority support"],
};

export function PricingCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {(["FREE", "PRO", "ENTERPRISE"] as Plan[]).map((plan) => (
        <div
          key={plan}
          className={`relative flex flex-col gap-4 rounded-xl border bg-card p-6 ${
            plan === "PRO" ? "border-primary shadow-sm" : "border-border"
          }`}
        >
          {plan === "PRO" && (
            <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Most popular
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{plan}</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">
              NPR {PLAN_PRICING[plan].npr.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
            {PLAN_FEATURES[plan].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant={plan === "PRO" ? "default" : "outline"} className="w-full" render={<Link href={`/register?plan=${plan}`} />}>
            {plan === "FREE" ? "Start free" : `Get ${plan}`}
          </Button>
        </div>
      ))}
    </div>
  );
}
