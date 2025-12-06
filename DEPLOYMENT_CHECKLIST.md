# Deployment Checklist

## Pre-Deployment ✅

- [x] Vercel serverless functions created (`/api` directory)
- [x] Supabase integration for user tracking
- [x] Stripe webhook handler implemented
- [x] Dashboard connected to real user subscription data
- [x] Package.json updated (added @vercel/node, removed Express)
- [x] Environment variables documented

## Local Testing Checklist

Before deploying, test locally:

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Access dashboard: http://localhost:5173
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- [ ] Click "Upgrade" button → opens Stripe checkout
- [ ] Enter Stripe test card: `4242 4242 4242 4242`
- [ ] Complete checkout successfully
- [ ] Check Supabase: Users table shows `is_paid=true`
- [ ] Dashboard shows full data (no blur for paid user)
- [ ] Logout and login → still shows paid status

## Vercel Deployment Checklist

### Prerequisites
- [ ] GitHub repo created with all code
- [ ] Vercel account linked to GitHub
- [ ] Supabase project set up with migrations applied
- [ ] Stripe Live account ready with products created

### Environment Variables in Vercel
Add these in Vercel Dashboard > Settings > Environment Variables:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ← From Supabase Settings
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` ← From Stripe
- [ ] `STRIPE_SECRET_KEY` ← From Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` ← From Stripe
- [ ] `VITE_BASIC_MONTHLY_PRICE` ← Price ID from Stripe
- [ ] `VITE_BASIC_YEARLY_PRICE` ← Price ID from Stripe
- [ ] `VITE_ADVANCED_MONTHLY_PRICE` ← Price ID from Stripe
- [ ] `VITE_ADVANCED_YEARLY_PRICE` ← Price ID from Stripe

### Stripe Configuration
- [ ] Create webhook endpoint in Stripe Dashboard
  - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
  - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- [ ] Copy webhook signing secret
- [ ] Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Supabase Database
- [ ] Apply migration: `20251206_add_stripe_columns.sql`
  - Adds: `stripe_customer_id`, `last_payment_date`, `trial_ends_at`
  - Creates indexes for performance
- [ ] Verify `users` table has these columns:
  - `is_paid` (boolean)
  - `subscription_tier` (string)
  - `subscription_start` (date)
  - `subscription_end` (date)
  - `stripe_customer_id` (varchar)

### GitHub Push
- [ ] Commit all changes: `git add . && git commit -m "Add Vercel serverless payment integration"`
- [ ] Push to main: `git push`
- [ ] Vercel auto-deploys when you push

### Post-Deployment Testing
- [ ] Website loads: https://your-domain.vercel.app
- [ ] Navigate to dashboard
- [ ] Click "Upgrade" → Stripe checkout
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Check Vercel logs for errors (Functions tab)
- [ ] Check Supabase: User `is_paid` should be `true`
- [ ] Check Stripe: Webhook deliveries show successful requests
- [ ] Dashboard shows full data access
- [ ] Logout and login → status persists

## Troubleshooting Checklist

If something doesn't work:

### Checkout fails
- [ ] Check browser console for errors
- [ ] Verify `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel env
- [ ] Verify price IDs are correct (not product IDs)
- [ ] Check Vercel function logs

### Webhook not updating user
- [ ] Check Stripe Dashboard → Webhooks → Recent deliveries
- [ ] Verify webhook secret is correct
- [ ] Check Vercel function logs for errors
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` has table permissions
- [ ] Check Supabase service role in Settings → Database → Service

### User not created
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- [ ] Check Supabase users table exists
- [ ] Check Vercel function logs
- [ ] Test with `curl` to API endpoint

### Subscription status not showing
- [ ] Verify `useUserSubscription()` hook is installed
- [ ] Check browser network tab → API calls
- [ ] Verify Supabase anon key has read access to users
- [ ] Check Supabase auth session is active

## Rollback Plan

If deployment fails:

1. Go to Vercel Dashboard
2. Deployments → Find last working deployment
3. Click "Promote to Production"
4. Revert code: `git revert <commit-hash>`
5. Investigate errors in logs

## Success Criteria ✅

Your deployment is complete when:
- ✅ Website loads without errors
- ✅ User can click "Upgrade" and see Stripe checkout
- ✅ Completing Stripe test payment updates Supabase user record
- ✅ Dashboard reflects paid status immediately
- ✅ Webhook events are logged in Stripe
- ✅ Logout/login preserves subscription status
- ✅ All environment variables are in place
- ✅ No console errors in browser
- ✅ No function errors in Vercel logs

---

**Once complete:** You have a fully functional Vercel-deployed dashboard with Stripe payments and Supabase user tracking! 🚀
