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
      color: 'text-canary-green',
      bgColor: 'bg-canary-green/10',
      borderColor: 'border-canary-green/30',
    },
    {
      label: 'Dying ETFs',
      value: dyingCount,
      icon: AlertTriangle,
      color: 'text-canary-yellow',
      bgColor: 'bg-canary-yellow/10',
      borderColor: 'border-canary-yellow/30',
    },
    {
      label: 'Dead ETFs',
      value: deadCount,
      icon: Skull,
      color: 'text-canary-red',
      bgColor: 'bg-canary-red/10',
      borderColor: 'border-canary-red/30',
    },
    {
      label: 'Avg True Yield',
      value: `${(avgTrueYield * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      label: 'Avg Take-Home',
      value: `${(avgTakeHome * 100).toFixed(1)}%`,
      icon: Banknote,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            relative overflow-hidden rounded-xl border p-4
            ${stat.bgColor} ${stat.borderColor}
            animate-fade-in
          `}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-2xl md:text-3xl font-bold font-mono mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
          </div>
          <div className={`absolute -bottom-4 -right-4 h-16 w-16 rounded-full ${stat.bgColor} blur-2xl`} />
        </div>
      ))}
    </div>
  );
}
