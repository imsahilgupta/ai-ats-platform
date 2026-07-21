"use client";

import {
  Activity,
  AlertTriangle,
  CircleDot,
  Clock,
  DollarSign,
  FileBarChart,
  Server,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { ApiMonitoringChart } from "@/components/admin/api-monitoring-chart";
import { useAdminStatsQuery, useAdminGrowthQuery, useAdminSystemQuery, useAdminDatabaseQuery } from "@/hooks/use-admin-stats";
import { generateMockApiLogs } from "@/lib/mock/admin";

const apiLogs = generateMockApiLogs();
const errorCount = apiLogs.filter((l) => l.status >= 400).length;

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStatsQuery();
  const { data: growth, isLoading: growthLoading } = useAdminGrowthQuery();
  const { data: system, isLoading: systemLoading } = useAdminSystemQuery();
  const { data: database } = useAdminDatabaseQuery();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform-wide metrics and system health." />

      <div>
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Platform metrics</p>
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Live data
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading || !data ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <StatTile label="Total users" value={data.totalUsers} icon={Users} />
              <StatTile label="Total mock interviews" value={data.totalSessions} icon={FileBarChart} />
              <StatTile label="Total resumes analyzed" value={data.totalResumes} icon={FileBarChart} />
              <StatTile label="Active subscribers" value={data.activeSubscribers} icon={UserPlus} />
              <StatTile
                label="Monthly recurring revenue"
                value={`NPR ${data.monthlyRecurringRevenue.toLocaleString()}`}
                icon={DollarSign}
                hint="Estimated (placeholder formula)"
              />
            </>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Growth &amp; sessions</p>
          <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            Live data
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {growthLoading || !growth ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <StatTile label="Ongoing sessions" value={growth.activeSessions} icon={Activity} />
              <StatTile
                label="7-day growth"
                value={`${growth.monthlyGrowthPercent > 0 ? "+" : ""}${growth.monthlyGrowthPercent}%`}
                icon={TrendingUp}
              />
              <StatTile label="New signups (7d)" value={growth.newSignups7d} icon={UserPlus} />
              <StatTile label="Total users" value={growth.series.at(-1)?.users ?? 0} icon={Users} />
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">API monitoring</p>
            <DemoDataBadge />
          </div>
          <ApiMonitoringChart logs={apiLogs} />
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <AlertTriangle className="size-3.5" />
              Errors (last 30 requests)
            </span>
            <span className="font-medium text-destructive">{errorCount}</span>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Server health</p>
            <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              Live data
            </span>
          </div>
          {systemLoading || !system ? (
            <Skeleton className="h-48 rounded-lg" />
          ) : (
            <>
              <div className="flex items-center justify-around">
                <ScoreGauge value={system.cpuLoadPercent} size={80} label="CPU" showBandLabel={false} />
                <ScoreGauge value={system.memory.percent} size={80} label="RAM" showBandLabel={false} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Server className="size-3.5" />
                    Database
                  </span>
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      database?.status === "connected" ? "text-success" : "text-destructive"
                    }`}
                  >
                    <CircleDot
                      className={`size-3 ${database?.status === "connected" ? "fill-success text-success" : "fill-destructive text-destructive"}`}
                    />
                    {database?.status === "connected" ? "Healthy" : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    Uptime
                  </span>
                  <span className="font-medium text-foreground">
                    {Math.floor(system.uptimeSeconds / 3600)}h {Math.floor((system.uptimeSeconds % 3600) / 60)}m
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
