# CSV Seeding Script

This script imports ETF data from the CSV file (`ETFs-Grid view.csv`) directly into your Supabase database.

## Features

- **Column Mapping**: Automatically maps CSV columns to database schema
- **Data Transformation**: 
  - Parses percentages (e.g., "0.50%" → 0.005)
  - Converts AUM values (millions → actual numbers)
  - Parses dates to ISO format (YYYY-MM-DD)
  - Maps Canary Health values (Healthy/Dying/Dead)
  - Handles numeric values and null checks
  
- **Batch Processing**: Inserts data in batches of 10 to avoid timeouts
- **Error Handling**: Detailed error messages and logging
- **Duplicate Prevention**: Clears existing data before importing

## Installation

First, install the required dependencies:

```bash
npm install
```

This installs:
- `csv-parse`: CSV parsing library
- `tsx`: TypeScript executor for Node.js

## Usage

Run the CSV seeding script:

```bash
npm run seed:csv
```

## What Gets Imported

The script reads from `ETFs-Grid view.csv` and imports:

### Core ETF Data
- Ticker, Name
- Inception Date
- AUM (Assets Under Management)
- Expense Ratio

### ROC Data
- ROC % (latest) → `roc_latest`
- ROC Date → `roc_date`

### Price Data
- Latest Date
- Latest Adjusted Close
- Price 1Y Ago
- Price YTD Start
- Price at Inception

### Dividend Data
- Dividends Last 12 Months
- Dividends YTD
- Dividends Since Inception

### Calculated Metrics
- Headline Yield (TTM)
- True Income Yield
- Death Clock (years)

### Return Metrics
- 1-Year Returns (Total, Spent-the-Dividends, Take-Home, Take-Home Cash)
- YTD Returns (all variants)
- Since Inception Returns (all variants)

### Classification
- Canary Health Status (Healthy/Dying/Dead)

## Column Mapping Reference

| CSV Column | Database Column | Transformation |
|-----------|-----------------|-----------------|
| Ticker | ticker | String |
| Name | name | String |
| Inception Date | inception_date | Date (YYYY-MM-DD) |
| AUM | aum | Number (× 1,000,000) |
| Expense Ratio | expense_ratio | Percentage (0-1) |
| ROC % (latest) | roc_latest | Percentage (0-1) |
| ROC Date | roc_date | Date (YYYY-MM-DD) |
| Canary Health / Status | canary_health | Enum: Healthy\|Dying\|Dead |
| Latest Adj Close | latest_adj_close | Number |
| Headlines Yield (TTM) | headline_yield_ttm | Percentage (0-1) |
| True Income Yield | true_income_yield | Percentage (0-1) |
| Death Clock (years left) | death_clock_years | Number |
| All Return columns | total_return_*, spent_dividends_return_*, take_home_return_*, take_home_cash_return_* | Percentage (0-1) |

## Troubleshooting

### Dependencies Not Found
```bash
npm install
```

### Import Fails with Connection Error
- Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Ensure your Supabase project is accessible

### CSV File Not Found
- Ensure `ETFs-Grid view.csv` is in the project root directory
- File path is case-sensitive on Linux/Mac

### Column Not Found Error
- The CSV headers must exactly match the ones defined in the script
- Check your CSV file headers if custom

### Duplicate Ticker Error
- The script automatically clears existing data before importing
- If this still fails, manually clear via SQL:
  ```sql
  DELETE FROM etfs;
  ```

## Manual Clearing

To delete all ETF data without re-importing:

```bash
npm run seed:csv
```

The script will clear existing data automatically.

Or manually via Supabase SQL editor:
```sql
DELETE FROM etfs;
```

## Next Steps

After successful import:
1. Your dashboard will automatically fetch and display the new data
2. All ETFs from the CSV will be available in the app
3. No need to restart your dev server - data refresh is automatic
