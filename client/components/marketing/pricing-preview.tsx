import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_PRICING } from "@/lib/constants";

const PREVIEW_PLANS: { plan: "FREE" | "PRO" | "ENTERPRISE"; tagline: string; highlights: string[]; popular?: boolean }[] = [
  {
    plan: "FREE",
    tagline: "Get started with the essentials",
    highlights: ["3 mock interviews / month", "Unlimited resume analyses", "Career strategy reports"],
  },
  {
    plan: "PRO",
    tagline: "For active job seekers",
    highlights: ["Unlimited mock interviews", "Full analytics & skill tracking", "Priority AI response times"],
    popular: true,
  },
  {
    plan: "ENTERPRISE",
    tagline: "For teams and career centers",
    highlights: ["Everything in PRO", "Team progress dashboard", "Dedicated onboarding"],
  },
];

export function PricingPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you need unlimited practice.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PREVIEW_PLANS.map((p) => (
          <div
            key={p.plan}
            className={`relative rounded-xl border bg-card p-6 ${p.popular ? "border-primary shadow-sm" : "border-border"}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <p className="text-sm font-semibold text-foreground">{p.plan}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              NPR {PLAN_PRICING[p.plan].npr.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" render={<Link href="/pricing" />}>
          Compare all plans
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
