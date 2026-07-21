import { SeverityChip } from "@/components/shared/severity-chip";
import type { SkillGap } from "@/types/interview";

export function SkillGapList({ skillGaps }: { skillGaps: SkillGap[] }) {
  if (skillGaps.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">Skill gaps</h3>
      <div className="space-y-2">
        {skillGaps.map((gap, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
          >
            <span className="text-sm text-foreground">{gap.skill}</span>
            <SeverityChip severity={gap.severity} />
          </div>
        ))}
      </div>
    </div>
  );
}
