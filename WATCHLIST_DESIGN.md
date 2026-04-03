# Watchlist System Design

**Version:** 1.0
**Date:** January 2, 2026
**Purpose:** Enhanced watchlist with market indexes, asset types, and full management capabilities

---

## 1. Executive Summary

### Business Requirements
- Display real-time market index snapshots (S&P 500, Nasdaq, Russell 2000, BTCUSD, ETHUSD)
- Support multiple asset types: Stock, ETF, Crypto, Index
- Enable users to add/remove assets from watchlist
- Provide filtering and sorting capabilities
- Maintain personalized watchlist state

### Success Metrics
- ✅ Real-time index updates (< 1s latency)
- ✅ Fast watchlist operations (< 200ms)
- ✅ Support for 100+ assets per user
- ✅ Persistent watchlist across sessions

---

## 2. Data Model Design

### 2.1 Asset Type Enumeration

```typescript
export enum AssetType {
  STOCK = 'Stock',
  ETF = 'ETF',
  CRYPTO = 'Crypto',
  INDEX = 'Index'
}
```

### 2.2 Market Index Interface

```typescript
export interface MarketIndex {
  id: string;                    // 'SPX', 'NDX', 'RUT', 'BTCUSD', 'ETHUSD'
  name: string;                  // 'S&P 500', 'Nasdaq', etc.
  symbol: string;                // Display symbol
  value: number;                 // Current value
  change: number;                // Dollar change
  changePercent: number;         // Percentage change
  assetType: AssetType.INDEX | AssetType.CRYPTO;
  updatedAt: Date;               // Last update timestamp
}
```

### 2.3 Extended Stock Data

```typescript
export interface WatchlistAsset extends StockData {
  assetType: AssetType;          // NEW: Asset classification
  isInWatchlist: boolean;        // NEW: Watchlist membership
  addedAt?: Date;                // NEW: When added to watchlist
  category?: string;             // Sector/Category grouping
  exchange?: string;             // Trading exchange

  // Existing fields from StockData
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  // ... all other fields
}
```

### 2.4 Watchlist State

```typescript
export interface WatchlistState {
  userId: string;                // User identifier
  assets: WatchlistAsset[];      // User's watchlist items
  filters: WatchlistFilters;     // Active filters
  sortBy: SortField;             // Current sort field
  sortOrder: 'asc' | 'desc';     // Sort direction
  lastModified: Date;            // Last update timestamp
}

export interface WatchlistFilters {
  assetTypes: AssetType[];       // Filter by type
  categories: string[];          // Filter by sector/category
  search: string;                // Text search
  minMarketCap?: number;         // Market cap range
  maxMarketCap?: number;
}

export type SortField =
  | 'ticker'
  | 'name'
  | 'price'
  | 'changePercent'
  | 'marketCap'
  | 'operatingMargin'
  | 'netIncomeMargin'
  | 'assetType';
```

---

## 3. API Design

### 3.1 Watchlist Management Endpoints

#### Get User Watchlist
```typescript
GET /api/watchlist
Response: {
  assets: WatchlistAsset[];
  total: number;
  lastModified: Date;
}
```

#### Add Asset to Watchlist
```typescript
POST /api/watchlist/add
Body: {
  ticker: string;
  assetType: AssetType;
}
Response: {
  success: boolean;
  asset: WatchlistAsset;
}
```

#### Remove Asset from Watchlist
```typescript
DELETE /api/watchlist/remove/:ticker
Response: {
  success: boolean;
  message: string;
}
```

#### Bulk Operations
```typescript
POST /api/watchlist/bulk
Body: {
  action: 'add' | 'remove';
  tickers: string[];
}
Response: {
  success: boolean;
  added?: number;
  removed?: number;
  errors?: string[];
}
```

### 3.2 Market Index Endpoints

#### Get All Indexes
```typescript
GET /api/indexes
Response: {
  indexes: MarketIndex[];
  updatedAt: Date;
}
```

#### Get Single Index
```typescript
GET /api/indexes/:id
Response: MarketIndex
```

### 3.3 Asset Search & Discovery

#### Search Assets
```typescript
GET /api/assets/search?q={query}&type={assetType}
Response: {
  results: WatchlistAsset[];
  total: number;
}
```

#### Get All Available Assets
```typescript
GET /api/assets?type={assetType}&page={page}&limit={limit}
Response: {
  assets: WatchlistAsset[];
  total: number;
  page: number;
  totalPages: number;
}
```

---

## 4. Component Architecture

### 4.1 Component Hierarchy

```
WatchlistPage
├── MarketIndexesSection
│   ├── IndexCard (S&P 500)
│   ├── IndexCard (Nasdaq)
│   ├── IndexCard (Russell 2000)
│   ├── IndexCard (BTCUSD)
│   └── IndexCard (ETHUSD)
├── WatchlistToolbar
│   ├── SearchBar (add new assets)
│   ├── FilterDropdown (asset types)
│   ├── SortDropdown (sort fields)
│   └── BulkActions (remove selected)
└── WatchlistTable
    ├── TableHeader (sortable columns)
    └── TableRow[] (clickable rows)
        ├── AssetTypeBadge
        ├── CompanyInfo (logo, ticker, name)
        ├── PriceData
        ├── ChangeData
        ├── MarketData
        └── ActionButtons (remove from watchlist)
```

### 4.2 Component Specifications

#### MarketIndexesSection
```typescript
interface MarketIndexesSectionProps {
  indexes: MarketIndex[];
  loading?: boolean;
}

// Features:
// - Real-time updates via WebSocket/polling
// - Color-coded positive/negative changes
// - Skeleton loading states
// - Click to view detailed chart (future)
```

#### WatchlistToolbar
```typescript
interface WatchlistToolbarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: WatchlistFilters) => void;
  onSort: (field: SortField, order: 'asc' | 'desc') => void;
  selectedCount: number;
  onBulkRemove: () => void;
}

// Features:
// - Debounced search input
// - Multi-select filter checkboxes
// - Sort direction toggle
// - Bulk action confirmation modal
```

#### WatchlistTable
```typescript
interface WatchlistTableProps {
  assets: WatchlistAsset[];
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  onRemove: (ticker: string) => void;
  selectedTickers: string[];
  onSelect: (ticker: string, selected: boolean) => void;
}

// Features:
// - Checkbox selection for bulk actions
// - Sortable column headers
// - Row hover effects
// - Click row to navigate to detail page
// - Right-click context menu (future)
```

#### AssetTypeBadge
```typescript
interface AssetTypeBadgeProps {
  type: AssetType;
}

// Styling:
// Stock: Blue badge
// ETF: Purple badge
// Crypto: Orange badge
// Index: Cyan badge
```

---

## 5. State Management

### 5.1 Local Storage Strategy

```typescript
// Persist watchlist to localStorage
const WATCHLIST_STORAGE_KEY = 'financy_watchlist';

interface StoredWatchlist {
  tickers: string[];        // Just store tickers
  assetTypes: Record<string, AssetType>;
  lastSync: Date;
}

// Sync with server on load/changes
function syncWatchlist() {
  const local = loadFromStorage();
  const server = await fetchWatchlist();

  // Merge strategy: server wins
  const merged = mergeWatchlists(local, server);
  saveToStorage(merged);

  return merged;
}
```

### 5.2 React State Management

```typescript
// Using React Context + Hooks
interface WatchlistContextValue {
  // State
  assets: WatchlistAsset[];
  indexes: MarketIndex[];
  filters: WatchlistFilters;
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
  selectedTickers: Set<string>;
  loading: boolean;

  // Actions
  addToWatchlist: (ticker: string, assetType: AssetType) => Promise<void>;
  removeFromWatchlist: (ticker: string) => Promise<void>;
  bulkRemove: (tickers: string[]) => Promise<void>;
  setFilters: (filters: Partial<WatchlistFilters>) => void;
  setSort: (field: SortField, order?: 'asc' | 'desc') => void;
  toggleSelection: (ticker: string) => void;
  clearSelection: () => void;
  refreshIndexes: () => Promise<void>;
}

// Provider component
function WatchlistProvider({ children }) {
  const [state, dispatch] = useReducer(watchlistReducer, initialState);

  // Auto-refresh indexes every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshIndexes, 30000);
    return () => clearInterval(interval);
  }, []);

  // ...implementation
}
```

---

## 6. User Interactions

### 6.1 Add to Watchlist Flow

```
1. User types in search bar
2. Autocomplete dropdown appears with matching assets
3. User selects asset from dropdown
4. System shows asset type badge
5. User clicks "Add to Watchlist"
6. Asset appears in table immediately (optimistic update)
7. Background API call confirms addition
8. Success toast notification appears
9. localStorage updated
```

### 6.2 Remove from Watchlist Flow

```
Single Remove:
1. User clicks trash icon on row
2. Confirmation modal appears: "Remove {ticker} from watchlist?"
3. User confirms
4. Row fades out with animation
5. API call processes removal
6. Success notification
7. localStorage updated

Bulk Remove:
1. User selects multiple checkboxes
2. Toolbar shows "X selected" badge
3. User clicks "Remove Selected"
4. Confirmation modal: "Remove X assets from watchlist?"
5. User confirms
6. Selected rows fade out
7. Batch API call processes
8. Success notification
```

### 6.3 Filter & Sort Flow

```
Filter:
1. User clicks filter dropdown
2. Checkboxes for each AssetType
3. User toggles options
4. Table updates in real-time
5. Filter state persisted in URL params
6. Clear filters button appears when active

Sort:
1. User clicks column header
2. Sort indicator appears (↑/↓)
3. Table re-orders immediately
4. Click again to reverse order
5. Click third time to clear sort
6. Sort state persisted in URL params
```

---

## 7. Mock Data Structure

### 7.1 Market Indexes

```typescript
export const MOCK_INDEXES: MarketIndex[] = [
  {
    id: 'SPX',
    name: 'S&P 500',
    symbol: 'SPX',
    value: 4783.83,
    change: 23.87,
    changePercent: 0.50,
    assetType: AssetType.INDEX,
    updatedAt: new Date()
  },
  {
    id: 'NDX',
    name: 'Nasdaq',
    symbol: 'NDX',
    value: 16825.93,
    change: -45.23,
    changePercent: -0.27,
    assetType: AssetType.INDEX,
    updatedAt: new Date()
  },
  {
    id: 'RUT',
    name: 'Russell 2000',
    symbol: 'RUT',
    value: 2063.24,
    change: 12.45,
    changePercent: 0.61,
    assetType: AssetType.INDEX,
    updatedAt: new Date()
  },
  {
    id: 'BTCUSD',
    name: 'Bitcoin',
    symbol: 'BTC-USD',
    value: 42750.50,
    change: 1250.30,
    changePercent: 3.01,
    assetType: AssetType.CRYPTO,
    updatedAt: new Date()
  },
  {
    id: 'ETHUSD',
    name: 'Ethereum',
    symbol: 'ETH-USD',
    value: 2234.75,
    change: -67.25,
    changePercent: -2.92,
    assetType: AssetType.CRYPTO,
    updatedAt: new Date()
  }
];
```

### 7.2 Extended Stock Data

```typescript
// Update existing MOCK_STOCKS
export const MOCK_STOCKS: Record<string, WatchlistAsset> = {
  AAPL: {
    // Existing fields...
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 192.53,
    // ... all existing fields

    // NEW fields
    assetType: AssetType.STOCK,
    isInWatchlist: true,
    addedAt: new Date('2026-01-01'),
    category: 'Technology',
    exchange: 'NASDAQ'
  },
  // Add ETF example
  SPY: {
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 478.25,
    change: 2.15,
    changePercent: 0.45,
    marketCap: '432.5B',
    assetType: AssetType.ETF,
    isInWatchlist: true,
    category: 'Large Cap Blend',
    exchange: 'NYSE Arca',
    // ... fundamentals
  },
  // Add Crypto example
  'BTC-USD': {
    ticker: 'BTC-USD',
    name: 'Bitcoin USD',
    price: 42750.50,
    change: 1250.30,
    changePercent: 3.01,
    marketCap: '837.2B',
    assetType: AssetType.CRYPTO,
    isInWatchlist: true,
    category: 'Cryptocurrency',
    exchange: 'Crypto',
    // ... fundamentals
  }
};
```

---

## 8. UI/UX Specifications

### 8.1 Market Indexes Section

```
Layout: 5-column grid (responsive)
Card Design:
- Border: 1px solid slate-800
- Background: card-dark gradient
- Padding: 24px
- Hover: Slight lift + glow effect

Content:
- Index name (text-slate-400, 12px)
- Current value (text-white, 28px, bold, tabular-nums)
- Change indicator:
  - Icon: TrendingUp (green) or TrendingDown (red)
  - Dollar change (18px, semibold)
  - Percent change (14px, in parentheses)
```

### 8.2 Asset Type Badges

```typescript
const ASSET_TYPE_STYLES = {
  [AssetType.STOCK]: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400'
  },
  [AssetType.ETF]: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400'
  },
  [AssetType.CRYPTO]: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400'
  },
  [AssetType.INDEX]: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400'
  }
};

// Badge component
<div className={cn(
  "px-2 py-0.5 rounded text-xs font-medium border",
  ASSET_TYPE_STYLES[assetType].bg,
  ASSET_TYPE_STYLES[assetType].border,
  ASSET_TYPE_STYLES[assetType].text
)}>
  {assetType}
</div>
```

### 8.3 Table Enhancements

```
New Columns:
1. Checkbox (select for bulk actions)
2. Asset Type (badge)
3. Symbol/Company name
4. Current Price
5. 1D Change
6. YTD %
7. Market Cap
8. Operating Margin
9. Net Income Margin
10. Actions (remove button)

Column Widths:
- Checkbox: 40px
- Asset Type: 80px
- Symbol/Name: 280px (flex)
- Numeric columns: 120px each
- Actions: 60px

Row Actions:
- Click row → Navigate to detail page
- Click checkbox → Toggle selection
- Click remove icon → Remove from watchlist
- Hover → Highlight entire row
```

---

## 9. Implementation Plan

### Phase 1: Data Layer (Priority: High)
```
Tasks:
✓ Update mockData.ts with AssetType enum
✓ Add MOCK_INDEXES array
✓ Extend MOCK_STOCKS with new fields
✓ Create WatchlistAsset interface
✓ Add sample ETF and Crypto assets
```

### Phase 2: Market Indexes UI (Priority: High)
```
Tasks:
□ Create MarketIndexCard component
□ Create MarketIndexesSection component
□ Implement real-time value updates
□ Add loading skeletons
□ Style with terminal colors
```

### Phase 3: Watchlist Table (Priority: High)
```
Tasks:
□ Add Asset Type column with badges
□ Add checkbox column for selection
□ Add Actions column with remove button
□ Update table styling
□ Implement row selection state
```

### Phase 4: Toolbar & Filters (Priority: Medium)
```
Tasks:
□ Create SearchBar component with autocomplete
□ Create FilterDropdown component
□ Create SortDropdown component
□ Create BulkActions component
□ Wire up state management
```

### Phase 5: Add/Remove Logic (Priority: Medium)
```
Tasks:
□ Implement addToWatchlist function
□ Implement removeFromWatchlist function
□ Implement bulkRemove function
□ Add confirmation modals
□ Add success/error notifications
□ Implement localStorage sync
```

### Phase 6: Sorting & Filtering (Priority: Medium)
```
Tasks:
□ Implement client-side sorting
□ Implement client-side filtering
□ Add URL param persistence
□ Add clear filters button
□ Optimize performance for large lists
```

### Phase 7: Polish & Testing (Priority: Low)
```
Tasks:
□ Add animations (fade in/out)
□ Add loading states
□ Add empty states
□ Add error boundaries
□ Write unit tests
□ Performance optimization
```

---

## 10. Technical Considerations

### 10.1 Performance

```
Optimization Strategies:
- Virtual scrolling for tables > 50 rows (react-window)
- Debounce search input (300ms)
- Memoize filtered/sorted data (useMemo)
- Lazy load asset details on row expand
- WebSocket for real-time index updates
- Service worker for offline support
```

### 10.2 Accessibility

```
WCAG 2.1 AA Requirements:
- Keyboard navigation for all actions
- ARIA labels for icon buttons
- Focus indicators on interactive elements
- Screen reader announcements for updates
- Color contrast ratios > 4.5:1
- Skip links for table navigation
```

### 10.3 Error Handling

```typescript
// Error types
enum WatchlistError {
  ASSET_NOT_FOUND = 'Asset not found',
  ALREADY_IN_WATCHLIST = 'Already in watchlist',
  WATCHLIST_FULL = 'Watchlist limit reached',
  NETWORK_ERROR = 'Network connection failed',
  UNAUTHORIZED = 'User not authenticated'
}

// Error handling
try {
  await addToWatchlist(ticker, assetType);
} catch (error) {
  if (error.code === 'ALREADY_IN_WATCHLIST') {
    toast.info(`${ticker} is already in your watchlist`);
  } else {
    toast.error('Failed to add to watchlist. Please try again.');
  }
}
```

---

## 11. Future Enhancements

### v1.1 Features
- Multiple watchlists (e.g., "Tech Stocks", "Crypto Portfolio")
- Watchlist sharing via public URL
- Price alerts for watchlist items
- Customizable columns (show/hide)
- Export watchlist to CSV/JSON

### v1.2 Features
- Real-time WebSocket updates
- Historical performance comparison
- Watchlist performance analytics
- Drag-and-drop reordering
- Notes/tags for each asset

### v2.0 Features
- Social features (follow other watchlists)
- AI-powered stock recommendations
- Integration with brokerage accounts
- Advanced charting within watchlist
- Mobile app with push notifications

---

## 12. Success Criteria

### Functional Requirements
- ✅ Display 5 market indexes with real-time updates
- ✅ Show asset type for each watchlist item
- ✅ Support add/remove operations
- ✅ Enable filtering by asset type
- ✅ Enable sorting by any column
- ✅ Persist watchlist across sessions

### Non-Functional Requirements
- ✅ Page load time < 2 seconds
- ✅ Add/remove operations < 500ms
- ✅ Support 100+ assets without lag
- ✅ Mobile responsive design
- ✅ Accessibility score > 95 (Lighthouse)

### User Experience
- ✅ Intuitive add/remove workflow
- ✅ Clear visual feedback for actions
- ✅ Minimal clicks to accomplish tasks
- ✅ Consistent with existing design system
- ✅ Error messages are helpful and actionable

---

**Design Document Complete**
**Ready for Implementation**
**Estimated Development Time: 3-4 days**
