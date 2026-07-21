"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  users: { label: "Total users", color: "var(--chart-1)" },
};

export function GrowthChart({ data }: { data: { date: string; users: number }[] }) {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    users: d.users,
  }));

  return (
    <ChartContainer config={chartConfig} className="max-h-64 w-full">
      <LineChart data={formatted}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={40} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
