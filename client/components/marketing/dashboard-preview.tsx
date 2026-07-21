"use client";

import { motion } from "framer-motion";
import { BarChart3, FileScan, Mic, Star } from "lucide-react";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { StatTile } from "@/components/shared/stat-tile";
import { XpProgressBar } from "@/components/shared/xp-progress-bar";

export function DashboardPreview() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-6"
    >
      <div className="mb-4 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-destructive/60" />
        <span className="size-2.5 rounded-full bg-warning/60" />
        <span className="size-2.5 rounded-full bg-success/60" />
        <span className="ml-3 text-xs text-muted-foreground">mockmate.ai/dashboard</span>
      </div>

      <div className="grid gap-4 text-left sm:grid-cols-[auto_1fr]">
        <div className="flex items-center justify-center rounded-xl border border-border bg-background p-6">
          <ScoreGauge value={87} size={104} label="Match score" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatTile label="Level" value={4} icon={Star} tone="gamification" hint="3,250 XP total" />
          <StatTile label="Latest resume score" value={82} icon={FileScan} hint="out of 100" />
          <StatTile label="Sessions completed" value={12} icon={Mic} />
          <StatTile label="Overall performance" value={78} icon={BarChart3} hint="out of 100" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background p-4">
        <XpProgressBar xp={3250} level={4} />
      </div>
    </motion.div>
  );
}
