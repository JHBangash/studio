'use client';

import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { type: "Invoice", count: 12 },
  { type: "Contract", count: 8 },
  { type: "Proposal", count: 5 },
  { type: "HR Form", count: 7 },
  { type: "Brief", count: 3 },
  { type: "Report", count: 4 },
];

const chartConfig = {
  count: {
    label: "Documents",
    color: "hsl(var(--primary))",
  },
};

export default function DocumentsByTypeChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <RechartsBarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="type"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
