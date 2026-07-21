"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { InterviewPerformance } from "@/types/analytics";

const chartConfig: ChartConfig = {
  score: { label: "Your score", color: "var(--chart-1)" },
};

// Single series across categories — no legend needed (the chart title/context
// already names the one series; per dataviz rules a lone series skips the
// legend box).
export function RadarSkillChart({ performance }: { performance: InterviewPerformance }) {
  const data = [
    { category: "Technical", score: performance.technical },
    { category: "Behavioral", score: performance.behavioral },
    { category: "HR", score: performance.hr },
  ];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-64">
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="score"
          fill="var(--chart-1)"
          fillOpacity={0.3}
          stroke="var(--chart-1)"
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  );
}
