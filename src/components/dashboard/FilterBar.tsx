import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CanaryStatus } from '@/types/etf';
import { Heart, AlertTriangle, Skull, Filter, X } from 'lucide-react';

interface FilterBarProps {
  statusFilter: CanaryStatus | 'all';
  onStatusFilterChange: (status: CanaryStatus | 'all') => void;
  issuerFilter: string;
  onIssuerFilterChange: (issuer: string) => void;
  issuers: string[];
  onClearFilters: () => void;
}

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  issuerFilter,
  onIssuerFilterChange,
  issuers,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = statusFilter !== 'all' || issuerFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          className={`h-7 px-3 ${statusFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => onStatusFilterChange('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'Healthy' ? 'default' : 'ghost'}
          size="sm"
          className={`h-7 px-3 gap-1.5 ${statusFilter === 'Healthy' ? 'bg-canary-green/20 text-canary-green border border-canary-green/30' : ''}`}
          onClick={() => onStatusFilterChange('Healthy')}
        >
          <Heart className="h-3 w-3" />
          Healthy
        </Button>
        <Button
          variant={statusFilter === 'Dying' ? 'default' : 'ghost'}
          size="sm"
          className={`h-7 px-3 gap-1.5 ${statusFilter === 'Dying' ? 'bg-canary-yellow/20 text-canary-yellow border border-canary-yellow/30' : ''}`}
          onClick={() => onStatusFilterChange('Dying')}
        >
          <AlertTriangle className="h-3 w-3" />
          Dying
        </Button>
        <Button
          variant={statusFilter === 'Dead' ? 'default' : 'ghost'}
          size="sm"
          className={`h-7 px-3 gap-1.5 ${statusFilter === 'Dead' ? 'bg-canary-red/20 text-canary-red border border-canary-red/30' : ''}`}
          onClick={() => onStatusFilterChange('Dead')}
        >
          <Skull className="h-3 w-3" />
          Dead
        </Button>
      </div>

      {/* Issuer Filter */}
      <Select value={issuerFilter} onValueChange={onIssuerFilterChange}>
        <SelectTrigger className="w-[160px] h-8 bg-secondary/50 border-border/50">
          <SelectValue placeholder="All Issuers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Issuers</SelectItem>
          {issuers.map((issuer) => (
            <SelectItem key={issuer} value={issuer}>
              {issuer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
