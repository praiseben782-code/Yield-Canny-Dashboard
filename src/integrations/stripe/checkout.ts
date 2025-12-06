import { stripePromise } from './client';

export type PricingPlan = 'basic_monthly' | 'basic_yearly' | 'advanced_monthly' | 'advanced_yearly';

const PRICE_IDS: Record<PricingPlan, string> = {
  basic_monthly: import.meta.env.VITE_BASIC_MONTHLY_PRICE || 'price_1234567890',
  basic_yearly: import.meta.env.VITE_BASIC_YEARLY_PRICE || 'price_0987654321',
  advanced_monthly: import.meta.env.VITE_ADVANCED_MONTHLY_PRICE || 'price_abcdefghij',
  advanced_yearly: import.meta.env.VITE_ADVANCED_YEARLY_PRICE || 'price_jihgfedcba',
};

export async function redirectToCheckout(plan: PricingPlan, email?: string) {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const priceId = PRICE_IDS[plan];
    
    if (!priceId) {
      throw new Error(`Price ID not found for plan: ${plan}`);
    }

    // Try to call the API endpoint
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          email,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/`,
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
        return;
      }
    } catch (apiError) {
      console.warn('API endpoint not available, showing test mode:', apiError);
    }

    // Fallback for local development - show test mode message
    alert(
      `[LOCAL DEVELOPMENT MODE]\n\n` +
      `Plan: ${getPlanName(plan)}\n` +
      `Email: ${email}\n\n` +
      `In production, you would be redirected to Stripe checkout.\n\n` +
      `To test Stripe payments:\n` +
      `1. Deploy to Vercel\n` +
      `2. Configure Stripe webhook\n` +
      `3. Use test card: 4242 4242 4242 4242\n` +
      `4. Any future date for expiry, any 3-digit CVC`
    );
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start checkout';
    alert(`Checkout Error: ${message}`);
    throw error;
  }
}

export function getPlanName(plan: PricingPlan): string {
  switch (plan) {
    case 'basic_monthly':
      return 'Basic - Monthly';
    case 'basic_yearly':
      return 'Basic - Yearly';
    case 'advanced_monthly':
      return 'Advanced - Monthly';
    case 'advanced_yearly':
      return 'Advanced - Yearly';
    default:
      return 'Unknown Plan';
  }
}

export function getPlanPrice(plan: PricingPlan): string {
  switch (plan) {
    case 'basic_monthly':
      return '$9/month';
    case 'basic_yearly':
      return '$89/year';
    case 'advanced_monthly':
      return '$19/month';
    case 'advanced_yearly':
      return '$189/year';
    default:
      return '$0';
  }
}
