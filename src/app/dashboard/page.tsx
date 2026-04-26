'use client';

import StatsCards from '@/components/dashboard/stats-cards';
import DocumentList from '@/components/documents/document-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, FileText, Loader2 } from 'lucide-react';
import DocumentsByTypeChart from '@/components/dashboard/documents-by-type-chart';
import { useCollection, useUser } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function DashboardPage() {
  const { user } = useUser();

  const documentsRef = collection(useFirestore(), 'documents');
  const recentDocsQuery = query(
    documentsRef,
    orderBy('createdAt', 'desc'),
    limit(5)
  );
  const { data: recentDocuments, loading: recentDocsLoading } =
    useCollection(recentDocsQuery);
  const { data: allDocuments, loading: allDocsLoading } =
    useCollection(documentsRef);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}! Here's an overview of your
          team's activity.
        </p>
      </div>

      <StatsCards documents={allDocuments} isLoading={allDocsLoading} />

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
            {recentDocsLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <DocumentList documents={recentDocuments} />
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              <CardTitle>Documents by Type</CardTitle>
            </div>
            <CardDescription>
              Distribution of documents across different categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allDocsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <DocumentsByTypeChart documents={allDocuments} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
