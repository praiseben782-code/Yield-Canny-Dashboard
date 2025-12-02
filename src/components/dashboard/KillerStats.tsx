import { Skull, Heart, AlertTriangle, TrendingUp, Banknote } from 'lucide-react';
import { ETF } from '@/types/etf';

interface KillerStatsProps {
  etfs: ETF[];
}

export function KillerStats({ etfs }: KillerStatsProps) {
  const healthyCount = etfs.filter((e) => e.canaryStatus === 'Healthy').length;
  const dyingCount = etfs.filter((e) => e.canaryStatus === 'Dying').length;
  const deadCount = etfs.filter((e) => e.canaryStatus === 'Dead').length;
  
  const avgTrueYield = etfs.reduce((sum, e) => sum + e.trueIncomeYield, 0) / etfs.length;
  const avgTakeHome = etfs.reduce((sum, e) => sum + e.takeHomeCashReturn1Y, 0) / etfs.length;

  const stats = [
    {
      label: 'Healthy ETFs',
      value: healthyCount,
      icon: Heart,
    },
    {
      label: 'Dying ETFs',
      value: dyingCount,
      icon: AlertTriangle,
    },
    {
      label: 'Dead ETFs',
      value: deadCount,
      icon: Skull,
    },
    {
      label: 'Avg True Yield',
      value: `${(avgTrueYield * 100).toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      label: 'Avg Take-Home',
      value: `${(avgTakeHome * 100).toFixed(1)}%`,
      icon: Banknote,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-background p-4 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl md:text-3xl font-bold font-mono mt-1 text-foreground">
                {stat.value}
              </p>
            </div>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}
