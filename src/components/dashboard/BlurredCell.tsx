import { Lock } from 'lucide-react';

interface BlurredCellProps {
  value: string;
  isUnlocked: boolean;
  onUpgradeClick: () => void;
}

export function BlurredCell({ value, isUnlocked, onUpgradeClick }: BlurredCellProps) {
  if (isUnlocked) {
    return (
      <span className="font-mono text-foreground">
        {value}
      </span>
    );
  }

  return (
    <button
      onClick={onUpgradeClick}
      className="group relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <span className="blur-[4px] font-mono text-muted-foreground">
        {value.replace(/[0-9.-]/g, '?')}
      </span>
      <Lock className="h-3 w-3 text-muted-foreground" />
    </button>
  );
}
