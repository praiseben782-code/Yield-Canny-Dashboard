import { Lock } from 'lucide-react';

interface BlurredCellProps {
  value: string;
  isUnlocked: boolean;
  onUpgradeClick: () => void;
  isHighlighted?: boolean;
  colorCode?: boolean; // Show red/green based on positive/negative
}

export function BlurredCell({ 
  value, 
  isUnlocked, 
  onUpgradeClick, 
  isHighlighted = false,
  colorCode = false 
}: BlurredCellProps) {
  if (isUnlocked) {
    let colorClass = 'text-foreground';
    
    if (colorCode) {
      const numValue = parseFloat(value.replace('%', ''));
      if (numValue > 0) {
        colorClass = 'text-canary-green';
      } else if (numValue < 0) {
        colorClass = 'text-canary-red';
      }
    } else if (isHighlighted) {
      colorClass = 'text-primary';
    }
    
    return (
      <span className={`font-mono font-semibold ${colorClass} ${isHighlighted ? 'text-lg' : ''}`}>
        {value}
      </span>
    );
  }

  return (
    <button
      onClick={onUpgradeClick}
      className="group relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
    >
      <span className="blur-premium font-mono text-muted-foreground">
        {value.replace(/[0-9.-]/g, '?')}
      </span>
      <Lock className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
}
