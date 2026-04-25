import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Document } from "@/lib/data";
import DocumentStatusBadge from "./document-status-badge";
import { format, parseISO } from 'date-fns';
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DocumentListProps = {
  documents: Document[];
};

export default function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Uploader</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Last Updated</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/documents/${doc.id}`} className="hover:underline">
                  {doc.name}
                </Link>
                <div className="text-xs text-muted-foreground md:hidden">{doc.uploader.name}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{doc.uploader.name}</TableCell>
              <TableCell>
                <DocumentStatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(parseISO(doc.updatedAt), "MMM d, yyyy")}
              </TableCell>
               <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem asChild><Link href={`/dashboard/documents/${doc.id}`}>View Details</Link></DropdownMenuItem>
                    <DropdownMenuItem>Review</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
