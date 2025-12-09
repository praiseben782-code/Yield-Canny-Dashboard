# YieldCanary Dashboard

**A professional ETF analytics platform for high-yield investment intelligence**

YieldCanary helps investors see through the marketing hype of income ETFs by revealing the real numbers — Death Clock metrics, True Income Yield after ROC, and Take-Home Cash Return after taxes.

---

## 🎯 What This Platform Does

YieldCanary Dashboard is a web application that:

- **Displays 100+ income ETFs** with real-time metrics and health indicators
- **Blurs premium data** for free users, unlocking full access after payment
- **Sends automated emails** for welcome, payment confirmation, and access management
- **Processes payments** via Stripe for one-time and subscription purchases
- **Manages user accounts** with authentication, profiles, and paid status tracking

---

## 🚀 Quick Start (Non-Technical)

### What You Need

1. **A computer** with internet access
2. **A code editor** like [VS Code](https://code.visualstudio.com/) (free download)
3. **Node.js installed** - [Download here](https://nodejs.org/) (choose LTS version)

### Getting Started

1. **Download the project**
   - Click the green "Code" button on GitHub
   - Select "Download ZIP"
   - Extract the folder to your computer

2. **Open the project**
   - Open VS Code
   - Go to File → Open Folder
   - Select the `yield-canary-dashboard` folder

3. **Install dependencies**
   - Open Terminal in VS Code (View → Terminal)
   - Type: `npm install`
   - Press Enter and wait for it to finish

4. **Start the website**
   - In the terminal, type: `npm run dev`
   - Press Enter
   - Your browser will open to `http://localhost:8080`

---

## 📧 Email System

The platform sends 5 types of automated emails:

### 1. **Welcome Email** (`welcome_verify`)
- Sent when a new user signs up
- Includes username and dashboard access link
- Beautiful HTML design with brand colors

### 2. **Payment Receipt** (`payment_receipt`)
- Sent immediately after successful payment
- Lists all unlocked features (Death Clock, True Yield, etc.)
- Includes CTA button to open dashboard

### 3. **Access Upgraded** (`access_upgraded`)
- Sent when blur is removed from data
- Celebration-themed design
- Confirms full metric visibility

### 4. **Access Expired** (`access_expired`)
- Sent when subscription ends
- Reassures user data is saved
- Includes reactivation link

### 5. **Password Reset** (`password_reset`)
- Sent when user requests password change
- Secure reset link with 1-hour expiration
- Security warnings included

All emails use professional HTML/CSS styling and are mobile-responsive.

---

## 💳 Payment & Subscription

### Stripe Integration

**One-Time Payments:**
- Users can purchase lifetime access
- Uses Stripe Checkout for secure payment processing
- Webhook updates database automatically

**Subscription Payments:**
- Monthly or yearly billing cycles
- Automatic renewal handling
- Cancellation support with data preservation

### Payment Flow

1. User clicks "Upgrade to Pro" on dashboard
2. Redirected to Stripe Checkout page
3. Enters payment details (test card: `4242 4242 4242 4242`)
4. On success, webhook updates `is_paid` status in database
5. Email sent confirming payment
6. User sees unblurred data instantly

---

## 🔧 Environment Variables (Non-Technical Guide)

The `.env.local` file stores secret keys needed for the platform to work. **Never share this file publicly.**

### Required Variables

```env
# Supabase (Database & Authentication)
VITE_SUPABASE_URL=https://hlwpasiewplmjvrtuuxf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
SERVICE_ROLE_KEY=eyJhbGci...

# Stripe (Payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Emails)
VITE_RESEND_API_KEY=re_KAk6...
RESEND_FROM_EMAIL=YieldCanary HQ <admin@yieldcanary.com>

# Pricing (Stripe Price IDs)
VITE_BASIC_MONTHLY_PRICE=price_...
VITE_ADVANCED_MONTHLY_PRICE=price_...
VITE_HALF_DOLLAR_PRICE=price_...
```

### Where to Find These Keys

- **Supabase**: [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
- **Stripe**: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys
- **Resend**: [Resend Dashboard](https://resend.com/api-keys) → API Keys

---

## 🗄️ Database Schema

### `users` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique user identifier |
| `email` | VARCHAR | User email (unique) |
| `username` | VARCHAR | Display name |
| `is_paid` | BOOLEAN | Payment status (true = Pro access) |
| `subscription_tier` | VARCHAR | "basic" or "advanced" |
| `created_at` | TIMESTAMP | Account creation date |
| `updated_at` | TIMESTAMP | Last modification date |

### `etfs` Table (Mock Data)

Stores ETF information including ticker, name, yield metrics, and health indicators.

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel or Netlify
3. Add environment variables in dashboard
4. Deploy automatically on every push

### Backend (Supabase Edge Functions)

```bash
# Deploy all functions
npx supabase functions deploy send-email --no-verify-jwt
npx supabase functions deploy stripe-payment-webhook --no-verify-jwt
npx supabase functions deploy create-checkout-session --no-verify-jwt
```

### Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://hlwpasiewplmjvrtuuxf.supabase.co/functions/v1/stripe-payment-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook signing secret to `.env.local`

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Supabase Authentication
- **Payments**: Stripe Checkout + Webhooks
- **Emails**: Resend API with HTML templates

---

## 📞 Support

For technical assistance or questions:

1. Check the [Supabase Logs](https://supabase.com/dashboard/project/hlwpasiewplmjvrtuuxf/functions) for errors
2. Review [Stripe Webhook Logs](https://dashboard.stripe.com/webhooks) for payment issues
3. Test email delivery in [Resend Dashboard](https://resend.com/emails)

---

## 📄 License

Proprietary - All rights reserved © 2024 YieldCanary
- Tailwind CSS

## How can I deploy this project?

This project can be deployed to any static hosting service that supports React applications.
