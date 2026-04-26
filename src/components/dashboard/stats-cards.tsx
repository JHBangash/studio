'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Clock, ThumbsDown, AlertCircle, Loader2 } from 'lucide-react';
import type { Document } from '@/lib/data';
import { useMemo } from 'react';

type StatsCardsProps = {
  documents: Document[] | null;
  isLoading: boolean;
};

export default function StatsCards({ documents, isLoading }: StatsCardsProps) {
  const statsData = useMemo(() => {
    if (!documents) {
      return {
        pending: 0,
        approved: 0,
        rejected: 0,
        overdue: 0,
      };
    }
    return {
      pending: documents.filter((d) => d.status === 'pending').length,
      approved: documents.filter((d) => d.status === 'approved').length,
      rejected: documents.filter((d) => d.status === 'rejected').length,
      overdue: 0, // This would be calculated based on deadlines in a real app
    };
  }, [documents]);

  const stats = [
    {
      title: 'Pending',
      value: statsData.pending,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      title: 'Approved',
      value: statsData.approved,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Rejected',
      value: statsData.rejected,
      icon: ThumbsDown,
      color: 'text-red-500',
    },
    {
      title: 'Overdue',
      value: statsData.overdue,
      icon: AlertCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 text-muted-foreground ${stat.color}`}
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
            <p className="text-xs text-muted-foreground">
              documents in this state
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
