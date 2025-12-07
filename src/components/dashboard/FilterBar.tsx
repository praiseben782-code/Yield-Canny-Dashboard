import { Button } from '@/components/ui/button';
import { CanaryStatus } from '@/types/etf';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  statusFilter: CanaryStatus | 'all';
  onStatusFilterChange: (status: CanaryStatus | 'all') => void;
  onClearFilters: () => void;
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = statusFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-2 xs:gap-3">
      <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-muted-foreground">
        <Filter className="h-3.5 w-3.5 xs:h-4 xs:w-4 flex-shrink-0" />
        <span className="hidden xs:inline">Filters:</span>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-0.5 xs:gap-1 p-0.5 xs:p-1 bg-secondary rounded-lg border border-border flex-wrap">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          className="h-6 xs:h-7 px-2 xs:px-3 text-xs xs:text-sm"
          onClick={() => onStatusFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'Healthy' ? 'default' : 'ghost'}
          size="sm"
          className="h-6 xs:h-7 px-2 xs:px-3 text-xs xs:text-sm"
          onClick={() => onStatusFilterChange('Healthy')}
        >
          Healthy
        </Button>
        <Button
          variant={statusFilter === 'Dying' ? 'default' : 'ghost'}
          size="sm"
          className="h-6 xs:h-7 px-2 xs:px-3 text-xs xs:text-sm"
          onClick={() => onStatusFilterChange('Dying')}
        >
          Dying
        </Button>
        <Button
          variant={statusFilter === 'Dead' ? 'default' : 'ghost'}
          size="sm"
          className="h-6 xs:h-7 px-2 xs:px-3 text-xs xs:text-sm"
          onClick={() => onStatusFilterChange('Dead')}
        >
          Dead
        </Button>
      </div>
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 xs:h-7 px-1.5 xs:px-2 text-xs xs:text-sm text-muted-foreground hover:text-foreground"
          onClick={onClearFilters}
        >
          <X className="h-3 w-3 mr-0.5 xs:mr-1 flex-shrink-0" />
          <span className="hidden xs:inline">Clear</span>
        </Button>
      )}
    </div>
  );
}
