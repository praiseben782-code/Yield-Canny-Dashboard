import { mockETFs } from './src/data/mockETFs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Transform mockETFs to match database schema
    const etfsToInsert = mockETFs.map((etf) => ({
      ticker: etf.ticker,
      name: etf.name,
      inception_date: etf.inceptionDate,
      latest_adj_close: etf.latestAdjClose,
      latest_date: etf.latestDate,
      headline_yield_ttm: etf.headlineYieldTTM,
      roc_latest: etf.rocPercent,
      roc_date: etf.rocDate,
      true_income_yield: etf.trueIncomeYield,
      death_clock_years: parseFloat(etf.deathClock.split(' ')[0]),
      canary_health: etf.canaryStatus,
      aum: etf.aum,
      expense_ratio: etf.expenseRatio,
      total_return_1y: etf.totalReturn1Y,
      total_return_ytd: etf.totalReturnYTD,
      total_return_inception: etf.totalReturnSinceInception,
      spent_dividends_return_1y: etf.spentDividendsReturn1Y,
      spent_dividends_return_ytd: etf.spentDividendsReturnYTD,
      spent_dividends_return_inception: etf.spentDividendsReturnSinceInception,
      take_home_return_1y: etf.takeHomeReturn1Y,
      take_home_return_ytd: etf.takeHomeReturnYTD,
      take_home_return_inception: etf.takeHomeReturnSinceInception,
      take_home_cash_return_1y: etf.takeHomeCashReturn1Y,
      take_home_cash_return_ytd: etf.takeHomeCashReturnYTD,
      take_home_cash_return_inception: etf.takeHomeCashReturnSinceInception,
    }));

    // Insert ETFs
    const { data, error } = await supabase
      .from('etfs')
      .insert(etfsToInsert);

    if (error) {
      console.error('Error inserting ETFs:', error);
      return;
    }

    console.log(`Successfully inserted ${etfsToInsert.length} ETFs`);
    console.log('Database seed completed!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seedDatabase();
