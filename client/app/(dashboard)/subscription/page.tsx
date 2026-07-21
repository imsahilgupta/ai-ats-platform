"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlanCard } from "@/components/dashboard/subscription/plan-card";
import { UpgradeDialog } from "@/components/dashboard/subscription/upgrade-dialog";
import { InvoicesList } from "@/components/dashboard/subscription/invoices-list";
import { useSubscriptionQuery } from "@/hooks/use-subscription";
import { PLAN_PRICING } from "@/lib/constants";
import type { Plan } from "@/types/subscription";

export default function SubscriptionPage() {
  const { data, isLoading } = useSubscriptionQuery();
  const [upgradePlan, setUpgradePlan] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const { subscription } = data;

  const handleSelect = (plan: Plan) => {
    setUpgradePlan(plan);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Subscription"
        description="Manage your plan, payment method, and billing history."
      />

      <Tabs defaultValue="plans">
        <TabsList className="mb-6">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid gap-4 sm:grid-cols-3">
            <PlanCard
              plan="FREE"
              price="NPR 0"
              isCurrent={subscription.plan === "FREE"}
            />
            <PlanCard
              plan="PRO"
              price={`NPR ${PLAN_PRICING.PRO.npr.toLocaleString()}/mo`}
              isCurrent={subscription.plan === "PRO"}
              isPopular
              onSelect={() => handleSelect("PRO")}
            />
            <PlanCard
              plan="ENTERPRISE"
              price={`NPR ${PLAN_PRICING.ENTERPRISE.npr.toLocaleString()}/mo`}
              isCurrent={subscription.plan === "ENTERPRISE"}
              onSelect={() => handleSelect("ENTERPRISE")}
            />
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="text-muted-foreground">
                Current plan: <span className="font-medium text-foreground">{subscription.plan}</span>
                {subscription.isActive && subscription.plan !== "FREE" && (
                  <> &middot; renews {new Date(subscription.endDate).toLocaleDateString()}</>
                )}
              </p>
            </div>
            <InvoicesList subscription={subscription} />
          </div>
        </TabsContent>
      </Tabs>

      <UpgradeDialog plan={upgradePlan} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
