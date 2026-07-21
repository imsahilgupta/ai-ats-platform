import type { CommunicationScore } from "@/types/mockInterview";

const NUMERIC_METRICS: { key: "confidence" | "clarity"; label: string }[] = [
  { key: "confidence", label: "Confidence" },
  { key: "clarity", label: "Clarity" },
];

export function CommunicationScoreCard({ score }: { score: CommunicationScore }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Communication</h3>
      <div className="space-y-3">
        {NUMERIC_METRICS.map((metric) => (
          <div key={metric.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-medium text-foreground">{score[metric.key]}/10</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(score[metric.key] / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Pace</span>
          <span className="font-medium capitalize text-foreground">{score.pace}</span>
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          {score.fillerWordsCount} filler word{score.fillerWordsCount === 1 ? "" : "s"} detected across your answers
        </p>
      </div>
    </div>
  );
}
