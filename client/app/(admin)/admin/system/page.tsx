"use client";

import { Clock, Cpu, Server } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { StatTile } from "@/components/shared/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSystemQuery } from "@/hooks/use-admin-stats";

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AdminSystemPage() {
  const { data, isLoading } = useAdminSystemQuery();

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader title="Server Health" description="Live infrastructure metrics." />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Server Health" description="Live infrastructure metrics." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Process uptime" value={formatUptime(data.uptimeSeconds)} icon={Clock} />
        <StatTile
          label="Database"
          value={data.dbStatus === "connected" ? "Connected" : "Disconnected"}
          icon={Server}
          hint={data.dbLatencyMs != null ? `${data.dbLatencyMs}ms ping` : undefined}
        />
        <StatTile label="Runtime" value={data.nodeVersion} icon={Cpu} hint={`${data.platform} · ${data.env}`} />
      </div>

      <div className="grid gap-6 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge value={data.cpuLoadPercent} size={110} label="CPU" />
          <p className="text-xs text-muted-foreground">1-min load average</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge value={data.memory.percent} size={110} label="RAM" />
          <p className="text-xs text-muted-foreground">
            {(data.memory.usedMb / 1024).toFixed(1)} / {(data.memory.totalMb / 1024).toFixed(1)} GB
          </p>
        </div>
      </div>
    </div>
  );
}
