"use client";

import { PageHeader } from "@/components/shared/page-header";
import { GrowthChart } from "@/components/admin/growth-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { StatTile } from "@/components/shared/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStatsQuery, useAdminGrowthQuery, useAdminUsersQuery } from "@/hooks/use-admin-stats";
import { BarChart3, TrendingUp, Users } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useAdminStatsQuery();
  const { data: growth, isLoading: growthLoading } = useAdminGrowthQuery();
  const { data: usersData, isLoading: usersLoading } = useAdminUsersQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Platform Analytics" description="User growth, plan distribution, and platform activity." />

      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading || !data ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <StatTile label="Total users" value={data.totalUsers} icon={Users} />
            <StatTile label="Total sessions" value={data.totalSessions} icon={BarChart3} />
            <StatTile label="Active subscribers" value={data.activeSubscribers} icon={TrendingUp} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-semibold text-foreground">User growth (14 days)</p>
          {growthLoading || !growth ? (
            <Skeleton className="h-64 rounded-lg" />
          ) : (
            <GrowthChart data={growth.series} />
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-semibold text-foreground">Plan distribution</p>
          {usersLoading || !usersData ? (
            <Skeleton className="h-64 rounded-lg" />
          ) : (
            <PlanDistributionChart users={usersData.users} />
          )}
        </div>
      </div>
    </div>
  );
}
