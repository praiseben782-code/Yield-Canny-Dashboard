import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18' as any,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

// Price ID mapping
const priceIdMap: Record<string, string> = {
  basic_monthly: process.env.VITE_BASIC_MONTHLY_PRICE || '',
  basic_yearly: process.env.VITE_BASIC_YEARLY_PRICE || '',
  advanced_monthly: process.env.VITE_ADVANCED_MONTHLY_PRICE || '',
  advanced_yearly: process.env.VITE_ADVANCED_YEARLY_PRICE || '',
};

interface CheckoutRequestBody {
  priceId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, email, successUrl, cancelUrl } = req.body as CheckoutRequestBody;

    if (!priceId || !email || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required fields: priceId, email, successUrl, cancelUrl',
      });
    }

    // Ensure user exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, stripe_customer_id')
      .eq('email', email)
      .single();

    // If user doesn't exist, create them
    if (!existingUser) {
      await supabase.from('users').insert({
        email,
        name: email.split('@')[0],
        is_paid: false,
        subscription_tier: 'free',
      });
    }

    // Map plan name to price ID if needed
    const actualPriceId = Object.keys(priceIdMap).includes(priceId)
      ? priceIdMap[priceId]
      : priceId;

    if (!actualPriceId) {
      return res.status(400).json({
        error: `Invalid price ID or plan: ${priceId}`,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          user_email: email,
        },
      },
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Checkout session error:', error);

    res.setHeader('Access-Control-Allow-Origin', '*');

    if (error instanceof Stripe.errors.StripeError) {
      return res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        error: error.message,
      });
    } else {
      return res.status(500).json({
        error: 'An unknown error occurred',
      });
    }
  }
}

