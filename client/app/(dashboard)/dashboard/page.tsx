"use client";

import Link from "next/link";
import { BarChart3, Compass, FileScan, Mic, Sparkles, Star, Target, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { EmptyState } from "@/components/shared/empty-state";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { UsageMeter } from "@/components/shared/usage-meter";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/providers/auth-provider";
import { useAnalyticsQuery } from "@/hooks/use-analytics";
import { useInterviewReportsQuery } from "@/hooks/use-interview-reports";
import { useResumeHistoryQuery } from "@/hooks/use-resume-reports";

interface ActivityItem {
  key: string;
  label: string;
  detail: string;
  date: string;
  href: string;
}

export default function DashboardHomePage() {
  const { user } = useCurrentUser();
  const analytics = useAnalyticsQuery();
  const interviewReports = useInterviewReportsQuery();
  const resumeReports = useResumeHistoryQuery();

  const isLoading = analytics.isLoading || interviewReports.isLoading || resumeReports.isLoading;

  const activity: ActivityItem[] = [
    ...(interviewReports.data?.interviewReports ?? []).map((report) => ({
      key: `interview-${report._id}`,
      label: report.title || "Career strategy report",
      detail: `Match score ${report.matchScore}`,
      date: report.createdAt,
      href: `/career-report/${report._id}`,
    })),
    ...(resumeReports.data?.reports ?? []).map((report) => ({
      key: `resume-${report._id}`,
      label: `Resume analysis ${report.versionLabel}`,
      detail: `ATS score ${report.atsScore}`,
      date: report.createdAt,
      href: "/resume-analyzer/history",
    })),
    ...(analytics.data?.sessionsHistory ?? []).map((session) => ({
      key: `session-${session.id}`,
      label: `${session.role} mock interview`,
      detail: `Overall score ${session.score}`,
      date: session.date,
      href: `/mock-interview/${session.id}/result`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const hasNoData =
    !isLoading &&
    (interviewReports.data?.interviewReports.length ?? 0) === 0 &&
    (resumeReports.data?.reports.length ?? 0) === 0 &&
    (analytics.data?.sessionsHistory.length ?? 0) === 0;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome back, ${user?.username ?? ""}`}
        description="Here's where your interview prep stands today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <StatTile
              label="Level"
              value={analytics.data?.level ?? 1}
              icon={Star}
              tone="gamification"
              hint={`${(analytics.data?.xp ?? 0).toLocaleString()} XP total`}
            />
            <StatTile
              label="Latest resume score"
              value={(resumeReports.data?.reports.length ?? 0) === 0 ? "—" : analytics.data!.latestResumeScore}
              icon={FileScan}
              hint={(resumeReports.data?.reports.length ?? 0) === 0 ? "No analysis yet" : "out of 100"}
            />
            <StatTile
              label="Interview sessions"
              value={analytics.data?.sessionsHistory.length ?? 0}
              icon={Mic}
              hint="Completed to date"
            />
            <StatTile
              label="Overall performance"
              value={analytics.data ? `${analytics.data.interviewPerformance.overall}` : "—"}
              icon={TrendingUp}
              hint={
                (analytics.data?.sessionsHistory.length ?? 0) === 0
                  ? "Baseline — complete a session to update"
                  : "out of 100"
              }
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Quick actions</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickActionCard
                title="AI Mock Interview"
                description="Practice live with an AI interviewer"
                href="/mock-interview"
                icon={Mic}
              />
              <QuickActionCard
                title="Resume Analyzer"
                description="Get your ATS match score"
                href="/resume-analyzer"
                icon={FileScan}
              />
              <QuickActionCard
                title="Career Report"
                description="Generate a tailored prep plan"
                href="/career-report"
                icon={Compass}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Recent activity</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-14 rounded-xl" />
                <Skeleton className="h-14 rounded-xl" />
              </div>
            ) : hasNoData ? (
              <EmptyState
                icon={Sparkles}
                title="No activity yet"
                description="Run your first mock interview or resume analysis to see your progress here."
                action={
                  <Link href="/mock-interview" className="text-sm font-medium text-primary hover:underline">
                    Start a mock interview
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2">
                {activity.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/30"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="size-4 text-primary" />
              Usage this month
            </div>
            <UsageMeter />
          </div>

          <Link
            href="/analytics"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">View full analytics</p>
              <p className="text-xs text-muted-foreground">Performance trends &amp; skill breakdown</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
