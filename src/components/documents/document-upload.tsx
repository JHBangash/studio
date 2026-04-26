'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractMetadataAction } from '@/lib/actions';
import { type ExtractDocumentMetadataOutput } from '@/ai/flows/extract-document-metadata';
import { addDocument } from '@/firebase/firestore/db';
import { useUser, useFirestore } from '@/firebase';

export default function DocumentUpload({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] =
    useState<ExtractDocumentMetadataOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
      setMetadata(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setMetadata(null);
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64File = reader.result as string;
        const result = await extractMetadataAction(base64File);
        if (result.success && result.data) {
          setMetadata(result.data);
        } else {
          setError(result.error || 'Failed to extract metadata.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsProcessing(false);
    };
  };

  const handleSubmit = async () => {
    if (!file || !metadata || !user || !db) return;
    setIsUploading(true);
    try {
      await addDocument(db, user, {
        name: file.name,
        type: metadata.documentType,
        metadata: metadata.metadata,
      });

      toast({
        title: 'Document Submitted',
        description:
          'Your document has been successfully uploaded and is now in review.',
      });
      setOpen(false);
      resetState();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Could not submit the document.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setIsUploading(false);
    setIsProcessing(false);
    setError(null);
    setMetadata(null);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a PDF document to start the automated workflow process.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div
            className="flex items-center justify-center w-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF only (MAX. 5MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </label>
          </div>

          {file && !metadata && (
            <div className="p-4 border rounded-md bg-background">
              <p className="font-medium">Selected file: {file.name}</p>
              <div className="flex justify-end mt-2">
                <Button onClick={handleProcessFile} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Extract Metadata'
                  )}
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 border rounded-md bg-destructive/10 text-destructive flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {metadata && (
            <div className="p-4 border rounded-md bg-green-500/10 text-green-700 dark:text-green-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">
                    Metadata Extracted Successfully
                  </p>
                  <p className="text-sm mt-2">
                    <b>Document Type:</b> {metadata.documentType}
                  </p>
                  <div className="mt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {Object.entries(metadata.metadata).map(([key, value]) => (
                      <div key={key}>
                        <b>{key}:</b> {value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading || !metadata}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
