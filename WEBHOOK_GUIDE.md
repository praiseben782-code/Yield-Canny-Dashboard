# Webhook Event Handling Guide

## Stripe Webhook Events

The webhook handler in `/api/webhooks/stripe.ts` listens for the following Stripe events:

### 1. `customer.subscription.created`
**When:** User completes their first subscription

**Action:**
```typescript
// Updates users table:
{
  is_paid: true,
  subscription_tier: 'basic' | 'advanced' (based on price ID),
  stripe_customer_id: 'cus_...',
  subscription_start: date,
  subscription_end: date,
  updated_at: now()
}
```

**Dashboard Effect:** User immediately gets access to premium features

---

### 2. `customer.subscription.updated`
**When:** User changes plan, renews subscription, updates payment method

**Action:** Same as `customer.subscription.created` - updates all subscription fields

**Dashboard Effect:** Reflects new plan tier and dates immediately

---

### 3. `customer.subscription.deleted`
**When:** User cancels subscription or subscription expires

**Action:**
```typescript
// Updates users table:
{
  is_paid: false,
  subscription_tier: 'free',
  updated_at: now()
  // subscription_start/end dates NOT cleared (for records)
}
```

**Dashboard Effect:** Premium features become blurred/inaccessible

---

### 4. `invoice.payment_succeeded`
**When:** Automatic payment processed successfully (monthly/yearly renewal)

**Action:**
```typescript
// Updates users table:
{
  last_payment_date: now()
}
```

**Dashboard Effect:** No change (user stays paid)

---

### 5. `invoice.payment_failed`
**When:** Payment fails (card declined, insufficient funds, etc.)

**Action:**
- Logs event to console
- No database update (subscription still active during grace period)

**Dashboard Effect:** User stays paid during grace period (Stripe handles retry)

---

## Event Flow Diagram

```
Customer subscribes with Stripe
           ↓
Stripe sends "customer.subscription.created" webhook
           ↓
/api/webhooks/stripe receives event
           ↓
Validates webhook signature
           ↓
Extracts: email, subscription_tier, dates, customer_id
           ↓
Updates Supabase users table
           ↓
Dashboard detects user.is_paid = true
           ↓
Premium features unlocked for user
```

---

## Testing Webhooks Locally

### With Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Authenticate:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

4. Get webhook signing secret:
```bash
# Stripe CLI outputs: "whsec_..." 
# Add to .env.local as STRIPE_WEBHOOK_SECRET
```

5. Create test events:
```bash
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

### Without Stripe CLI

1. Use Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint: `http://localhost:5173/api/webhooks/stripe` (won't work without tunnel)
3. Or use ngrok to create tunnel:
```bash
ngrok http 5173
# Then create webhook with ngrok URL
```

---

## Webhook Verification

The webhook handler verifies each request using Stripe's signature:

```typescript
stripe.webhooks.constructEvent(
  request.body,
  request.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
)
```

This ensures:
- ✅ Request came from Stripe (not spoofed)
- ✅ Request hasn't been modified
- ✅ Timestamp is within 5 minutes (prevents replays)

**If signature is invalid:** Webhook returns `400 Bad Request`

---

## Debugging Webhook Issues

### Check Stripe Dashboard
1. Go to Developers → Webhooks
2. Click your endpoint
3. See "Recent deliveries"
4. Click each event to see:
   - Status (200 = success, 4xx = error)
   - Request body
   - Response body
   - Timestamp

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click "Functions" tab
3. Select `api/webhooks/stripe.ts`
4. See real-time logs of webhook processing

### Check Supabase
1. Go to Supabase Dashboard
2. Data browser → users table
3. Verify user record was updated:
   - `is_paid` should be `true/false`
   - `subscription_tier` should be updated
   - `updated_at` should be recent

---

## Webhook Retry Logic

Stripe automatically retries failed webhooks:
- 1st attempt: immediately
- 2nd attempt: 5 seconds later
- 3rd attempt: 5 minutes later
- 4th attempt: 30 minutes later
- 5th attempt: 2 hours later
- Continues for up to 3 days

This means even if your API is temporarily down, Stripe will retry.

---

## Event IDs & Idempotency

Each webhook event has unique `event.id`. To prevent processing the same event twice:

```typescript
// Store processed event IDs in database:
const processedEvents = supabase
  .from('webhook_events')
  .select('stripe_event_id')
  .eq('stripe_event_id', event.id)

if (processedEvents.length > 0) {
  // Already processed, skip
  return res.json({ received: true })
}

// Process new event...

// Record as processed
supabase.from('webhook_events').insert({
  stripe_event_id: event.id,
  event_type: event.type,
  processed_at: now()
})
```

*(Currently not implemented - would prevent duplicate processing)*

---

## Common Webhook Issues

### "Invalid signature"
- Wrong `STRIPE_WEBHOOK_SECRET`
- Secret was regenerated - use new one
- Webhook endpoint URL doesn't match

### "Request times out"
- API endpoint is slow (> 30 seconds)
- Supabase query timing out
- Network connectivity issues

### "Event not processed"
- Check browser/Vercel logs for errors
- Check Stripe webhook delivery status
- Verify signature validation succeeded

### "User not updating"
- Service role key doesn't have permissions
- Table schema changed
- Email format doesn't match
- SQL error in update query

---

## Monitoring Webhooks

### Log Processing
The webhook handler logs events:
```typescript
console.log(`Webhook event received: ${event.type}`);
console.log(`User ${email} subscription updated: ${tier}`);
```

Check Vercel logs to see real-time processing.

### Create Webhook Events Table
Optional: Store webhook events for audit trail
```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(100),
  user_email VARCHAR(255),
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Event Handlers

### Currently Implemented ✅
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### Could Add Later 🔄
- `customer.updated` - Customer info changed
- `invoice.finalized` - Invoice ready
- `charge.refunded` - Refund processed
- `charge.dispute.created` - Chargeback filed
- `trial_will_end` - Send reminder email

---

## Summary

The webhook system:
1. ✅ Receives real-time Stripe events
2. ✅ Validates signature (security)
3. ✅ Updates user subscription in Supabase
4. ✅ Triggers dashboard updates automatically
5. ✅ Handles retries automatically
6. ✅ Logs errors for debugging

Your dashboard stays in sync with Stripe automatically! 🎯
