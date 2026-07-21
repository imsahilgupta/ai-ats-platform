import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function BadgeCard({
  name,
  icon,
  description,
  earned,
  dateEarned,
}: {
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  dateEarned?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
        earned ? "border-gamification/30 bg-gamification/5" : "border-border bg-muted/30 opacity-60",
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-background text-2xl">
        {earned ? icon : <Lock className="size-5 text-muted-foreground" />}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {earned && dateEarned && (
        <p className="text-[10px] text-muted-foreground">
          Earned {new Date(dateEarned).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
