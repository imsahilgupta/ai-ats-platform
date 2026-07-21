"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ScrollText, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useInterviewReportsQuery, useDeleteInterviewReportMutation } from "@/hooks/use-interview-reports";
import { useResumeHistoryQuery } from "@/hooks/use-resume-reports";

export default function ReportsHistoryPage() {
  const interviewReports = useInterviewReportsQuery();
  const resumeReports = useResumeHistoryQuery();
  const deleteMutation = useDeleteInterviewReportMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Reports history" description="All your career reports and resume analyses in one place." />

      <Tabs defaultValue="career">
        <TabsList className="mb-6">
          <TabsTrigger value="career">Career reports</TabsTrigger>
          <TabsTrigger value="resume">Resume analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="career">
          {interviewReports.isLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (interviewReports.data?.interviewReports.length ?? 0) === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No career reports yet"
              description="Generate a career strategy report to see it here."
              action={
                <Link href="/career-report" className="text-sm font-medium text-primary hover:underline">
                  Create a report
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {interviewReports.data!.interviewReports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <Link href={`/career-report/${report._id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {report.title || "Career strategy report"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Match score {report.matchScore} &middot; {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setPendingDeleteId(report._id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resume">
          {resumeReports.isLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (resumeReports.data?.reports.length ?? 0) === 0 ? (
            <EmptyState
              icon={FileText}
              title="No resume analyses yet"
              description="Analyze your resume to see version history here."
              action={
                <Link href="/resume-analyzer" className="text-sm font-medium text-primary hover:underline">
                  Analyze your resume
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {resumeReports.data!.reports.map((report) => (
                <Link
                  key={report._id}
                  href="/resume-analyzer/history"
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      Resume analysis {report.versionLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ATS score {report.atsScore} &middot; {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete this report?"
        description="This action can't be undone."
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          deleteMutation.mutate(pendingDeleteId, {
            onSuccess: () => {
              toast.success("Report deleted");
              setPendingDeleteId(null);
            },
            onError: () => toast.error("Failed to delete report."),
          });
        }}
      />
    </div>
  );
}
