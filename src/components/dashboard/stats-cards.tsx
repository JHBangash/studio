import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { documents } from "@/lib/data";
import { CheckCircle2, Clock, ThumbsDown, AlertCircle } from "lucide-react";

export default function StatsCards() {
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const approvedCount = documents.filter((d) => d.status === "approved").length;
  const rejectedCount = documents.filter((d) => d.status === "rejected").length;
  // This would be calculated based on deadlines in a real app
  const overdueCount = 1; 

  const stats = [
    { title: "Pending", value: pendingCount, icon: Clock, color: "text-amber-500" },
    { title: "Approved", value: approvedCount, icon: CheckCircle2, color: "text-green-500" },
    { title: "Rejected", value: rejectedCount, icon: ThumbsDown, color: "text-red-500" },
    { title: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              documents currently in this state
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
