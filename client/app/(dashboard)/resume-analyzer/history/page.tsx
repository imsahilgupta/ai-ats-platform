"use client";

import Link from "next/link";
import { FileScan } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ResumeTrendChart } from "@/components/dashboard/resume-analyzer/resume-trend-chart";
import { useResumeHistoryQuery } from "@/hooks/use-resume-reports";

export default function ResumeAnalyzerHistoryPage() {
  const { data, isLoading } = useResumeHistoryQuery();
  const reports = data?.reports ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Resume version history"
        description="Track how your ATS score has changed across analyses."
        action={
          <Button render={<Link href="/resume-analyzer" />}>
            <FileScan className="size-4" />
            New analysis
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileScan}
          title="No resume analyses yet"
          description="Run your first analysis to start tracking your ATS score over time."
          action={
            <Link href="/resume-analyzer" className="text-sm font-medium text-primary hover:underline">
              Analyze your resume
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {reports.length > 1 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">ATS score over time</h3>
              <ResumeTrendChart reports={reports} />
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Version</th>
                  <th className="px-4 py-2.5 text-left font-medium">Source</th>
                  <th className="px-4 py-2.5 text-left font-medium">ATS score</th>
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((report) => (
                    <tr key={report._id}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{report.versionLabel}</td>
                      <td className="px-4 py-2.5 uppercase text-muted-foreground">{report.sourceType}</td>
                      <td className="px-4 py-2.5 tabular-nums text-foreground">{report.atsScore}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
