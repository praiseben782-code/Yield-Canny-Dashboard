import { CanaryStatus } from '@/types/etf';

interface CanaryStatusBadgeProps {
  status: CanaryStatus;
  showLabel?: boolean;
}

export function CanaryStatusBadge({ status, showLabel = true }: CanaryStatusBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border">
      <span>{status}</span>
    </div>
  );
}
