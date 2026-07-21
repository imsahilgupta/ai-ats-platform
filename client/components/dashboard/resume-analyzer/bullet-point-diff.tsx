import { ArrowRight } from "lucide-react";
import type { WeakBulletPoint } from "@/types/resume";

export function BulletPointDiff({ bulletPoints }: { bulletPoints: WeakBulletPoint[] }) {
  if (bulletPoints.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Suggested rewrites</h3>
      {bulletPoints.map((bp, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <p className="text-sm text-muted-foreground line-through decoration-destructive/50">{bp.before}</p>
          <ArrowRight className="hidden size-4 shrink-0 text-muted-foreground sm:block" />
          <p className="text-sm text-foreground">{bp.after}</p>
        </div>
      ))}
    </div>
  );
}
