import { MOCK_INTERVIEW_ROUNDS } from "@/lib/constants";

export function RoundProgress({ currentRound }: { currentRound: number }) {
  const round = Math.min(currentRound, MOCK_INTERVIEW_ROUNDS);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: MOCK_INTERVIEW_ROUNDS }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full ${i < round ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        Round {round} of {MOCK_INTERVIEW_ROUNDS}
      </span>
    </div>
  );
}
