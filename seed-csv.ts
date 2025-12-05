import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to parse percentage strings
function parsePercentage(value: string | number | null | undefined): number | null {
  if (!value) return null;
  const str = String(value).trim();
  const num = parseFloat(str.replace('%', ''));
  return isNaN(num) ? null : num / 100;
}

// Helper function to parse AUM (in millions)
function parseAUM(value: string | number | null | undefined): number | null {
  if (!value) return null;
  const str = String(value).trim();
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num * 1000000; // Convert millions to actual number
}

// Helper function to parse numeric values
function parseNumber(value: string | number | null | undefined): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const num = parseFloat(String(value));
  return isNaN(num) ? null : num;
}

// Helper function to parse date
function parseDate(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch {
    return null;
  }
}

// Helper function to map canary status
function mapCanaryStatus(value: string | null | undefined): 'Healthy' | 'Dying' | 'Dead' | null {
  if (!value) return null;
  const status = String(value).trim().toLowerCase();
  if (status === 'healthy') return 'Healthy';
  if (status === 'dying') return 'Dying';
  if (status === 'dead') return 'Dead';
  return null;
}

async function seedFromCSV() {
  console.log('Starting CSV import to Supabase...');

  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'ETFs-Grid view.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Found ${records.length} records in CSV`);

    // Transform CSV records to database schema
    const etfsToInsert = records.map((row: any) => {
      const rocLatest = parsePercentage(row['ROC % (latest)']);
      const deathClockYears = parseNumber(row['Death Clock (years left)']);

      return {
        ticker: row['Ticker']?.trim() || null,
        name: row['Name']?.trim() || null,
        inception_date: parseDate(row['Inception Date']),
        aum: parseAUM(row['AUM']),
        expense_ratio: parsePercentage(row['Expense Ratio']),
        roc_latest: rocLatest,
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
        death_clock_years: deathClockYears,
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
      };
    });

    // Filter out records with missing tickers
    const validETFs = etfsToInsert.filter(etf => etf.ticker);
    console.log(`Valid ETFs to insert: ${validETFs.length}`);

    if (validETFs.length === 0) {
      console.error('No valid ETFs found to insert');
      return;
    }

    // Delete existing ETFs to avoid duplicates
    console.log('Clearing existing ETF data...');
    const { error: deleteError } = await supabase.from('etfs').delete().neq('ticker', '');
    if (deleteError) {
      console.warn('Warning deleting existing data:', deleteError.message);
    }

    // Insert in batches of 10 to avoid timeouts
    const batchSize = 10;
    for (let i = 0; i < validETFs.length; i += batchSize) {
      const batch = validETFs.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)...`);

      const { error, data } = await supabase
        .from('etfs')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        // Log first record for debugging
        if (batch.length > 0) {
          console.error('First record in failed batch:', batch[0]);
        }
      } else {
        console.log(`✓ Successfully inserted batch ${Math.floor(i / batchSize) + 1}`);
      }
    }

    // Verify count
    const { count, error: countError } = await supabase
      .from('etfs')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n✅ CSV import completed! Total ETFs in database: ${count}`);
    } else {
      console.log('\n✅ CSV import completed!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

seedFromCSV();
