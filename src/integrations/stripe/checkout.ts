import { stripePromise } from './client';

export type PricingPlan = 'basic_monthly' | 'basic_yearly' | 'advanced_monthly' | 'advanced_yearly';

const PRICE_IDS: Record<PricingPlan, string> = {
  basic_monthly: import.meta.env.VITE_BASIC_MONTHLY_PRICE || '',
  basic_yearly: import.meta.env.VITE_BASIC_YEARLY_PRICE || '',
  advanced_monthly: import.meta.env.VITE_ADVANCED_MONTHLY_PRICE || '',
  advanced_yearly: import.meta.env.VITE_ADVANCED_YEARLY_PRICE || '',
};

export async function redirectToCheckout(plan: PricingPlan, email?: string) {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const priceId = PRICE_IDS[plan];
    
    if (!priceId) {
      throw new Error(`Price ID not found for plan: ${plan}. Please check your environment variables.`);
    }

    // Call the API endpoint to create checkout session
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

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    if (!sessionId) {
      throw new Error('No session ID returned from server');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw error;
    }
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
