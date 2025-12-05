import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Simple CSV parser
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      const nextChar = lines[i][j + 1];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    records.push(record);
  }

  return records;
}

// Helper functions
const parsePercentage = (val) => {
  if (!val) return null;
  const num = parseFloat(String(val).replace('%', ''));
  return isNaN(num) ? null : num / 100;
};

const parseAUM = (val) => {
  if (!val) return null;
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num * 1000000;
};

const parseNumber = (val) => {
  if (!val) return null;
  const num = parseFloat(String(val));
  return isNaN(num) ? null : num;
};

const parseDate = (val) => {
  if (!val) return null;
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

const mapCanaryStatus = (val) => {
  if (!val) return null;
  const status = String(val).trim().toLowerCase();
  if (status === 'healthy') return 'Healthy';
  if (status === 'dying') return 'Dying';
  if (status === 'dead') return 'Dead';
  return null;
};

// Main function
async function seedFromCSV() {
  console.log('🚀 Starting CSV import to Supabase...\n');

  try {
    const VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsd3Bhc2lld3BsbWp2cnR1dXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTM1NzUsImV4cCI6MjA4MDQyOTU3NX0.X7d2qD4B_niErA0l5Psaee_XxkRGUcIG8RE2lvG5_t8";
const VITE_SUPABASE_URL="https://hlwpasiewplmjvrtuuxf.supabase.co";
    const SUPABASE_URL = VITE_SUPABASE_URL;
    const SUPABASE_KEY = VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('❌ Error: Missing Supabase credentials in .env.local');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Read and parse CSV
    const csvPath = path.join(process.cwd(), 'ETFs-Grid view.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(csvContent);

    console.log(`📊 Found ${records.length} records in CSV\n`);

    // Transform data
    const etfsToInsert = records
      .map((row) => ({
        ticker: row['Ticker']?.trim() || null,
        name: row['Name']?.trim() || null,
        inception_date: parseDate(row['Inception Date']),
        aum: parseAUM(row['AUM']),
        expense_ratio: parsePercentage(row['Expense Ratio']),
        roc_latest: parsePercentage(row['ROC % (latest)']),
        roc_date: parseDate(row['ROC Date']),
        canary_health: mapCanaryStatus(row['Canary Health'] || row['Canary Status']),
        latest_date: parseDate(row['Latest Date']),
        latest_adj_close: parseNumber(row['Latest Adj Close']),
        dividends_last_12mo: parseNumber(row['Dividends Last 12Mo']),
        dividends_ytd: parseNumber(row['Dividends YTD']),
        dividends_since_inception: parseNumber(row['Dividends Since Inception']),
        price_1y_ago: parseNumber(row['Price 1Y Ago']),
        price_ytd_start: parseNumber(row['Price YTD Start']),
        price_at_inception: parseNumber(row['Price at Inception']),
        headline_yield_ttm: parsePercentage(row['Headline Yield (TTM)']),
        true_income_yield: parsePercentage(row['True Income Yield']),
        death_clock_years: parseNumber(row['Death Clock (years left)']),
        total_return_1y: parsePercentage(row['Total Return 1Y']),
        spent_dividends_return_1y: parsePercentage(row['Spent-the-Dividends Return 1Y']),
        take_home_return_1y: parsePercentage(row['Take-Home Return 1Y']),
        take_home_cash_return_1y: parsePercentage(row['Take-Home Cash Return 1Y']),
        total_return_ytd: parsePercentage(row['Total Return YTD']),
        spent_dividends_return_ytd: parsePercentage(row['Spent-the-Dividends Return YTD']),
        take_home_return_ytd: parsePercentage(row['Take-Home Return YTD']),
        take_home_cash_return_ytd: parsePercentage(row['Take-Home Cash Return YTD']),
        total_return_inception: parsePercentage(row['Total Return Since Inception']),
        spent_dividends_return_inception: parsePercentage(row['Spent-the-Dividends Return Inception']),
        take_home_return_inception: parsePercentage(row['Take-Home Return Inception']),
        take_home_cash_return_inception: parsePercentage(row['Take-Home Cash Return Inception']),
      }))
      .filter(etf => etf.ticker);

    console.log(`✅ Valid ETFs to insert: ${etfsToInsert.length}\n`);

    if (etfsToInsert.length === 0) {
      console.error('❌ No valid ETFs found');
      process.exit(1);
    }

    // Clear existing data
    console.log('🧹 Clearing existing ETF data...');
    await supabase.from('etfs').delete().neq('ticker', '');
    console.log('✓ Cleared\n');

    // Insert in batches
    const batchSize = 10;
    for (let i = 0; i < etfsToInsert.length; i += batchSize) {
      const batch = etfsToInsert.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;

      console.log(`📤 Batch ${batchNum}: Inserting ${batch.length} records...`);

      const { error } = await supabase.from('etfs').insert(batch);

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✓ Success\n`);
      }
    }

    // Verify
    const { count } = await supabase
      .from('etfs')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✨ Done! Total ETFs in database: ${count || etfsToInsert.length}\n`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedFromCSV();
