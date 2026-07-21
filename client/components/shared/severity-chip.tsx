import { AlertTriangle, CircleAlert, Info } from "lucide-react";
import type { SkillSeverity } from "@/types/interview";
import { cn } from "@/lib/utils";

const SEVERITY_CONFIG: Record<SkillSeverity, { label: string; icon: typeof Info; className: string }> = {
  low: {
    label: "Low priority",
    icon: Info,
    className: "bg-success/10 text-success border-success/20",
  },
  medium: {
    label: "Medium priority",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning-foreground border-warning/30 dark:text-warning",
  },
  high: {
    label: "High priority",
    icon: CircleAlert,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function SeverityChip({ severity }: { severity: SkillSeverity }) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}
