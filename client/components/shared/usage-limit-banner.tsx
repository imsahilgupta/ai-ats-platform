import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/shared/countdown-timer";

export function UsageLimitBanner({ resetAt, limit }: { resetAt?: string; limit?: number }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning-foreground dark:text-warning">
          <Zap className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">
            You&apos;ve used all {limit ?? 3} free mock interviews this month
          </p>
          <p className="text-xs text-muted-foreground">
            {resetAt ? <CountdownTimer target={resetAt} /> : "Your limit resets monthly"} &mdash; or upgrade for
            unlimited practice.
          </p>
        </div>
      </div>
      <Button render={<Link href="/subscription" />} className="shrink-0">
        Upgrade to PRO
      </Button>
    </div>
  );
}
