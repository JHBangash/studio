import { CheckCircle2, Clock, ThumbsDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { fromUnixTime, format } from 'date-fns';

type WorkflowStatusProps = {
  workflow: any[] | null;
};

const statusIcons = {
  approved: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  rejected: <ThumbsDown className="h-4 w-4 text-red-500" />,
};

export default function WorkflowStatus({ workflow }: WorkflowStatusProps) {
  if (!workflow) return null;

  return (
    <div className="space-y-4">
      {workflow.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <Avatar
              className="h-8 w-8 text-xs"
              title={`${step.approver} (${step.role})`}
            >
              <AvatarFallback
                className={cn({
                  'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300':
                    step.status === 'approved',
                  'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300':
                    step.status === 'pending',
                  'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300':
                    step.status === 'rejected',
                })}
              >
                {step.approver.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {index < workflow.length - 1 && (
              <div className="w-px h-6 bg-border mt-1" />
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">{step.approver}</p>
              {statusIcons[step.status]}
            </div>
            <p className="text-xs text-muted-foreground">{step.role}</p>
            {step.date?.seconds && (
              <p className="text-xs text-muted-foreground">
                {format(fromUnixTime(step.date.seconds), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
