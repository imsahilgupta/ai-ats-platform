"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { AdminUser } from "@/types/admin";

const chartConfig: ChartConfig = {
  count: { label: "Users", color: "var(--chart-1)" },
};

export function PlanDistributionChart({ users }: { users: AdminUser[] }) {
  const counts = { FREE: 0, PRO: 0, ENTERPRISE: 0 };
  users.forEach((u) => counts[u.plan]++);
  const data = (["FREE", "PRO", "ENTERPRISE"] as const).map((plan) => ({ plan, count: counts[plan] }));

  return (
    <ChartContainer config={chartConfig} className="max-h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="plan" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} width={28} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
