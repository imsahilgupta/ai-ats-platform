import { AlertTriangle, KeyRound } from "lucide-react";
import { ScoreGauge } from "@/components/shared/score-gauge";
import type { ResumeReport } from "@/types/resume";

export function AtsScoreBreakdown({ report }: { report: ResumeReport }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <ScoreGauge value={report.atsScore} size={120} label="ATS score" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <AlertTriangle className="size-4 text-warning" />
            Formatting issues
          </div>
          {report.formattingProblems.length === 0 ? (
            <p className="text-xs text-muted-foreground">No formatting issues detected.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {report.formattingProblems.map((problem, i) => (
                <li key={i} className="flex gap-1.5">
                  <span aria-hidden>&bull;</span>
                  {problem}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <KeyRound className="size-4 text-primary" />
            Missing keywords
          </div>
          {report.missingKeywords.length === 0 ? (
            <p className="text-xs text-muted-foreground">Great keyword coverage.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {report.missingKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
