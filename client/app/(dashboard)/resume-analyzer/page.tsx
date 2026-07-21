"use client";

import { useState } from "react";
import Link from "next/link";
import { History, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ResumeUploadForm } from "@/components/dashboard/resume-analyzer/resume-upload-form";
import { AtsScoreBreakdown } from "@/components/dashboard/resume-analyzer/ats-score-breakdown";
import { BulletPointDiff } from "@/components/dashboard/resume-analyzer/bullet-point-diff";
import { MarkdownReport } from "@/components/shared/markdown-report";
import type { ResumeReport } from "@/types/resume";

export default function ResumeAnalyzerPage() {
  const [report, setReport] = useState<ResumeReport | null>(null);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Resume ATS Analyzer"
        description="Upload your resume and a target job description to get an ATS match score and improvement suggestions."
        action={
          <Button variant="outline" render={<Link href="/resume-analyzer/history" />}>
            <History className="size-4" />
            Version history
          </Button>
        }
      />

      {report ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Result for <span className="font-medium text-foreground">{report.versionLabel}</span>
            </p>
            <Button variant="outline" size="sm" onClick={() => setReport(null)}>
              <RotateCcw className="size-3.5" />
              Analyze another
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <AtsScoreBreakdown report={report} />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <BulletPointDiff bulletPoints={report.weakBulletPoints} />
          </div>

          {report.experienceQualityReport && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Experience quality report</h3>
              <MarkdownReport content={report.experienceQualityReport} />
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <ResumeUploadForm onAnalyzed={setReport} />
        </div>
      )}
    </div>
  );
}
