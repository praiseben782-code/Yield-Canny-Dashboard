# Seeding Your Supabase Database

## Quick Start

To populate your Supabase database with the mock ETF data, run:

```bash
npm run seed
```

This will:
1. Read the mock ETF data from `src/data/mockETFs.ts`
2. Transform it to match your Supabase schema
3. Insert all ETFs into your `etfs` table

## What Gets Inserted

12 sample ETFs with complete data:
- TSLY, QYLD, XYLD, MSTY (Free tier samples)
- JEPI, SPYI, NVDY, CONY (Premium tier)
- QDTE, XDTE, JEPQ, DIVO (Additional premium)

All with realistic financial metrics including:
- Yields, ROC%, death clock calculations
- 1-year, YTD, and since-inception returns
- Tax-adjusted return metrics

## After Seeding

Your dashboard will automatically:
1. Connect to Supabase
2. Fetch real data from the `etfs` table
3. Display live ETF data instead of mock data

## Troubleshooting

If the seed fails:
1. Check your `.env.local` file has correct Supabase credentials
2. Ensure the `etfs` table exists (created by migrations)
3. Verify you have write permissions on the table

## Clearing Data

To remove all ETFs and start fresh:
```sql
DELETE FROM etfs;
```

Then run `npm run seed` again.
