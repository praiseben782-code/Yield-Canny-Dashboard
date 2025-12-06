# Vercel Serverless Deployment Setup

This guide covers deploying the Yield Canary Dashboard with Vercel serverless functions.

## Architecture

- **Frontend**: Vite + React (deployed to Vercel)
- **Backend**: Serverless functions in `/api` directory (Node.js runtime)
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe subscriptions

## Deployment Steps

### 1. Add Supabase Service Role Key

You need a **Service Role Key** for backend API operations. Get it from:
- Supabase Dashboard > Settings > API

Add to Vercel environment variables:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Configure Stripe Webhook

Set up webhook in Stripe Dashboard:
- **Endpoint URL**: `https://your-domain.vercel.app/api/webhooks/stripe`
- **Events to listen**: 
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

The webhook secret goes in Vercel as `STRIPE_WEBHOOK_SECRET`

### 3. Update Supabase Database

Apply the migration to add Stripe tracking columns:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
```

### 4. All Required Environment Variables

Set these in Vercel > Settings > Environment Variables:

```
# Supabase (Frontend + Backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
VITE_SUPABASE_PROJECT_ID=your_project_id

# Supabase Service Role (Backend only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe Live Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
VITE_BASIC_MONTHLY_PRICE=price_...
VITE_BASIC_YEARLY_PRICE=price_...
VITE_ADVANCED_MONTHLY_PRICE=price_...
VITE_ADVANCED_YEARLY_PRICE=price_...
```

## API Endpoints

### POST `/api/create-checkout-session`
Creates a Stripe checkout session for subscription.

**Request:**
```json
{
  "priceId": "basic_monthly",
  "email": "user@example.com",
  "successUrl": "https://domain.com/dashboard",
  "cancelUrl": "https://domain.com/"
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/webhooks/stripe`
Handles Stripe webhook events. Automatically updates user subscription status in Supabase.

**Handles:**
- `customer.subscription.created/updated` - Sets `is_paid=true`, `subscription_tier`
- `customer.subscription.deleted` - Sets `is_paid=false`, `subscription_tier=free`
- `invoice.payment_succeeded` - Records payment
- `invoice.payment_failed` - Logs failure

## Testing Locally

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in values

3. Start development server:
```bash
npm run dev
```

4. For webhook testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

5. Test with Stripe test cards:
- **4242 4242 4242 4242** - Success
- **4000 0000 0000 0002** - Card declined
- Any future date for expiry
- Any 3-digit CVC

## Subscription Tiers

Users are tracked with these fields in the `users` table:

- **is_paid** (boolean) - Whether they have an active subscription
- **subscription_tier** (string) - 'free', 'basic', or 'advanced'
- **subscription_start** (date) - When subscription started
- **subscription_end** (date) - When subscription ends/renews
- **stripe_customer_id** (string) - Stripe customer ID for API calls

## Paid Feature Access

The Dashboard checks `user.is_paid`:
- Free users: Limited data visibility (blurred cells)
- Paid users: Full access to all ETF data

Use the `useUserSubscription()` hook to access user data:
```typescript
const { user, loading, error } = useUserSubscription();
console.log(user?.is_paid); // true or false
console.log(user?.subscription_tier); // 'basic' or 'advanced'
```

## Troubleshooting

### Webhook not updating user status
1. Check Stripe webhook logs in dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check Supabase service role key has table permissions
4. Look at Vercel function logs for errors

### User not created on checkout
1. Verify Supabase service role key
2. Check that `users` table exists and is accessible
3. Review API logs for SQL errors

### Checkout button not working
1. Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set
2. Confirm price IDs (`VITE_BASIC_MONTHLY_PRICE`, etc.) are valid
3. Check browser console for errors

## Next Steps

1. Deploy to Vercel: `vercel` or push to GitHub
2. Configure environment variables in Vercel dashboard
3. Set up Stripe webhook pointing to your deployed domain
4. Test full payment flow with Stripe test cards
5. Monitor subscription status in Supabase for paid users
