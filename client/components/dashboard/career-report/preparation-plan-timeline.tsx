import type { PreparationPlanDay } from "@/types/interview";

export function PreparationPlanTimeline({ plan }: { plan: PreparationPlanDay[] }) {
  if (plan.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">Weekly preparation plan</h3>
      <ol className="space-y-4">
        {plan
          .slice()
          .sort((a, b) => a.day - b.day)
          .map((entry, i) => (
            <li key={i} className="relative flex gap-4 pl-1">
              <div className="flex flex-col items-center">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {entry.day}
                </span>
                {i < plan.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-foreground">{entry.focus}</p>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {entry.tasks.map((task, j) => (
                    <li key={j} className="flex gap-1.5">
                      <span aria-hidden>&bull;</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}
