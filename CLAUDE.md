# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project:** Financy  
**Stack:** TypeScript, React 19, Next.js 16 (App Router), Tailwind CSS v4  
**Package manager:** npm  
**Test runner:** Jest

---

## Commands

```bash
npm run dev            # Dev server → localhost:3000
npm run build          # Production build
npm run lint           # ESLint
npm run test           # All tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage (80% threshold)
```

Run a single file: `npx jest path/to/test.tsx`

---

## Development Workflow

1. Branch from `main` — use `feature/<name>` or `fix/<name>`
2. Open a PR → Claude auto-reviews via `.github/workflows/claude-code-review.yml`
3. **Adding a rule to this file:** comment `@claude add this to CLAUDE.md` in any PR review — the bot opens a follow-up PR with the change
4. Merge to `main` after review passes

---

## Project Structure

```
app/                    # Next.js App Router pages
  page.tsx              # / — Market Command Center
  watchlist/            # /watchlist
  stock/[ticker]/       # /stock/:ticker — detail + financials tabs
  portfolio/ news/ settings/

components/
  layout/               # Sidebar (collapsible), Header
  dashboard/            # IndexCard, StockCard, LiveStockSearch, etc.
  stock/                # PriceChart, StockInfoSidebar; tabs/ (Income, Balance, CashFlow, Estimates, Ratios)
  watchlist/            # SearchBar, FilterDropdown, SortDropdown, MarketIndexesSection
  charts/               # TradingViewChart wrappers
  ui/                   # Toast, ConfirmModal

lib/
  mockData.ts           # All types (AssetType, MarketIndex, StockData, FundamentalDatapoint) + mock exports
  utils.ts              # cn() — clsx + tailwind-merge
  hooks/                # useLocalStorage, useToast
  chartUtils.ts
```

---

## Design System

This app uses a **cyberpunk / terminal aesthetic** with custom CSS utility classes that are not standard Tailwind.  
→ See [`.claude/design-system.md`](.claude/design-system.md) before touching any UI styling.

---

## Data Layer

Currently 100% mock (`lib/mockData.ts` is the only data source).  
When integrating a real API:
- Secrets go in `.env` (gitignored) — never in source files
- Add new env vars to `.env.sample` with placeholder values immediately
- Use `NEXT_PUBLIC_` prefix only for values safe to expose in the browser

---

## Testing

Tests live in `__tests__/` directories co-located with the feature they test.  
Coverage thresholds enforced in `jest.config.js`: 80% statements/functions/lines, 75% branches.
