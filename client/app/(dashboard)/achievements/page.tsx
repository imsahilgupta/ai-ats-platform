"use client";

import { Trophy } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { BadgeCard } from "@/components/shared/badge-card";
import { XpProgressBar } from "@/components/shared/xp-progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsQuery } from "@/hooks/use-analytics";
import { BADGE_CATALOG } from "@/lib/constants";

export default function AchievementsPage() {
  const { data, isLoading } = useAnalyticsQuery();

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const earnedNames = new Set(data.badges.map((b) => b.name));
  // The server only ever returns *earned* badges — this catalog of the two
  // fixed XP-threshold badges (see mockInterview.controller.js awardUserXP)
  // is inferred client-side purely to render locked/unearned placeholders.
  const lockedCatalogEntries = BADGE_CATALOG.filter((entry) => !earnedNames.has(entry.name));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Achievements" description="Badges and milestones earned through your practice." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile label="Current level" value={data.level} icon={Trophy} tone="gamification" />
        <div className="rounded-xl border border-border bg-card p-4">
          <XpProgressBar xp={data.xp} level={data.level} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Badges</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data.badges.map((badge, i) => (
            <BadgeCard
              key={`${badge.name}-${i}`}
              name={badge.name}
              icon={badge.icon}
              description={badge.description}
              earned
              dateEarned={badge.dateEarned}
            />
          ))}
          {lockedCatalogEntries.map((entry) => (
            <BadgeCard
              key={entry.key}
              name={entry.name}
              icon={entry.icon}
              description={`Reach ${entry.xpThreshold.toLocaleString()} XP`}
              earned={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
