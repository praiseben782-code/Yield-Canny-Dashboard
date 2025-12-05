-- YieldCanary Supabase Schema
-- PostgreSQL DDL for migrating from Airtable to Supabase
-- Created: 2025-12-04

-- ============================================
-- TABLE 0: users (User Accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  is_paid BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50),  -- 'free', 'basic', 'premium', etc.
  subscription_start DATE,
  subscription_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_paid ON users(is_paid);

-- ============================================
-- TABLE 1: etfs (Master ETF Table)
-- ============================================
CREATE TABLE IF NOT EXISTS etfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255),
  inception_date DATE,
  aum BIGINT,  -- Assets Under Management in millions
  expense_ratio NUMERIC(5,4),  -- Decimal percentage (0.0000 to 99.9999)
  roc_latest NUMERIC(5,2),  -- ROC % (latest) - 0 to 100
  roc_date DATE,
  canary_health VARCHAR(20),  -- 'Healthy', 'Dying', 'Dead'
  
  -- Summary Fields (calculated from Weekly Data)
  latest_date DATE,
  latest_adj_close NUMERIC(10,4),
  dividends_last_12mo NUMERIC(10,4),
  dividends_ytd NUMERIC(10,4),
  dividends_since_inception NUMERIC(10,4),
  price_1y_ago NUMERIC(10,4),
  price_ytd_start NUMERIC(10,4),
  price_at_inception NUMERIC(10,4),
  
  -- Calculated Formula Fields (Number type, not formulas)
  headline_yield_ttm NUMERIC(10,6),  -- Dividends / Latest Price
  true_income_yield NUMERIC(10,6),  -- Headline Yield * (1 - ROC%/100)
  death_clock_years NUMERIC(10,2),  -- 50 / ROC%
  
  -- 1-Year Returns
  total_return_1y NUMERIC(10,6),
  spent_dividends_return_1y NUMERIC(10,6),
  take_home_return_1y NUMERIC(10,6),
  take_home_cash_return_1y NUMERIC(10,6),
  
  -- YTD Returns
  total_return_ytd NUMERIC(10,6),
  spent_dividends_return_ytd NUMERIC(10,6),
  take_home_return_ytd NUMERIC(10,6),
  take_home_cash_return_ytd NUMERIC(10,6),
  
  -- Since Inception Returns
  total_return_inception NUMERIC(10,6),
  spent_dividends_return_inception NUMERIC(10,6),
  take_home_return_inception NUMERIC(10,6),
  take_home_cash_return_inception NUMERIC(10,6),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ticker_length CHECK (LENGTH(ticker) > 0 AND LENGTH(ticker) <= 20)
);

-- Index for ticker lookups
CREATE INDEX idx_etfs_ticker ON etfs(ticker);
CREATE INDEX idx_etfs_updated_at ON etfs(updated_at DESC);

-- ============================================
-- TABLE 2: weekly_data (Price & Dividend History)
-- ============================================
CREATE TABLE IF NOT EXISTS weekly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  ticker_id UUID NOT NULL REFERENCES etfs(id) ON DELETE CASCADE,
  adj_close NUMERIC(10,4) NOT NULL,
  dividend NUMERIC(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Composite unique constraint (one record per ticker per date)
  CONSTRAINT unique_ticker_date UNIQUE(ticker_id, date)
);

-- Indexes for efficient querying
CREATE INDEX idx_weekly_data_ticker ON weekly_data(ticker_id);
CREATE INDEX idx_weekly_data_date ON weekly_data(date DESC);
CREATE INDEX idx_weekly_data_ticker_date ON weekly_data(ticker_id, date DESC);

-- ============================================
-- TABLE 3: notices_19a1 (Return of Capital Notices)
-- ============================================
CREATE TABLE IF NOT EXISTS notices_19a1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker_id UUID NOT NULL REFERENCES etfs(id) ON DELETE CASCADE,
  notice_date DATE,
  roc_percent NUMERIC(5,2),  -- Return of Capital percentage
  effective_date DATE,
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_roc CHECK (roc_percent >= 0 AND roc_percent <= 100)
);

-- Indexes for lookups
CREATE INDEX idx_notices_ticker ON notices_19a1(ticker_id);
CREATE INDEX idx_notices_date ON notices_19a1(notice_date DESC);

-- ============================================
-- VIEW: etf_summary (Latest data for each ETF)
-- ============================================
CREATE OR REPLACE VIEW etf_summary AS
SELECT 
  e.id,
  e.ticker,
  e.name,
  e.latest_adj_close,
  e.headline_yield_ttm,
  e.true_income_yield,
  e.death_clock_years,
  e.total_return_1y,
  e.total_return_ytd,
  e.total_return_inception,
  e.roc_latest,
  e.canary_health,
  e.updated_at
FROM etfs e
ORDER BY e.updated_at DESC;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp on users table
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- Auto-update updated_at timestamp on etfs table
