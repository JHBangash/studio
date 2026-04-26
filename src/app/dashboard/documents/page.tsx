'use client';

import DocumentList from '@/components/documents/document-list';
import { Button } from '@/components/ui/button';
import { FilePlus2, Loader2 } from 'lucide-react';
import DocumentUpload from '@/components/documents/document-upload';
import { useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function DocumentsPage() {
  const documentsRef = collection(useFirestore(), 'documents');
  const q = query(documentsRef, orderBy('createdAt', 'desc'));
  const { data: documents, loading } = useCollection(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-headline">All Documents</h1>
          <p className="text-muted-foreground">
            Manage, review, and track all documents in the system.
          </p>
        </div>
        <DocumentUpload>
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </DocumentUpload>
      </div>
      <div className="border rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DocumentList documents={documents} />
        )}
      </div>
    </div>
  );
}
