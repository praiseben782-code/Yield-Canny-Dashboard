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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg border border-border">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3"
          onClick={() => onStatusFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'Healthy' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3"
          onClick={() => onStatusFilterChange('Healthy')}
        >
          Healthy
        </Button>
        <Button
          variant={statusFilter === 'Dying' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3"
          onClick={() => onStatusFilterChange('Dying')}
        >
          Dying
        </Button>
        <Button
          variant={statusFilter === 'Dead' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3"
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
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          onClick={onClearFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
