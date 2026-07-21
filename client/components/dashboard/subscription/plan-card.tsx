import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  ENTERPRISE: [
    "Everything in PRO",
    "Team progress dashboard",
    "Dedicated onboarding",
    "Priority support",
  ],
};

export function PlanCard({
  plan,
  price,
  isCurrent,
  isPopular,
  onSelect,
  isPending,
}: {
  plan: Plan;
  price: string;
  isCurrent: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
  isPending?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border bg-card p-6",
        isPopular ? "border-primary shadow-sm" : "border-border",
      )}
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          Most popular
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-foreground">{plan}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{price}</p>
      </div>
      <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
        {PLAN_FEATURES[plan].map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>
      {isCurrent ? (
        <Button variant="outline" disabled className="w-full">
          Current plan
        </Button>
      ) : plan === "FREE" ? (
        <Button variant="outline" disabled className="w-full">
          Included
        </Button>
      ) : (
        <Button onClick={onSelect} disabled={isPending} className="w-full">
          Upgrade to {plan}
        </Button>
      )}
    </div>
  );
}
