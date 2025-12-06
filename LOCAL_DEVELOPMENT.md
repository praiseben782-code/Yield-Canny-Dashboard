# Local Development & Testing

## Running Locally

```bash
npm run dev
```

The app runs on `http://localhost:5173`

## Features

### Authentication
- Email/password signup and login
- Supabase Auth integration
- Users are created in the `users` table automatically on signup

### Dashboard
- View all ETF data from Supabase
- Filter by status (Healthy/Dying/Dead)
- Search by ticker or name
- Data fetched from real Supabase database

### Stripe Integration

#### For Local Testing:
- Click "Upgrade" or pricing buttons
- A test mode message will appear showing what would happen in production
- **No actual charges** in local development

#### For Live Testing (After Deployment to Vercel):
1. Deploy to Vercel
2. Set Stripe webhook: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Test with Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Expiry: Any future date
   - CVC: Any 3 digits

### User Subscription Status

Users are automatically tracked in the `users` table:
- `is_paid` (boolean) - Active subscription
- `subscription_tier` (string) - 'free', 'basic', or 'advanced'
- `subscription_start` (date)
- `subscription_end` (date)
- `stripe_customer_id` (string)

The Dashboard automatically shows/hides paid features based on subscription status.

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_BASIC_MONTHLY_PRICE=price_...
VITE_BASIC_YEARLY_PRICE=price_...
VITE_ADVANCED_MONTHLY_PRICE=price_...
VITE_ADVANCED_YEARLY_PRICE=price_...
```

## Seeding Data

Import CSV to Supabase:
```bash
npm run seed:csv
```

## Deployment

Ready to deploy to Vercel. The `/api` directory contains serverless functions that will be automatically deployed.

See `VERCEL_DEPLOYMENT.md` for full deployment instructions.
