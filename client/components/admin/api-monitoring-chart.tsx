"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { MockApiLog } from "@/lib/mock/admin";

const chartConfig: ChartConfig = {
  count: { label: "Requests", color: "var(--chart-1)" },
};

export function ApiMonitoringChart({ logs }: { logs: MockApiLog[] }) {
  const counts = new Map<string, number>();
  logs.forEach((log) => {
    const key = log.path.replace("/api/", "");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const data = Array.from(counts.entries()).map(([path, count]) => ({ path, count }));

  return (
    <ChartContainer config={chartConfig} className="max-h-64 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis type="category" dataKey="path" tickLine={false} axisLine={false} width={140} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
