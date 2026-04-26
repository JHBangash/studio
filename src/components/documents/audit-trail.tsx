import { format, fromUnixTime } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

type AuditTrailProps = {
  trail: any[] | null;
};

export default function AuditTrail({ trail }: AuditTrailProps) {
  if (!trail) return null;

  return (
    <ScrollArea className="h-48">
      <div className="space-y-4 pr-4">
        {trail.map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <p className="font-medium">{event.action}</p>
                {event.date?.seconds && (
                  <p className="text-muted-foreground text-xs">
                    {format(fromUnixTime(event.date.seconds), 'MMM d, h:mm a')}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">by {event.user}</p>
              {event.comment && (
                <p className="text-xs italic bg-muted p-2 rounded-md">
                  "{event.comment}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
