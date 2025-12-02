import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Star,
  Banknote,
  Clock,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { ETF, FREE_UNLOCKED_TICKERS } from '@/types/etf';
import { CanaryStatusBadge } from './CanaryStatusBadge';
import { BlurredCell } from './BlurredCell';

interface ETFTableProps {
  etfs: ETF[];
  isPaid: boolean;
  onUpgrade: () => void;
}

type SortKey = keyof ETF;
type SortDirection = 'asc' | 'desc';

export function ETFTable({ etfs, isPaid, onUpgrade }: ETFTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('takeHomeCashReturn1Y');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Separate free unlocked ETFs and sort them to always appear first
  const sortedETFs = [...etfs].sort((a, b) => {
    const aIsFree = FREE_UNLOCKED_TICKERS.includes(a.ticker);
    const bIsFree = FREE_UNLOCKED_TICKERS.includes(b.ticker);
    
    // Free sample ETFs always come first
    if (aIsFree && !bIsFree) return -1;
    if (!aIsFree && bIsFree) return 1;
    
    // Within each group, sort by the selected column
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const toggleWatchlist = (ticker: string) => {
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(ticker)) {
      newWatchlist.delete(ticker);
    } else {
      newWatchlist.add(ticker);
    }
    setWatchlist(newWatchlist);
  };

  const isUnlocked = (ticker: string) => isPaid || FREE_UNLOCKED_TICKERS.includes(ticker);

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    return `$${value.toFixed(2)}`;
  };

  const SortableHeader = ({ 
    label, 
    sortKeyProp, 
    icon: Icon,
    className = '',
    isKiller = false,
  }: { 
    label: string; 
    sortKeyProp: SortKey;
    icon?: typeof ChevronDown;
    className?: string;
    isKiller?: boolean;
  }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-secondary/50 transition-colors ${className} ${isKiller ? 'bg-primary/5' : ''}`}
      onClick={() => handleSort(sortKeyProp)}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className={`h-3.5 w-3.5 ${isKiller ? 'text-primary' : 'text-muted-foreground'}`} />}
        <span className={isKiller ? 'text-primary font-semibold' : ''}>{label}</span>
        {sortKey === sortKeyProp && (
          sortDirection === 'asc' 
            ? <ChevronUp className="h-3 w-3" /> 
            : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sortedETFs.length} ETFs
          </span>
        </div>
        {isPaid && (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                {isPaid && <TableHead className="w-10" />}
                <SortableHeader label="Ticker" sortKeyProp="ticker" />
                <SortableHeader label="Name" sortKeyProp="name" className="min-w-[200px]" />
                <SortableHeader label="Issuer" sortKeyProp="issuer" />
                <SortableHeader 
                  label="Canary Status" 
                  sortKeyProp="canaryStatus"
                  isKiller 
                />
                <SortableHeader 
                  label="Death Clock" 
                  sortKeyProp="deathClock" 
                  icon={Clock}
                  isKiller 
                />
                <SortableHeader 
                  label="True Income Yield" 
                  sortKeyProp="trueIncomeYield" 
                  icon={Percent}
                  isKiller 
                />
                <SortableHeader 
                  label="Total Return 1Y" 
                  sortKeyProp="totalReturn1Y" 
                  icon={TrendingUp}
                  isKiller 
                />
                <SortableHeader 
                  label="Take-Home Cash 1Y" 
                  sortKeyProp="takeHomeCashReturn1Y" 
                  icon={Banknote}
                  isKiller 
                  className="min-w-[160px]"
                />
                <SortableHeader label="Price" sortKeyProp="latestAdjClose" />
                <SortableHeader label="Headline Yield" sortKeyProp="headlineYieldTTM" />
                <SortableHeader label="ROC %" sortKeyProp="rocPercent" />
                <SortableHeader label="AUM" sortKeyProp="aum" />
                <SortableHeader label="Expense" sortKeyProp="expenseRatio" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedETFs.map((etf, index) => {
                const unlocked = isUnlocked(etf.ticker);
                const isFreeExample = FREE_UNLOCKED_TICKERS.includes(etf.ticker);
                
                return (
                  <TableRow 
                    key={etf.id}
                    className={`
                      hover:bg-secondary/30 transition-colors
                      ${isFreeExample && !isPaid ? 'bg-primary/5' : ''}
                      animate-fade-in
                    `}
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {isPaid && (
                      <TableCell>
                        <button
                          onClick={() => toggleWatchlist(etf.ticker)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              watchlist.has(etf.ticker) 
                                ? 'fill-primary text-primary' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </button>
                      </TableCell>
                    )}
                    <TableCell className="font-mono font-semibold text-foreground">
                      {etf.ticker}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {etf.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {etf.issuer}
                    </TableCell>
                    <TableCell>
                      <CanaryStatusBadge status={etf.canaryStatus} />
                    </TableCell>
                    <TableCell className="bg-primary/5">
                      <BlurredCell 
                        value={etf.deathClock}
                        isUnlocked={unlocked}
                        onUpgradeClick={onUpgrade}
                        isHighlighted
                      />
                    </TableCell>
                    <TableCell className="bg-primary/5">
                      <BlurredCell 
                        value={formatPercent(etf.trueIncomeYield)}
                        isUnlocked={unlocked}
                        onUpgradeClick={onUpgrade}
                        isHighlighted
                      />
                    </TableCell>
                    <TableCell className="bg-primary/5">
                      <BlurredCell 
                        value={formatPercent(etf.totalReturn1Y)}
                        isUnlocked={unlocked}
                        onUpgradeClick={onUpgrade}
                        isHighlighted
                        colorCode
                      />
                    </TableCell>
                    <TableCell className="bg-primary/5">
                      <div className="flex items-center gap-1.5">
                        <BlurredCell 
                          value={formatPercent(etf.takeHomeCashReturn1Y)}
                          isUnlocked={unlocked}
                          onUpgradeClick={onUpgrade}
                          isHighlighted
                          colorCode
                        />
                        {unlocked && (
                          <span className="text-lg">💰</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      ${etf.latestAdjClose.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {formatPercent(etf.headlineYieldTTM)}
                    </TableCell>
                    <TableCell>
                      <BlurredCell 
                        value={`${etf.rocPercent}%`}
                        isUnlocked={unlocked}
                        onUpgradeClick={onUpgrade}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {formatCurrency(etf.aum)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {(etf.expenseRatio * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Free tier CTA */}
      {!isPaid && (
        <div className="text-center py-6 border border-dashed border-primary/30 rounded-xl bg-primary/5">
          <p className="text-muted-foreground mb-3">
            Upgrade to unlock all ETF data, watchlists, alerts, and CSV export
          </p>
          <Button onClick={onUpgrade} className="gap-2 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
            <Banknote className="h-4 w-4" />
            Unlock Full Access
          </Button>
        </div>
      )}
    </div>
  );
}
