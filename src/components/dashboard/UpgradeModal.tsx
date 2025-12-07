import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';
import { useState } from 'react';
import { redirectToCheckout } from '@/integrations/stripe/checkout';
import { supabase } from '@/integrations/supabase/client';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const features = [
  'Full access to all ETF metrics',
  'Death Clock & True Income Yield for all ETFs',
  'Take-Home Cash Returns (after-tax)',
  'Personal watchlist with alerts',
  'CSV export functionality',
  'Tax rate customization',
  'Priority email support',
];

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = async () => {
    try {
      setLoading(true);
      
      // Get current user email
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (!email) {
        alert('Unable to find user email. Please sign in again.');
        onClose();
        return;
      }

      // Redirect to Stripe checkout for Advanced Monthly plan
      await redirectToCheckout('advanced_monthly', email);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto p-4 xs:p-6">
        <DialogHeader>
          <div className="flex items-center justify-center mb-3 xs:mb-4">
            <div className="h-12 xs:h-16 w-12 xs:w-16 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 xs:h-8 w-6 xs:w-8 text-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl xs:text-2xl font-bold">
            Unlock YieldCanary Pro
          </DialogTitle>
          <DialogDescription className="text-center text-xs xs:text-sm text-muted-foreground">
            See the full picture. Make smarter income decisions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 xs:space-y-4 py-3 xs:py-4">
          <ul className="space-y-2 xs:space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 xs:gap-3">
                <div className="h-4 xs:h-5 w-4 xs:w-5 rounded-full bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-2.5 xs:h-3 w-2.5 xs:w-3 text-foreground" />
                </div>
                <span className="text-xs xs:text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 xs:space-y-3">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl xs:text-4xl font-bold text-foreground">$19</span>
              <span className="text-xs xs:text-sm text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 xs:mt-1">
              or $149/year (save 35%)
            </p>
          </div>

          <Button 
            onClick={handleUpgradeClick}
            disabled={loading}
            className="w-full h-9 xs:h-10 sm:h-12 text-xs xs:text-sm sm:text-base gap-1.5 xs:gap-2"
          >
            <Zap className="h-4 xs:h-5 w-4 xs:w-5 flex-shrink-0" />
            {loading ? 'Processing...' : 'Upgrade Now'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
