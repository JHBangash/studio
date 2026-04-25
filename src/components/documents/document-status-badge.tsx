import { Badge } from "@/components/ui/badge";
import { type Document } from "@/lib/data";

type DocumentStatusBadgeProps = {
  status: Document["status"];
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-700/60",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-700/60",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-700/60",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-600/60",
};

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  return (
    <Badge variant="outline" className={`capitalize ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
