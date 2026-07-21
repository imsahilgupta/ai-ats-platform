"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ResumeReport } from "@/types/resume";

const chartConfig: ChartConfig = {
  atsScore: { label: "ATS score", color: "var(--chart-1)" },
};

// Single series over time — no legend needed.
export function ResumeTrendChart({ reports }: { reports: ResumeReport[] }) {
  const data = reports
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((report) => ({
      version: report.versionLabel,
      atsScore: report.atsScore,
    }));

  return (
    <ChartContainer config={chartConfig} className="max-h-56 w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="version" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={28} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="atsScore"
          type="monotone"
          stroke="var(--color-atsScore)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-atsScore)" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
