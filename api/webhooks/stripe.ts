import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover' 
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

// Map Stripe price IDs to subscription tiers
const priceToTierMap: Record<string, string> = {
  [process.env.VITE_BASIC_MONTHLY_PRICE || '']: 'basic',
  [process.env.VITE_BASIC_YEARLY_PRICE || '']: 'basic',
  [process.env.VITE_ADVANCED_MONTHLY_PRICE || '']: 'advanced',
  [process.env.VITE_ADVANCED_YEARLY_PRICE || '']: 'advanced',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    console.log(`Webhook event received: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const email = subscription.customer_email;
        const stripeCustomerId = subscription.customer as string;

        if (email) {
          // Get the price ID from the subscription
          const priceId = subscription.items.data[0]?.price?.id;
          const tier = priceId ? priceToTierMap[priceId] : 'basic';

          // Update user's subscription status in Supabase
          const { error: updateError } = await supabase
            .from('users')
            .update({
              is_paid: true,
              subscription_tier: tier,
              stripe_customer_id: stripeCustomerId,
              subscription_start: new Date(subscription.current_period_start * 1000).toISOString().split('T')[0],
              subscription_end: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
              updated_at: new Date().toISOString(),
            })
            .eq('email', email);

          if (updateError) {
            console.error('Error updating user subscription:', updateError);
          } else {
            console.log(`User ${email} subscription updated: ${tier}`);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const email = subscription.customer_email;

        if (email) {
          // Mark user as unpaid
          const { error: updateError } = await supabase
            .from('users')
            .update({
              is_paid: false,
              subscription_tier: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('email', email);

          if (updateError) {
            console.error('Error cancelling user subscription:', updateError);
          } else {
            console.log(`User ${email} subscription cancelled`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email;
        console.log(`Payment failed for ${email}, invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).json({ error: 'Webhook error' });
  }
}
