import DocumentList from "@/components/documents/document-list";
import { documents } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import DocumentUpload from "@/components/documents/document-upload";

export default function DocumentsPage() {
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
        <DocumentList documents={documents} />
      </div>
    </div>
  );
}
