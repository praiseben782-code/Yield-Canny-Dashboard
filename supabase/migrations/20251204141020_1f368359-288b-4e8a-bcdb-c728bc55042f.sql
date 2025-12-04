-- ============================================
-- TABLE 1: profiles (User Accounts & Payment Status)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  tax_rate NUMERIC(5,2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TABLE 2: etfs (Master ETF Table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.etfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255),
  inception_date DATE,
  aum BIGINT,
  expense_ratio NUMERIC(5,4),
  roc_latest NUMERIC(5,2),
  roc_date DATE,
  canary_health VARCHAR(20),
  
  latest_date DATE,
  latest_adj_close NUMERIC(10,4),
  dividends_last_12mo NUMERIC(10,4),
  dividends_ytd NUMERIC(10,4),
  dividends_since_inception NUMERIC(10,4),
  price_1y_ago NUMERIC(10,4),
  price_ytd_start NUMERIC(10,4),
  price_at_inception NUMERIC(10,4),
  
  headline_yield_ttm NUMERIC(10,6),
  true_income_yield NUMERIC(10,6),
  death_clock_years NUMERIC(10,2),
  
  total_return_1y NUMERIC(10,6),
  spent_dividends_return_1y NUMERIC(10,6),
  take_home_return_1y NUMERIC(10,6),
  take_home_cash_return_1y NUMERIC(10,6),
  
  total_return_ytd NUMERIC(10,6),
  spent_dividends_return_ytd NUMERIC(10,6),
  take_home_return_ytd NUMERIC(10,6),
  take_home_cash_return_ytd NUMERIC(10,6),
  
  total_return_inception NUMERIC(10,6),
  spent_dividends_return_inception NUMERIC(10,6),
  take_home_return_inception NUMERIC(10,6),
  take_home_cash_return_inception NUMERIC(10,6),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ticker_length CHECK (LENGTH(ticker) > 0 AND LENGTH(ticker) <= 20)
);

CREATE INDEX idx_etfs_ticker ON public.etfs(ticker);
CREATE INDEX idx_etfs_updated_at ON public.etfs(updated_at DESC);

ALTER TABLE public.etfs ENABLE ROW LEVEL SECURITY;

-- ETF data is publicly readable
CREATE POLICY "ETF data is publicly readable"
ON public.etfs FOR SELECT
USING (true);

-- ============================================
-- TABLE 3: weekly_data (Price & Dividend History)
-- ============================================
CREATE TABLE IF NOT EXISTS public.weekly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  ticker_id UUID NOT NULL REFERENCES public.etfs(id) ON DELETE CASCADE,
  adj_close NUMERIC(10,4) NOT NULL,
  dividend NUMERIC(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_ticker_date UNIQUE(ticker_id, date)
);

CREATE INDEX idx_weekly_data_ticker ON public.weekly_data(ticker_id);
CREATE INDEX idx_weekly_data_date ON public.weekly_data(date DESC);
CREATE INDEX idx_weekly_data_ticker_date ON public.weekly_data(ticker_id, date DESC);

ALTER TABLE public.weekly_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weekly data is publicly readable"
ON public.weekly_data FOR SELECT
USING (true);

-- ============================================
-- TABLE 4: notices_19a1 (Return of Capital Notices)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notices_19a1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker_id UUID NOT NULL REFERENCES public.etfs(id) ON DELETE CASCADE,
  notice_date DATE,
  roc_percent NUMERIC(5,2),
  effective_date DATE,
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT positive_roc CHECK (roc_percent >= 0 AND roc_percent <= 100)
);

CREATE INDEX idx_notices_ticker ON public.notices_19a1(ticker_id);
CREATE INDEX idx_notices_date ON public.notices_19a1(notice_date DESC);

ALTER TABLE public.notices_19a1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notices are publicly readable"
ON public.notices_19a1 FOR SELECT
USING (true);

-- ============================================
-- Update timestamp trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_etfs_updated_at
  BEFORE UPDATE ON public.etfs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON public.notices_19a1
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();