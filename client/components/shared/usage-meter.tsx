"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSubscriptionQuery, computeUsageWindow } from "@/hooks/use-subscription";
import { Skeleton } from "@/components/ui/skeleton";

export function UsageMeter() {
  const { data, isLoading } = useSubscriptionQuery();

  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-lg" />;
  }

  if (!data) return null;

  const { subscription } = data;

  if (subscription.plan !== "FREE") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
        <Zap className="size-3.5" />
        <span className="font-medium">{subscription.plan} plan — unlimited interviews</span>
      </div>
    );
  }

  const { count, remaining, limit } = computeUsageWindow(
    subscription.mockInterviewUsageCount,
    subscription.mockInterviewUsageResetAt,
  );

  return (
    <div className="space-y-2 rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Mock interviews</span>
        <span className="text-muted-foreground">{remaining} of {limit} left</span>
      </div>
      <Progress value={(count / limit) * 100} />
      {remaining === 0 ? (
        <Button size="sm" variant="default" className="w-full" render={<Link href="/subscription" />}>
          Upgrade to PRO
        </Button>
      ) : (
        <p className="text-[11px] text-muted-foreground">Resets monthly on the FREE plan</p>
      )}
    </div>
  );
}
