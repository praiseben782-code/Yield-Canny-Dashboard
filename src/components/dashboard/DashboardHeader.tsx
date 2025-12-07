import { Bird, Crown, Search, Bell, Settings, LogOut, ChevronLeft, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/useTheme';

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
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 md:px-6 py-3 sm:py-0">
        {/* Logo + Back Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Bird className="h-6 w-6 sm:h-8 sm:w-8 text-foreground flex-shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-base sm:text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                YieldCanary
              </span>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground -mt-0.5 hidden xs:block">
                ETF Monitor
              </span>
            </div>
          </button>
        </div>

        {/* Search - Mobile hidden, visible on larger screens */}
        <div className="hidden md:flex flex-1 max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ETFs..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          {!isPaid && (
            <Button
              onClick={onUpgrade}
              variant="outline"
              className="hidden xs:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
            >
              <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Upgrade</span>
            </Button>
          )}

          {isPaid && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border">
                  <AvatarFallback className="bg-secondary text-foreground text-xs sm:text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <div className="px-2 py-1.5">
                <p className="text-xs sm:text-sm font-medium break-words">{userEmail}</p>
                <p className="text-xs text-muted-foreground">
                  {isPaid ? 'Pro Member' : 'Free Tier'}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs sm:text-sm">
                <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-xs sm:text-sm">
                <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3 border-t border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ETFs..."
            className="pl-10 text-sm h-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
