import { useState, useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { KillerStats } from './KillerStats';
import { ETFTable } from './ETFTable';
import { FilterBar } from './FilterBar';
import { UpgradeModal } from './UpgradeModal';
import { useETFs } from '@/hooks/useETFs';
import { CanaryStatus } from '@/types/etf';

export function Dashboard() {
  const { etfs, loading, error } = useETFs();
  const [isPaid, setIsPaid] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CanaryStatus | 'all'>('all');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Filter ETFs
  const filteredETFs = useMemo(() => {
    return etfs.filter((etf) => {
      // Search filter
      const searchMatch = 
        searchQuery === '' ||
        etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'all' || etf.canaryStatus === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [etfs, searchQuery, statusFilter]);

  const handleUpgrade = () => {
    // In production, this would redirect to Stripe
    setIsPaid(true);
    setIsUpgradeModalOpen(false);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading ETF data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading ETFs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        isPaid={isPaid}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUpgrade={() => setIsUpgradeModalOpen(true)}
      />

      <main className="container px-4 md:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Which ETFs are healthy vs quietly dying?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See through the marketing. Know exactly what lands in your pocket after taxes.
          </p>
          {/* Demo Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setIsPaid(!isPaid)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary border border-border hover:bg-muted transition-colors"
            >
              <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-foreground' : 'bg-muted-foreground'}`} />
              Demo: {isPaid ? 'Pro View' : 'Free View'}
            </button>
          </div>
        </div>

        {/* Killer Stats */}
        <KillerStats etfs={filteredETFs} />

        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        {/* ETF Table */}
        <ETFTable
          etfs={filteredETFs}
          isPaid={isPaid}
          onUpgrade={() => setIsUpgradeModalOpen(true)}
        />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Data updated daily. ROC data from 19a-1 filings.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2024 YieldCanary. Not financial advice.
          </p>
        </footer>
      </main>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
