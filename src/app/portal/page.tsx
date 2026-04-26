'use client';

import DocumentList from '@/components/documents/document-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DocumentUpload from '@/components/documents/document-upload';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export default function PortalPage() {
  const { user } = useUser();
  const db = useFirestore();

  const documentsRef = collection(db, 'documents');
  const q = query(
    documentsRef,
    where('uploaderId', '==', user?.uid || ''),
    orderBy('createdAt', 'desc')
  );
  const { data: customerDocuments, loading } = useCollection(q);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">
            Your Document Hub
          </h1>
          <p className="text-muted-foreground">
            Submit new documents and track their approval status.
          </p>
        </div>
        <DocumentUpload>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New Document
          </Button>
        </DocumentUpload>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
          <CardDescription>
            Here are the documents you've submitted for review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : customerDocuments && customerDocuments.length > 0 ? (
            <DocumentList documents={customerDocuments} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              You haven't submitted any documents yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
