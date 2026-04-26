'use client';

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBarChart,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Document } from '@/lib/data';
import { useMemo } from 'react';

const chartConfig = {
  count: {
    label: 'Documents',
    color: 'hsl(var(--chart-1))',
  },
};

type ChartProps = {
  documents: Document[] | null;
}

export default function DocumentsByTypeChart({ documents }: ChartProps) {
  const chartData = useMemo(() => {
    if (!documents) return [];
    const counts = documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [documents]);

  if (!chartData || chartData.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center text-muted-foreground">No document data</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <RechartsBarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
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
