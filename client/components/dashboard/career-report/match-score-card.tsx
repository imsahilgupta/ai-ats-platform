import { ScoreGauge } from "@/components/shared/score-gauge";

export function MatchScoreCard({ matchScore, title }: { matchScore: number; title?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
      <ScoreGauge value={matchScore} size={128} label="Match" />
      <div className="text-center sm:text-left">
        <p className="text-sm font-medium text-muted-foreground">Job match score</p>
        <p className="text-lg font-semibold text-foreground">{title || "Career strategy report"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on how well your resume and background align with this role&apos;s requirements.
        </p>
      </div>
    </div>
  );
}
