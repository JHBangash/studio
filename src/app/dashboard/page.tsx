import { documents } from "@/lib/data";
import StatsCards from "@/components/dashboard/stats-cards";
import DocumentList from "@/components/documents/document-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, FileText } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

export default function DashboardPage() {
  const recentDocuments = documents.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, John! Here's an overview of your team's activity.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle>Recent Documents</CardTitle>
            </div>
            <CardDescription>
              A view of the latest documents being processed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentList documents={recentDocuments} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
             <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              <CardTitle>Documents by Type</CardTitle>
            </div>
            <CardDescription>Distribution of documents across different categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={chartData}>
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
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
