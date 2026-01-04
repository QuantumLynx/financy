# Phase 3: Stock Detail Page & Charts Implementation Plan

**Based on Screenshots from:** `/screen/` directory
**Status:** PLANNED
**Estimated Duration:** 4-6 hours

---

## 📋 Overview

Transform the stock detail page to match the reference iCharts design with:
- Left sidebar with collapsible financial sections
- Large interactive price chart
- Multi-tab navigation system
- Modal chart expansion
- Comprehensive financial visualizations

---

## 🎯 Implementation Breakdown

### Step 3.1: Stock Page Layout Restructure (60 min)
**Reference:** `stock-chart-overview.png`

**Layout Changes:**
```
┌─────────────────────────────────────────┐
│ Header (existing)                       │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Main Content                 │
│          │                              │
│ Stock    │ ┌─────────────────────────┐ │
│ Info     │ │  Price Chart (Large)    │ │
│ Panel    │ │  Time Periods: 1D-Max   │ │
│          │ └─────────────────────────┘ │
│ - Fin.   │                              │
│ - Yields │ ┌─────────────────────────┐ │
│ - Balance│ │ Tab Navigation          │ │
│ - Margins│ │ Income|Balance|Cash etc │ │
│          │ └─────────────────────────┘ │
│          │                              │
│          │ ┌─────────────────────────┐ │
│          │ │ Tab Content Area        │ │
│          │ │ (Charts/Tables)         │ │
│          │ └─────────────────────────┘ │
└──────────┴──────────────────────────────┘
```

**Tasks:**
- [ ] Create `StockInfoSidebar.tsx` component
  - Collapsible sections: Financials, Yields, Balances, Margins
  - Data display with label-value pairs
  - Expand/collapse icons
- [ ] Restructure `app/stock/[ticker]/page.tsx`
  - Two-column layout (sidebar + main)
  - Move chart to top of main area
  - Add time period selector buttons
- [ ] Create `PriceChart.tsx` component
  - Large area chart with gradient fill
  - Time period buttons (1D, 5D, 1M, 6M, YTD, 1Y, 3Y, 5Y, 10Y, Max)
  - Hover tooltip with price/date

---

### Step 3.2: Tab Navigation System (45 min)
**Reference:** `stock-chart-overview.png`, all tab screenshots

**Tabs to Implement:**
1. Income - Income Statement Analysis
2. Balance - Balance Sheet Analysis
3. Cash Flow - Cash Flow Analysis
4. Reports - (Future)
5. Ratios - Financial Ratios
6. Estimates - Analyst Estimates
7. Compare - (Future)
8. Score - (Future)
9. Valuation - (Future)

**Tasks:**
- [ ] Create `TabNavigation.tsx` component
  - Icon + label for each tab
  - Active state highlighting
  - Click to switch tabs
- [ ] Create tab state management
  - useState for active tab
  - Dynamic content rendering
- [ ] Style tabs with terminal colors
  - Active: cyan accent
  - Hover: subtle glow

---

### Step 3.3: Income Tab Implementation (60 min)
**Reference:** `stock-chart-income.png`

**Charts Required:**
- Total Revenues (red bars)
- Gross Profit (orange bars)
- Operating Income (green bars)
- Net Income (green bars)
- Earnings Per Share (green bars)
- Shares Outstanding Diluted (blue bars)

**Layout:** 2 rows × 3 columns grid

**Tasks:**
- [ ] Create `IncomeTab.tsx` component
- [ ] Create 6 bar chart components using Recharts
- [ ] Add expand icon to each chart
- [ ] Implement onClick → modal
- [ ] Style with terminal colors
- [ ] Add proper spacing and alignment

---

### Step 3.4: Balance Tab Implementation (60 min)
**Reference:** `stock-chart-balance-sheet-analysis.png`

**Chart Groups:**
1. **Short-term Position** (3 series grouped bars)
   - Cash & Short-Term Investments (blue)
   - Total Current Assets (green)
   - Total Current Liabilities (red)

2. **Total Structure** (3 series grouped bars)
   - Total Assets (blue)
   - Total Liabilities (red)
   - Total Equity (green)

3. **Debt vs Liquidity** (2 series grouped bars)
   - Total Debt (red)
   - Cash & Short-Term (green)

**Layout:** 3 charts in row

**Tasks:**
- [ ] Create `BalanceTab.tsx` component
- [ ] Implement grouped bar charts (3 series each)
- [ ] Add legend for each chart group
- [ ] Add expand icon
- [ ] Color code series properly

---

### Step 3.5: Cash Flow Tab Implementation (60 min)
**Reference:** `stock-chart-cash-overview.png`, `stock-chart-cash-flow-breakdown.png`

**Charts Required:**
1. **Cash Flow Breakdown** (4 series)
   - Operating Cash Flow (blue)
   - Free Cash Flow (green)
   - Stock-Based Compensation (orange)
   - Capital Expenditures (red)

2. **OCF vs Net Income** (2 series)
   - Operating Cash Flow (blue)
   - Net Income (green)

**Tasks:**
- [ ] Create `CashFlowTab.tsx` component
- [ ] Implement 4-series grouped bar chart
- [ ] Implement 2-series comparison chart
- [ ] Add chart titles and descriptions
- [ ] Style with proper colors

---

### Step 3.6: Chart Modal System (60 min)
**Reference:** `stock-chart-balance-sheet-Debt-vs-Liquidity.png`, `stock-chart-cash-flow-breakdown.png`

**Modal Features:**
- Full-screen overlay
- Chart title
- Controls row:
  - Select Range dropdown (5 Years, 10 Years, etc.)
  - View dropdown (Absolute, Percentage)
  - Chart Type dropdown (Annually, Quarterly)
  - Filter Metrics dropdown (toggle series visibility)
- Large chart area
- Close button (X)
- Tooltip on hover

**Tasks:**
- [ ] Create `ChartModal.tsx` component
- [ ] Add modal overlay with backdrop
- [ ] Implement control dropdowns
- [ ] Add filter metrics functionality
- [ ] Enlarge chart in modal view
- [ ] Add close button with animation
- [ ] Style with terminal colors

---

### Step 3.7: Estimates Tab Implementation (45 min)
**Reference:** `stock-chart-estimates-eps.png`, `stock-chart-estimates-revenue.png`

**Layout:**
- Quarterly/Annual toggle buttons
- Two data tables:
  - Revenue (Annual Estimates)
  - EPS (Annual Estimates)

**Table Columns:**
- Fiscal Period Ending
- Estimate
- YoY Growth (%)
- FWD P/E
- Average
- Low
- High
- # of Analysts

**Tasks:**
- [ ] Create `EstimatesTab.tsx` component
- [ ] Create `EstimatesTable.tsx` component
- [ ] Add quarterly/annual toggle
- [ ] Implement data tables with proper columns
- [ ] Color-code beat/miss indicators
- [ ] Format numbers and percentages
- [ ] Style with tabular-nums class

---

### Step 3.8: Ratios Tab Implementation (60 min)
**Reference:** `stock-chart-ratio-part-1-only-graphs-not-style.png`, `stock-chart-ratio-part-2-only-graphs-not-style.png`

**Charts Required (Line Charts):**

**Profitability:**
- P/E Ratio
- P/S Ratio

**Balance:**
- PE (FWD)
- Current Ratio

**Cash Flow:**
- Return On Equity
- Debt To Equity

**Additional:**
- Total Liabilities To Equity
- P/CF
- P/FCF

**Layout:** 3 columns grid, multiple rows

**Tasks:**
- [ ] Create `RatiosTab.tsx` component
- [ ] Implement 9 line chart components
- [ ] Add section headers (Profitability, Balance, Cash Flow)
- [ ] Color code lines appropriately
- [ ] Add hover tooltips
- [ ] Add expand functionality

---

### Step 3.9: Rename Markets to Watchlist (30 min)
**Reference:** `watchlist-combine-with-markets-and-rename-to-watchlist.png`

**Changes:**
- Rename "Markets" to "Watchlist" in navigation
- Update page title and description
- Implement table view with columns:
  - Symbol/Company (with logo)
  - Current Price
  - 1D Change (%)
  - YTD (%)
  - Market Cap
  - Operating Margin
  - Net Income Margin
- Add category grouping (e.g., "Marketing")
- Add Gainers/Losers counters

**Tasks:**
- [ ] Rename in `Sidebar.tsx`: Markets → Watchlist
- [ ] Update route: `/markets` → `/watchlist`
- [ ] Create new `app/watchlist/page.tsx`
- [ ] Implement table view with all columns
- [ ] Add stock logos/icons
- [ ] Color-code positive/negative changes
- [ ] Add category headers
- [ ] Style with terminal colors

---

### Step 3.10: Filter Metrics Dropdown (30 min)
**Reference:** `stock-chart-cash-flow-filter-metrics.png`

**Features:**
- Dropdown menu with checkboxes
- Toggle visibility of chart series
- Checkboxes for each metric
- Live update of chart when toggled

**Tasks:**
- [ ] Create `FilterMetricsDropdown.tsx` component
- [ ] Implement checkbox list
- [ ] Add state management for visibility
- [ ] Connect to chart data filtering
- [ ] Style with terminal colors
- [ ] Add hover states

---

## 📊 Component Architecture

```
app/stock/[ticker]/
├── page.tsx (Main Layout)
├── components/
│   ├── StockInfoSidebar.tsx
│   ├── PriceChart.tsx
│   ├── TabNavigation.tsx
│   ├── tabs/
│   │   ├── IncomeTab.tsx
│   │   ├── BalanceTab.tsx
│   │   ├── CashFlowTab.tsx
│   │   ├── EstimatesTab.tsx
│   │   └── RatiosTab.tsx
│   ├── ChartModal.tsx
│   ├── FilterMetricsDropdown.tsx
│   └── EstimatesTable.tsx
```

---

## 🎨 Design Specifications

### Colors (Terminal Palette)
- **Blue**: #3b82f6 (Operating Cash Flow, Total Assets)
- **Green**: #00ff41 (Net Income, Free Cash Flow, positive values)
- **Red**: #ff004d (Total Liabilities, Debt, negative values)
- **Orange**: #ffb000 (Gross Profit, Stock-Based Comp)
- **Cyan**: #00d9ff (Accent, active tabs)

### Chart Specifications
- **Bar Width**: 20-30px
- **Border Radius**: 2px top corners
- **Spacing**: 4-6px between bars
- **Grouped Spacing**: 2px within group
- **Font**: JetBrains Mono (numbers), Space Grotesk (labels)

### Sidebar Specifications
- **Width**: 280px fixed
- **Background**: bg-card-dark
- **Border**: border-slate-800
- **Section Spacing**: 16px vertical

---

## 📁 Data Structure Requirements

### Stock Financial Data
```typescript
interface StockFinancials {
  marketCap: string;
  pe: number;
  fwdPE: number;
  fwdPEG: number;
  priceToCashFlow: number;

  yields: {
    earningsYield: number;
    cashFlowYield: number;
    freeCashFlowYield: number;
    dividendYield: number | 'N/A';
    payoutRatio: number | 'N/A';
  };

  balances: {
    totalCash: string;
    totalDebt: string;
    netCashPosition: string;
  };

  margins: {
    grossMargin: number;
    operatingMargin: number;
    netIncomeMargin: number;
  };

  // Time series data
  incomeStatement: {
    annual: AnnualData[];
    quarterly: QuarterlyData[];
  };

  balanceSheet: {
    annual: BalanceData[];
    quarterly: BalanceData[];
  };

  cashFlow: {
    annual: CashFlowData[];
    quarterly: CashFlowData[];
  };

  estimates: {
    revenue: EstimateData[];
    eps: EstimateData[];
  };

  ratios: {
    pe: RatioTimeSeriesData[];
    ps: RatioTimeSeriesData[];
    // ... more ratios
  };
}
```

---

## ✅ Success Criteria

- [ ] Stock page matches iCharts reference layout
- [ ] All 9 tabs implemented and functional
- [ ] Chart modals work with controls
- [ ] Sidebar shows all financial metrics
- [ ] Charts use terminal color palette
- [ ] Hover tooltips display correct data
- [ ] Filter metrics dropdown works
- [ ] Watchlist page fully functional
- [ ] All interactions smooth (60fps)
- [ ] Responsive on different screen sizes
- [ ] No console errors
- [ ] Terminal aesthetic maintained

---

## 🎯 Implementation Order

**Week 1 (Days 1-2):**
1. Step 3.1: Layout restructure
2. Step 3.2: Tab navigation
3. Step 3.3: Income tab

**Week 1 (Days 3-4):**
4. Step 3.4: Balance tab
5. Step 3.5: Cash Flow tab
6. Step 3.6: Chart modal system

**Week 2 (Days 1-2):**
7. Step 3.7: Estimates tab
8. Step 3.8: Ratios tab
9. Step 3.9: Watchlist rename
10. Step 3.10: Filter dropdown

---

**Phase 3 Total Estimated Time:** 8-10 hours

**Ready to Start:** Awaiting user approval
