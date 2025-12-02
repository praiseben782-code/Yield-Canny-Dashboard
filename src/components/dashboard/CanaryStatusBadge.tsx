import { CanaryStatus } from '@/types/etf';
import { Heart, AlertTriangle, Skull } from 'lucide-react';

interface CanaryStatusBadgeProps {
  status: CanaryStatus;
  showLabel?: boolean;
}

export function CanaryStatusBadge({ status, showLabel = true }: CanaryStatusBadgeProps) {
  const config = {
    Healthy: {
      icon: Heart,
      label: 'Healthy',
      className: 'status-healthy',
      iconColor: 'text-canary-green',
    },
    Dying: {
      icon: AlertTriangle,
      label: 'Dying',
      className: 'status-dying',
      iconColor: 'text-canary-yellow',
    },
    Dead: {
      icon: Skull,
      label: 'Dead',
      className: 'status-dead',
      iconColor: 'text-canary-red',
    },
  };

  const { icon: Icon, label, className, iconColor } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      {showLabel && <span>{label}</span>}
    </div>
  );
}
