"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MatchScoreCard } from "@/components/dashboard/career-report/match-score-card";
import { QuestionAccordion } from "@/components/dashboard/career-report/question-accordion";
import { SkillGapList } from "@/components/dashboard/career-report/skill-gap-list";
import { PreparationPlanTimeline } from "@/components/dashboard/career-report/preparation-plan-timeline";
import { useInterviewReportQuery, useDeleteInterviewReportMutation } from "@/hooks/use-interview-reports";
import { downloadTailoredResumePdf } from "@/lib/api/interview";
import { downloadBlob } from "@/lib/api/client";
import { ApiError } from "@/types/api";

export default function CareerReportDetailPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const router = useRouter();
  const { data, isLoading } = useInterviewReportQuery(reportId);
  const deleteMutation = useDeleteInterviewReportMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const pdfMutation = useMutation({
    mutationFn: () => downloadTailoredResumePdf(reportId),
    onSuccess: (blob) => {
      downloadBlob(blob, `tailored-resume-${reportId}.pdf`);
      toast.success("Tailored resume downloaded");
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.body.message : "Failed to generate PDF.");
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Report not found.</p>;
  }

  const { interviewReport } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title={interviewReport.title || "Career strategy report"}
        description={`Generated ${new Date(interviewReport.createdAt).toLocaleDateString()}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => pdfMutation.mutate()} disabled={pdfMutation.isPending}>
              {pdfMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Tailored resume PDF
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        }
      />

      <MatchScoreCard matchScore={interviewReport.matchScore} title={interviewReport.title} />

      <div className="rounded-xl border border-border bg-card p-6">
        <SkillGapList skillGaps={interviewReport.skillGaps} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <PreparationPlanTimeline plan={interviewReport.preparationPlan} />
      </div>

      <QuestionAccordion title="Technical questions" questions={interviewReport.technicalQuestions} />
      <QuestionAccordion title="Behavioral questions" questions={interviewReport.behavioralQuestions} />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this report?"
        description="This action can't be undone. The report and its preparation plan will be permanently deleted."
        isPending={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(reportId, {
            onSuccess: () => {
              toast.success("Report deleted");
              router.push("/reports");
            },
            onError: () => toast.error("Failed to delete report."),
          })
        }
      />
    </div>
  );
}
