"use client";

import { BarChart3, FileScan, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { EmptyState } from "@/components/shared/empty-state";
import { XpProgressBar } from "@/components/shared/xp-progress-bar";
import { RadarSkillChart } from "@/components/shared/radar-skill-chart";
import { SessionsHistoryChart } from "@/components/shared/sessions-history-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsQuery } from "@/hooks/use-analytics";
import { useResumeHistoryQuery } from "@/hooks/use-resume-reports";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsQuery();
  const { data: resumeData } = useResumeHistoryQuery();
  const hasResumeAnalyses = (resumeData?.reports.length ?? 0) > 0;

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const hasSessions = data.sessionsHistory.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Analytics"
        description="Track your interview performance and skill development over time."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Overall performance"
          value={data.interviewPerformance.overall}
          icon={BarChart3}
          hint={hasSessions ? "out of 100" : "Baseline — no sessions yet"}
        />
        <StatTile
          label="Latest resume score"
          value={hasResumeAnalyses ? data.latestResumeScore : "—"}
          icon={FileScan}
          hint={hasResumeAnalyses ? "out of 100" : "No analysis yet"}
        />
        <StatTile label="Sessions completed" value={data.sessionsHistory.length} icon={Sparkles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Skill breakdown</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            {hasSessions ? "Average scores by interview category" : "Baseline scores — complete a session to update"}
          </p>
          <RadarSkillChart performance={data.interviewPerformance} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Level progress</h3>
          <p className="mb-4 text-xs text-muted-foreground">1,000 XP per level</p>
          <XpProgressBar xp={data.xp} level={data.level} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-1 text-sm font-semibold text-foreground">Session history</h3>
        <p className="mb-4 text-xs text-muted-foreground">Score by interview type over time</p>
        {hasSessions ? (
          <SessionsHistoryChart sessions={data.sessionsHistory} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No sessions yet"
            description="Complete a mock interview to start building your performance history."
          />
        )}
      </div>
    </div>
  );
}
