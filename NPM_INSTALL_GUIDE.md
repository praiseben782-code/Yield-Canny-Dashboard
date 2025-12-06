# Installation & NPM Registry Fix

## Current Status

You have a complete Vercel serverless implementation with:
- ✅ Serverless functions (`/api` directory)
- ✅ Supabase integration for user tracking
- ✅ Stripe webhook handler
- ✅ Dashboard connected to real user data
- ✅ All configuration files
- ⚠️ npm registry auth issue (temporary)

## Fixing NPM Registry Issue

The npm registry is currently blocking @stripe/js installation. Try these solutions:

### Solution 1: Clear npm cache & authenticate
```bash
# Clear cache
npm cache clean --force

# Delete package-lock.json and node_modules
rm -r node_modules
rm package-lock.json

# Try install again
npm install
```

### Solution 2: Use yarn instead of npm
```bash
# Install yarn if you don't have it
npm install -g yarn

# Clear cache
yarn cache clean

# Install from scratch
yarn install
```

### Solution 3: Delete .npmrc if it exists
```bash
# Check if problematic .npmrc file exists
cat ~/.npmrc

# If it has authentication issues, delete it
rm ~/.npmrc

# Then try npm install again
npm install
```

### Solution 4: Use different npm registry
```bash
npm config set registry https://registry.yarnpkg.com/
npm install

# Or revert
npm config set registry https://registry.npmjs.org/
```

### Solution 5: Use bun (already in project)
If you have bun installed globally:
```bash
# Install with bun
bun install
bun run dev
```

---

## After Fixing npm

Once `npm install` succeeds:

```bash
# Verify @stripe/js is installed
npm list @stripe/js

# Start dev server
npm run dev

# Should see Vite server running at http://localhost:5173
```

---

## Complete Setup Checklist

After npm install succeeds:

1. **Add Supabase Service Role Key**
   - Get from: Supabase Dashboard > Settings > API
   - Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=...`

2. **Test Locally**
   ```bash
   npm run dev
   # Open http://localhost:5173
   # Click Upgrade → Stripe test card: 4242 4242 4242 4242
   # Check Supabase: User should have is_paid=true
   ```

3. **Deploy to Vercel**
   ```bash
   # Commit changes
   git add .
   git commit -m "Add Vercel serverless payment integration"
   git push
   
   # Vercel auto-deploys
   ```

4. **Configure in Vercel**
   - Add environment variables from `.env.local`
   - Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel dashboard

5. **Configure Stripe Webhook**
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Copy webhook secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

6. **Test Payment Flow**
   - Website loads
   - Click Upgrade → Stripe checkout
   - Use test card, complete checkout
   - Check Supabase: `is_paid` should be `true`
   - Dashboard shows full data

---

## What's Installed

When `npm install` completes successfully, you'll have:

**Frontend Dependencies:**
- React 18.3.1
- TypeScript 5.8.3
- Tailwind CSS 3.4.17
- shadcn/ui components
- @stripe/js 3.4.0 ← needed for Stripe checkout
- @supabase/supabase-js 2.86.1
- React Router, Vite, etc.

**Dev Dependencies:**
- @vercel/node 3.0.5 ← for serverless functions
- Vite 5.4.19
- ESLint, TypeScript compiler
- Tailwind, Postcss

---

## Troubleshooting

### "@stripe/js not found"
- Run `npm install` again
- Clear node_modules: `rm -r node_modules` then `npm install`
- Try yarn instead: `yarn install`

### npm permission errors
- Don't use `sudo`
- Check node/npm versions: `node --version && npm --version`
- Should be: Node 18+ and npm 9+

### Still stuck on registry issue?
- Try: `npm config set registry https://registry.npmjs.org/ --global`
- Or use yarn (comes with most npm installations)

---

## Files Modified/Created

### New Files ✅
```
api/
├── create-checkout-session.ts
└── webhooks/
    └── stripe.ts
src/
└── hooks/
    └── useUserSubscription.ts
supabase/
└── migrations/
    └── 20251206_add_stripe_columns.sql
vercel.json
.env.example
QUICK_START.md
VERCEL_DEPLOYMENT.md
STRIPE_INTEGRATION_SUMMARY.md
WEBHOOK_GUIDE.md
DEPLOYMENT_CHECKLIST.md
```

### Modified Files ✅
```
package.json (added @stripe/js, @vercel/node)
.env.local (added SUPABASE_SERVICE_ROLE_KEY)
src/components/dashboard/Dashboard.tsx (useUserSubscription hook)
```

### Deleted Files ✅
```
server.ts (replaced with Vercel serverless)
```

---

## Ready for Deployment

Once npm install works, you're ready to:
1. ✅ Test locally
2. ✅ Deploy to Vercel
3. ✅ Test Stripe payments
4. ✅ Monitor webhook events
5. ✅ Track paid users in Supabase

---

## Next: After npm Install Works

```bash
# 1. Get Supabase Service Role Key
# Add to .env.local

# 2. Test locally
npm run dev

# 3. Deploy
git push

# 4. Add env variables in Vercel dashboard

# 5. Configure Stripe webhook

# 6. Test full payment flow
```

---

**Need help?** Check the error logs and:
- Browser console (Frontend errors)
- Vercel logs > Functions (Backend errors)
- Stripe dashboard > Logs (Stripe events)
- Supabase logs (Database errors)
