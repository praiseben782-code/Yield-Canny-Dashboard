import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  import.meta.env.STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is missing');
}

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
