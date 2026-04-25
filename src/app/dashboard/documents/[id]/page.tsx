import { documents, type Document } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageSquare, ThumbsUp, ThumbsDown, Archive } from "lucide-react";
import DocumentStatusBadge from "@/components/documents/document-status-badge";
import WorkflowStatus from "@/components/documents/workflow-status";
import AuditTrail from "@/components/documents/audit-trail";
import { Separator } from "@/components/ui/separator";

export default function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const document = documents.find((doc) => doc.id === params.id);

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/documents">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline leading-tight">
            {document.name}
          </h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            Uploaded by {document.uploader.name}
            <DocumentStatusBadge status={document.status} />
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">PDF Preview Area</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Approval Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
               <Button>
                <ThumbsUp className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button variant="destructive">
                <ThumbsDown className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" /> Add Comment
              </Button>
               <Button variant="secondary">
                <Archive className="mr-2 h-4 w-4" /> Archive
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Metadata</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Metadata</span>
              </Button>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {Object.entries(document.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowStatus workflow={document.workflow} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTrail trail={document.auditTrail} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
