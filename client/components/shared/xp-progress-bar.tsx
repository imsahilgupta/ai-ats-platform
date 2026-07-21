// Mirrors the backend's leveling formula (mockInterview.controller.js
// awardUserXP): level = floor(xp / 1000) + 1, i.e. every 1000 XP is a level.
export function XpProgressBar({ xp, level }: { xp: number; level: number }) {
  const xpIntoLevel = xp % 1000;
  const xpToNextLevel = 1000 - xpIntoLevel;
  const percent = (xpIntoLevel / 1000) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gamification">Level {level}</span>
        <span className="text-muted-foreground">
          {xpToNextLevel} XP to level {level + 1}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gamification transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{xp.toLocaleString()} XP total</p>
    </div>
  );
}
