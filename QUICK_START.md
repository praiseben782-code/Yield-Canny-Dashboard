# Quick Start: Vercel Serverless + Stripe Integration

## ⚡ 3-Step Setup

### Step 1: Get Supabase Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project → Settings → API
3. Copy **Service role** secret key
4. Add to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### Step 2: Test Locally
```bash
npm install
npm run dev
```
- Open `http://localhost:5173`
- Click "Upgrade" → Use Stripe test card: **4242 4242 4242 4242**
- Check Supabase: user should have `is_paid=true`

### Step 3: Deploy to Vercel
```bash
git add .
git commit -m "Add serverless payment integration"
git push
```

Then in Vercel Dashboard:
1. Add environment variables from `.env.local` (except SUPABASE_SERVICE_ROLE_KEY is `SUPABASE_SERVICE_ROLE_KEY` in Vercel)
2. In Stripe → Webhooks → Add Endpoint
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Events: `customer.subscription.*`, `invoice.payment_*`

---

## 📋 What's New

✅ **Vercel Serverless Functions**
- `/api/create-checkout-session.ts` - Stripe checkout
- `/api/webhooks/stripe.ts` - Payment updates

✅ **Supabase Integration**
- Users tracked with `is_paid` boolean
- Auto-update on Stripe events
- `useUserSubscription()` hook for components

✅ **Dashboard Connected**
- Real user subscription status
- Automatic premium/free mode
- No more hardcoded `isPaid`

---

## 🧪 Testing Stripe

**Test Cards:**
- ✅ `4242 4242 4242 4242` - Success
- ❌ `4000 0000 0000 0002` - Declined
- Any future date + any CVC

**Test Subscription:**
1. Click "Upgrade Basic" ($9/mo)
2. Enter test card
3. Complete checkout
4. Check Supabase: `users` table → `is_paid=true`, `subscription_tier=basic`
5. Dashboard shows full data (no blur)

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `api/create-checkout-session.ts` | Create Stripe checkout session |
| `api/webhooks/stripe.ts` | Handle Stripe events, update Supabase |
| `src/hooks/useUserSubscription.ts` | Get user's paid status |
| `src/components/dashboard/Dashboard.tsx` | Use real subscription data |
| `vercel.json` | Vercel configuration |
| `VERCEL_DEPLOYMENT.md` | Full deployment guide |
| `.env.example` | Environment variable reference |

---

## ✋ Common Issues

**"Checkout failed"**
→ Check browser console, ensure Stripe keys are set

**Webhook not firing**
→ Verify webhook secret in Vercel env variables

**User not updating to paid**
→ Check Supabase service role key has table access

**"Invalid price ID"**
→ Verify `VITE_BASIC_MONTHLY_PRICE` etc. are set

---

## 🎯 Next Steps

1. Add Supabase Service Role Key
2. Test locally with Stripe test card
3. Deploy to Vercel
4. Verify webhook in Stripe dashboard
5. Test with real Stripe account

---

Need help? Check:
- `VERCEL_DEPLOYMENT.md` - Full deployment guide
- `STRIPE_INTEGRATION_SUMMARY.md` - Architecture overview
- Browser console - Frontend errors
- Vercel logs - Backend errors
- Stripe dashboard - Webhook events
