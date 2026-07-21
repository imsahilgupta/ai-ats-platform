"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SessionHistoryEntry } from "@/types/analytics";

// Fixed categorical order/colors matching lib/constants.ts INTERVIEW_TYPES —
// validated together via the dataviz palette validator (see globals.css).
const chartConfig: ChartConfig = {
  technical: { label: "Technical", color: "var(--chart-1)" },
  behavioral: { label: "Behavioral", color: "var(--chart-2)" },
  hr: { label: "HR", color: "var(--chart-3)" },
  "system-design": { label: "System Design", color: "var(--chart-4)" },
};

// Multi-series (up to 4 interview types) — a legend is always shown here, per
// dataviz rules for >=2 series. Pivoted so each interview type is its own key
// (only one is non-null per session), giving each bar its category color via
// the shared ChartConfig rather than ad-hoc per-cell coloring.
export function SessionsHistoryChart({ sessions }: { sessions: SessionHistoryEntry[] }) {
  const data = sessions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((session) => ({
      date: new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      role: session.role,
      technical: session.type === "technical" ? session.score : undefined,
      behavioral: session.type === "behavioral" ? session.score : undefined,
      hr: session.type === "hr" ? session.score : undefined,
      "system-design": session.type === "system-design" ? session.score : undefined,
    }));

  return (
    <ChartContainer config={chartConfig} className="max-h-72 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={28} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((type) => (
          <Bar key={type} dataKey={type} fill={`var(--color-${type})`} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
