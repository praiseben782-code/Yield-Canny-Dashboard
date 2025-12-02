import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Crown className="h-8 w-8 text-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            Unlock YieldCanary Pro
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            See the full picture. Make smarter income decisions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-secondary border border-border flex items-center justify-center">
                  <Check className="h-3 w-3 text-foreground" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              or $149/year (save 35%)
            </p>
          </div>

          <Button 
            onClick={onUpgrade}
            className="w-full h-12 text-lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Upgrade Now
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
