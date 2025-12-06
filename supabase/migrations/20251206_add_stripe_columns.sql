-- Update users table to track Stripe customer IDs
-- Created: 2025-12-06

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
