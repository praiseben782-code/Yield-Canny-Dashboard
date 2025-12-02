import { useState, useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { KillerStats } from './KillerStats';
import { ETFTable } from './ETFTable';
import { FilterBar } from './FilterBar';
import { UpgradeModal } from './UpgradeModal';
import { mockETFs } from '@/data/mockETFs';
import { CanaryStatus } from '@/types/etf';

export function Dashboard() {
  const [isPaid, setIsPaid] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CanaryStatus | 'all'>('all');
  const [issuerFilter, setIssuerFilter] = useState('all');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Get unique issuers
  const issuers = useMemo(() => {
    const uniqueIssuers = [...new Set(mockETFs.map((etf) => etf.issuer))];
    return uniqueIssuers.sort();
  }, []);

  // Filter ETFs
  const filteredETFs = useMemo(() => {
    return mockETFs.filter((etf) => {
      // Search filter
      const searchMatch = 
        searchQuery === '' ||
        etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const statusMatch = statusFilter === 'all' || etf.canaryStatus === statusFilter;

      // Issuer filter
      const issuerMatch = issuerFilter === 'all' || etf.issuer === issuerFilter;

      return searchMatch && statusMatch && issuerMatch;
    });
  }, [searchQuery, statusFilter, issuerFilter]);

  const handleUpgrade = () => {
    // In production, this would redirect to Stripe
    setIsPaid(true);
    setIsUpgradeModalOpen(false);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setIssuerFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <DashboardHeader
        isPaid={isPaid}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUpgrade={() => setIsUpgradeModalOpen(true)}
      />

      <main className="container px-4 md:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Which ETFs are <span className="text-canary-green">healthy</span> vs{' '}
            <span className="text-canary-red">quietly dying</span>?
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See through the marketing. Know exactly what lands in your pocket after taxes.
          </p>
          {/* Demo Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setIsPaid(!isPaid)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors"
            >
              <div className={`h-2 w-2 rounded-full ${isPaid ? 'bg-canary-green' : 'bg-muted-foreground'}`} />
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
          issuerFilter={issuerFilter}
          onIssuerFilterChange={setIssuerFilter}
          issuers={issuers}
          onClearFilters={handleClearFilters}
        />

        {/* ETF Table */}
        <ETFTable
          etfs={filteredETFs}
          isPaid={isPaid}
          onUpgrade={() => setIsUpgradeModalOpen(true)}
        />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
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
