# Vercel Serverless Integration Summary

## What Changed

### 1. **Serverless Architecture** ✅
- Removed `server.ts` (Express backend)
- Created Vercel serverless functions in `/api` directory
  - `api/create-checkout-session.ts` - Handles Stripe checkout
  - `api/webhooks/stripe.ts` - Handles Stripe webhook events

### 2. **Supabase Integration for Payments** ✅
- Updated `useUserSubscription.ts` hook to fetch paid/free status from users table
- Integrated Supabase client in API routes for user updates
- Users table already has columns for tracking:
  - `is_paid` (boolean) - Active subscription status
  - `subscription_tier` (string) - 'free', 'basic', 'advanced'
  - `subscription_start` (date)
  - `subscription_end` (date)

### 3. **New Database Columns** ✅
- Migration created: `20251206_add_stripe_columns.sql`
  - `stripe_customer_id` - Link to Stripe customer
  - `last_payment_date` - Timestamp of last payment
  - `trial_ends_at` - Trial expiry date

### 4. **Dashboard Updates** ✅
- `Dashboard.tsx` now uses `useUserSubscription()` hook
- Replaces hardcoded `isPaid` state with real user data
- Automatically reflects paid/free status from Supabase

### 5. **Webhook Handler** ✅
- Listens for Stripe events:
  - `customer.subscription.created/updated` → Sets `is_paid=true`
  - `customer.subscription.deleted` → Sets `is_paid=false`
  - `invoice.payment_succeeded` → Records payment
  - `invoice.payment_failed` → Logs failure
- Automatically updates user subscription status in Supabase

### 6. **Configuration Files** ✅
- `vercel.json` - Configures serverless runtime and CORS headers
- `.env.example` - Documents all required env variables
- `VERCEL_DEPLOYMENT.md` - Complete deployment guide

### 7. **Package Updates** ✅
- Added `@vercel/node@3.0.5` (dev dependency)
- Removed Express, CORS, dotenv (not needed for serverless)
- Kept Stripe.js dependency

## File Structure

```
project/
├── api/
│   ├── create-checkout-session.ts    (NEW)
│   └── webhooks/
│       └── stripe.ts                 (NEW)
├── src/
│   ├── hooks/
│   │   ├── useETFs.ts               (existing)
│   │   └── useUserSubscription.ts    (NEW)
│   └── components/
│       └── dashboard/
│           └── Dashboard.tsx         (UPDATED)
├── supabase/
│   └── migrations/
│       ├── 20251204141020_...sql    (existing)
│       └── 20251206_add_stripe_columns.sql (NEW)
├── .env.local                        (UPDATED with SUPABASE_SERVICE_ROLE_KEY)
├── .env.example                      (NEW)
├── vercel.json                       (NEW)
├── VERCEL_DEPLOYMENT.md             (NEW)
└── package.json                      (UPDATED - removed server deps)
```

## How It Works

### Checkout Flow
1. User clicks "Upgrade" → `Landing.tsx`
2. Calls `redirectToCheckout(plan)` → `src/integrations/stripe/checkout.ts`
3. POSTs to `/api/create-checkout-session` (Vercel serverless)
4. Function creates Stripe checkout session
5. User redirected to Stripe checkout
6. User completes payment

### Webhook Flow
1. Stripe sends event to `https://your-domain.vercel.app/api/webhooks/stripe`
2. Vercel serverless function receives event
3. Validates Stripe signature
4. Updates user record in Supabase:
   - `is_paid = true`
   - `subscription_tier = 'basic'` or `'advanced'`
   - `subscription_start/end` dates
5. Dashboard automatically reflects new status

### User Status Tracking
- `useUserSubscription()` hook checks Supabase `users` table
- Returns `user.is_paid` boolean
- Dashboard uses this to:
  - Show/hide premium features
  - Render upgrade modal
  - Blur/unblur ETF data

## Deployment to Vercel

### Prerequisites
1. Vercel account and project linked to GitHub
2. Supabase project with schema migrations applied
3. Stripe Live account with products and webhook configured

### Environment Variables in Vercel
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
SUPABASE_SERVICE_ROLE_KEY           ← Important for backend API
VITE_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY                    ← Important for backend API
STRIPE_WEBHOOK_SECRET
VITE_BASIC_MONTHLY_PRICE
VITE_BASIC_YEARLY_PRICE
VITE_ADVANCED_MONTHLY_PRICE
VITE_ADVANCED_YEARLY_PRICE
```

### Deploy Steps
1. Push code to GitHub
2. Vercel auto-deploys
3. Add environment variables in Vercel dashboard
4. Add webhook in Stripe → use deployed URL

## Testing Locally

```bash
# Install deps
npm install

# Start dev server
npm run dev

# For webhook testing with Stripe CLI
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

Use Stripe test card: **4242 4242 4242 4242**

## Next Steps

1. **Get Supabase Service Role Key**
   - Supabase Dashboard > Settings > API > Service role secret
   - Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=...`

2. **Deploy to Vercel**
   ```bash
   npm install
   git add .
   git commit -m "Add Vercel serverless payment integration"
   git push
   ```

3. **Configure Vercel Environment**
   - Add all env variables from `.env.example`
   - Webhook URL: `https://your-domain.vercel.app/api/webhooks/stripe`

4. **Test Payment Flow**
   - Go to Landing page
   - Click "Upgrade Basic" or "Upgrade Advanced"
   - Use test card in checkout
   - Verify Supabase user record updated with `is_paid=true`

5. **Monitor**
   - Vercel Logs > API logs
   - Stripe Dashboard > Webhooks > Events
   - Supabase > Data browser > users table

## Status

✅ **Complete**
- Vercel serverless functions created
- Supabase integration for user tracking
- Webhook handler for automatic updates
- Dashboard connected to real user data
- Documentation complete

⏳ **Ready for Your Supabase Service Key**
- Need Service Role Key from Supabase
- Add to `.env.local` for local testing
- Add to Vercel for production

🎯 **Ready to Deploy**
- Push to GitHub
- Vercel auto-deploys
- Add environment variables
- Configure Stripe webhook
- Test with Stripe test cards
