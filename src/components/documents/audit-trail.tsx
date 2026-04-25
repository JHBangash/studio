import { type Document } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type AuditTrailProps = {
  trail: Document["auditTrail"];
};

export default function AuditTrail({ trail }: AuditTrailProps) {
  return (
    <ScrollArea className="h-48">
      <div className="space-y-4 pr-4">
        {trail.map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <p className="font-medium">{event.action}</p>
                <p className="text-muted-foreground text-xs">{format(parseISO(event.date), "MMM d, h:mm a")}</p>
              </div>
              <p className="text-xs text-muted-foreground">by {event.user}</p>
              {event.comment && (
                <p className="text-xs italic bg-muted p-2 rounded-md">"{event.comment}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
