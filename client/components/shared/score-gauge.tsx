import { cn } from "@/lib/utils";

function bandFor(value: number) {
  if (value >= 75) return { color: "var(--success)", label: "Strong" };
  if (value >= 50) return { color: "var(--warning)", label: "Fair" };
  return { color: "var(--destructive)", label: "Needs work" };
}

export function ScoreGauge({
  value,
  size = 96,
  strokeWidth = 8,
  label,
  showBandLabel = true,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showBandLabel?: boolean;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const band = bandFor(clamped);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={band.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums text-foreground">{Math.round(clamped)}</span>
          {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
        </div>
      </div>
      {showBandLabel && (
        <span className="text-xs font-medium" style={{ color: band.color }}>
          {band.label}
        </span>
      )}
    </div>
  );
}
