import { Bird, Crown, Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  isPaid: boolean;
  userEmail?: string;
  onUpgrade: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DashboardHeader({
  isPaid,
  userEmail = 'user@example.com',
  onUpgrade,
  searchQuery,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bird className="h-8 w-8 text-primary animate-pulse-slow" />
            <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gradient-gold">
              YieldCanary
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1">
              Income ETF Health Monitor
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ETFs by ticker or name..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isPaid && (
            <Button
              onClick={onUpgrade}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground font-semibold glow-gold"
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </Button>
          )}

          {isPaid && (
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarFallback className="bg-secondary text-foreground">
                    {userEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">
                  {isPaid ? 'Pro Member' : 'Free Tier'}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ETFs..."
            className="pl-10 bg-secondary/50 border-border/50"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
