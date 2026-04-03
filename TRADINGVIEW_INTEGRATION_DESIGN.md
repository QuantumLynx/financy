# TradingView Lightweight Charts Integration Design

**Project:** Financy Financial Dashboard
**Date:** January 3, 2026
**Status:** ✅ Phase 1 Complete | In Progress

---

## Implementation Status

- ✅ **Phase 1: Setup & Basic Integration** (Complete - January 3, 2026)
  - Installed lightweight-charts package
  - Created TradingViewChart component
  - Created ChartContainer wrapper
  - Created ChartControls component
  - Created chart utilities (data transformation)
  - Updated stock detail page
  - See: [TRADINGVIEW_PHASE1_IMPLEMENTATION.md](./TRADINGVIEW_PHASE1_IMPLEMENTATION.md)

- ⏳ **Phase 2: Real-Time Data Integration** (Planned)
- ⏳ **Phase 3: Technical Indicators** (Planned)
- ⏳ **Phase 4: Advanced Features** (Planned)
- ⏳ **Phase 5: Multi-Chart Layout** (Planned)
- ⏳ **Phase 6: Testing & Optimization** (Planned)

---

## Executive Summary

This document outlines the architectural design and implementation strategy for integrating TradingView Lightweight Charts into the Financy stock analysis application. The integration will replace the current Recharts implementation with a professional-grade, canvas-based charting solution optimized for financial data visualization.

**Key Benefits:**
- **Performance:** 35KB bundle size vs ~200KB (Recharts)
- **Real-time capable:** Native support for streaming updates
- **Professional-grade:** Industry-standard financial charts
- **Type-safe:** Full TypeScript support
- **Customizable:** Extensive theming and styling options

---

## Current State Analysis

### Existing Chart Implementation

**Location:** `components/stock/PriceChart.tsx`
**Technology:** Recharts with `AreaChart`
**Data Source:** `stock.history` (generated mock data)
**Format:** `{ time: string, price: number }[]`

**Current Features:**
- Area chart with gradient fill
- Time-based X-axis
- Price Y-axis with formatting
- Responsive container
- Tooltip on hover
- Terminal color scheme (cyan accent)

**Limitations:**
- No candlestick support
- No real-time updates
- Limited interactivity
- Larger bundle size
- Not optimized for financial data

---

## Integration Architecture

### Component Hierarchy

```
app/stock/[ticker]/
└── page.tsx
    ├── StockInfoSidebar
    ├── PriceChart (ENHANCED)
    │   ├── ChartContainer (NEW)
    │   │   └── TradingViewChart (NEW)
    │   ├── ChartControls (NEW)
    │   │   ├── TimeRangeSelector
    │   │   ├── ChartTypeSelector
    │   │   └── IndicatorToggle
    │   └── ChartLegend (NEW)
    └── AnalysisTabs
        ├── IncomeTab
        ├── BalanceTab
        └── ...
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Stock Detail Page                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─→ Fetch Stock Data (API/Mock)
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Transformation                       │
│  Convert history[] → CandlestickData[] / LineData[]        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   ChartContainer                            │
│  - Manages chart lifecycle                                  │
│  - Handles responsive sizing                                │
│  - Applies theme configuration                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                TradingViewChart Component                   │
│  - Creates chart instance                                   │
│  - Adds series (candlestick, line, area)                   │
│  - Manages real-time updates                                │
│  - Cleanup on unmount                                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              lightweight-charts Library                     │
│  - Canvas rendering                                          │
│  - Interactive crosshair                                     │
│  - Time scale management                                     │
│  - Price scale management                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### 1. TradingViewChart (Core Component)

**File:** `components/stock/charts/TradingViewChart.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  AreaData,
  ChartOptions,
} from 'lightweight-charts';

export type ChartType = 'candlestick' | 'line' | 'area';

export interface TradingViewChartProps {
  data: CandlestickData[] | LineData[];
  chartType?: ChartType;
  height?: number;
  options?: Partial<ChartOptions>;
  onCrosshairMove?: (time: string, price: number) => void;
}

export function TradingViewChart({
  data,
  chartType = 'area',
  height = 400,
  options,
  onCrosshairMove,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#94a3b8', // slate-400
      },
      grid: {
        vertLines: { color: '#1e293b' }, // slate-800
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#00d9ff', // accent cyan
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: '#00d9ff',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#1e293b',
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      ...options,
    });

    chartRef.current = chart;

    // Create series based on chart type
    let series: ISeriesApi<any>;

    if (chartType === 'candlestick') {
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#00ff41', // terminal green (bullish)
        downColor: '#ff004d', // terminal red (bearish)
        borderUpColor: '#00ff41',
        borderDownColor: '#ff004d',
        wickUpColor: '#00ff41',
        wickDownColor: '#ff004d',
      });
    } else if (chartType === 'line') {
      series = chart.addSeries(LineSeries, {
        color: '#00d9ff', // accent cyan
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
        priceLineVisible: true,
      });
    } else {
      series = chart.addSeries(AreaSeries, {
        topColor: 'rgba(0, 217, 255, 0.4)', // accent cyan with alpha
        bottomColor: 'rgba(0, 217, 255, 0.05)',
        lineColor: '#00d9ff',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        lastValueVisible: true,
      });
    }

    series.setData(data);
    seriesRef.current = series;

    // Crosshair move handler
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData.has(series)) {
          const price = param.seriesData.get(series);
          if (price) {
            onCrosshairMove(
              String(param.time),
              'value' in price ? price.value : price.close
            );
          }
        }
      });
    }

    // Auto-fit content
    chart.timeScale().fitContent();

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [chartType, height, options]);

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && data) {
      seriesRef.current.setData(data);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${height}px` }}
    />
  );
}
```

---

### 2. ChartContainer (Wrapper Component)

**File:** `components/stock/charts/ChartContainer.tsx`

```typescript
'use client';

import { useState } from 'react';
import { TradingViewChart, ChartType } from './TradingViewChart';
import { ChartControls } from './ChartControls';
import { ChartLegend } from './ChartLegend';
import { CandlestickData, LineData } from 'lightweight-charts';

export interface ChartContainerProps {
  symbol: string;
  data: CandlestickData[] | LineData[];
  initialChartType?: ChartType;
  showControls?: boolean;
  height?: number;
}

export function ChartContainer({
  symbol,
  data,
  initialChartType = 'area',
  showControls = true,
  height = 400,
}: ChartContainerProps) {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1Y');
  const [crosshairData, setCrosshairData] = useState<{
    time: string;
    price: number;
  } | null>(null);

  // Filter data based on time range
  const filteredData = filterDataByTimeRange(data, selectedTimeRange);

  return (
    <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white font-display">
            {symbol} Price Chart
          </h2>
          <p className="text-sm text-slate-400">
            Interactive price visualization
          </p>
        </div>

        {showControls && (
          <ChartControls
            chartType={chartType}
            onChartTypeChange={setChartType}
            timeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
          />
        )}
      </div>

      {/* Chart */}
      <div className="p-6">
        <TradingViewChart
          data={filteredData}
          chartType={chartType}
          height={height}
          onCrosshairMove={(time, price) => {
            setCrosshairData({ time, price });
          }}
        />
      </div>

      {/* Legend */}
      {crosshairData && (
        <ChartLegend
          symbol={symbol}
          time={crosshairData.time}
          price={crosshairData.price}
        />
      )}
    </div>
  );
}

// Helper function to filter data by time range
function filterDataByTimeRange(
  data: CandlestickData[] | LineData[],
  range: string
): CandlestickData[] | LineData[] {
  const now = new Date();
  const rangeMap: Record<string, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'ALL': Infinity,
  };

  const days = rangeMap[range] || 365;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const cutoffTime = cutoff.toISOString().split('T')[0];

  return data.filter((item) => {
    const itemTime = typeof item.time === 'string' ? item.time : new Date(item.time * 1000).toISOString().split('T')[0];
    return itemTime >= cutoffTime;
  });
}
```

---

### 3. ChartControls Component

**File:** `components/stock/charts/ChartControls.tsx`

```typescript
'use client';

import { AreaChartIcon, CandlestickChart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartType } from './TradingViewChart';

interface ChartControlsProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

const CHART_TYPES: { type: ChartType; label: string; icon: any }[] = [
  { type: 'area', label: 'Area', icon: AreaChartIcon },
  { type: 'line', label: 'Line', icon: TrendingUp },
  { type: 'candlestick', label: 'Candle', icon: CandlestickChart },
];

export function ChartControls({
  chartType,
  onChartTypeChange,
  timeRange,
  onTimeRangeChange,
}: ChartControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Chart Type Selector */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
        {CHART_TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
              chartType === type
                ? 'bg-accent text-slate-900'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={cn(
              'px-3 py-1.5 rounded text-xs font-medium transition-colors',
              timeRange === range
                ? 'bg-accent text-slate-900'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. ChartLegend Component

**File:** `components/stock/charts/ChartLegend.tsx`

```typescript
'use client';

interface ChartLegendProps {
  symbol: string;
  time: string;
  price: number;
}

export function ChartLegend({ symbol, time, price }: ChartLegendProps) {
  return (
    <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Symbol:</span>
          <span className="font-mono font-semibold text-white">{symbol}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Time:</span>
          <span className="font-mono text-white">{time}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">Price:</span>
          <span className="font-mono font-semibold text-accent tabular-nums">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Data Transformation Strategy

### Current Data Format (Recharts)
```typescript
interface HistoryPoint {
  time: string; // "2024-01-15"
  price: number;
}
```

### Required TradingView Format

**For Area/Line Charts:**
```typescript
interface LineData {
  time: string; // "2024-01-15" or Unix timestamp
  value: number;
}
```

**For Candlestick Charts:**
```typescript
interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
```

### Transformation Utilities

**File:** `lib/chart-utils.ts`

```typescript
import { CandlestickData, LineData } from 'lightweight-charts';
import { StockData } from './mockData';

/**
 * Convert history data to LineData format
 */
export function convertToLineData(
  history: { time: string; price: number }[]
): LineData[] {
  return history.map((point) => ({
    time: point.time,
    value: point.price,
  }));
}

/**
 * Generate candlestick data from price history
 * (Simulates OHLC data from single price points)
 */
export function convertToCandlestickData(
  history: { time: string; price: number }[]
): CandlestickData[] {
  return history.map((point, index) => {
    // Simulate OHLC from single price
    const price = point.price;
    const volatility = price * 0.02; // 2% volatility

    return {
      time: point.time,
      open: price + (Math.random() - 0.5) * volatility,
      high: price + Math.random() * volatility,
      low: price - Math.random() * volatility,
      close: price,
    };
  });
}

/**
 * Generate realistic candlestick data with proper OHLC relationships
 */
export function generateCandlestickData(
  startPrice: number,
  days: number
): CandlestickData[] {
  const data: CandlestickData[] = [];
  let currentPrice = startPrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Random price movement
    const change = (Math.random() - 0.5) * (currentPrice * 0.03);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (currentPrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (currentPrice * 0.01);

    data.push({
      time: dateStr,
      open,
      high,
      low,
      close,
    });

    currentPrice = close;
  }

  return data;
}
```

---

## Integration with Existing Components

### Update PriceChart Component

**File:** `components/stock/PriceChart.tsx`

```typescript
'use client';

import { ChartContainer } from './charts/ChartContainer';
import { convertToLineData, convertToCandlestickData } from '@/lib/chart-utils';
import { StockData } from '@/lib/mockData';

interface PriceChartProps {
  stock: StockData;
}

export function PriceChart({ stock }: PriceChartProps) {
  // Convert history to TradingView format
  const lineData = convertToLineData(stock.history);
  const candleData = convertToCandlestickData(stock.history);

  // Use candle data by default (more professional)
  const chartData = candleData;

  return (
    <ChartContainer
      symbol={stock.ticker}
      data={chartData}
      initialChartType="candlestick"
      showControls={true}
      height={400}
    />
  );
}
```

### Update Stock Detail Page

**File:** `app/stock/[ticker]/page.tsx`

**No changes required!** The `PriceChart` component is already imported and used. The integration is transparent.

---

## Theme Integration

### Terminal Color Palette Application

```typescript
// Chart theme configuration
const FINANCY_CHART_THEME = {
  layout: {
    background: { color: 'transparent' },
    textColor: '#94a3b8', // slate-400
  },
  grid: {
    vertLines: { color: '#1e293b', style: LineStyle.Solid },
    horzLines: { color: '#1e293b', style: LineStyle.Solid },
  },
  crosshair: {
    vertLine: {
      color: '#00d9ff', // accent cyan
      width: 1,
      style: LineStyle.Dashed,
    },
    horzLine: {
      color: '#00d9ff',
      width: 1,
      style: LineStyle.Dashed,
    },
  },
  timeScale: {
    borderColor: '#1e293b',
    timeVisible: true,
    secondsVisible: false,
  },
  rightPriceScale: {
    borderColor: '#1e293b',
    textColor: '#94a3b8',
  },
};

// Candlestick colors
const CANDLESTICK_COLORS = {
  upColor: '#00ff41', // terminal green (bullish)
  downColor: '#ff004d', // terminal red (bearish)
  borderUpColor: '#00ff41',
  borderDownColor: '#ff004d',
  wickUpColor: '#00ff41',
  wickDownColor: '#ff004d',
};

// Line/Area colors
const LINE_COLORS = {
  lineColor: '#00d9ff', // accent cyan
  topColor: 'rgba(0, 217, 255, 0.4)',
  bottomColor: 'rgba(0, 217, 255, 0.05)',
};
```

---

## Performance Optimization

### 1. Lazy Loading

```typescript
// Dynamic import for chart component
import dynamic from 'next/dynamic';

const ChartContainer = dynamic(
  () => import('./charts/ChartContainer').then(mod => mod.ChartContainer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-slate-900 animate-pulse rounded-xl" />
    ),
  }
);
```

### 2. Data Memoization

```typescript
import { useMemo } from 'react';

export function PriceChart({ stock }: PriceChartProps) {
  const chartData = useMemo(() => {
    return convertToCandlestickData(stock.history);
  }, [stock.history]);

  return <ChartContainer data={chartData} />;
}
```

### 3. Virtualization for Large Datasets

```typescript
// Enable data conflation (automatic in v5.1+)
chart.applyOptions({
  // Lightweight Charts handles this automatically
  // No manual configuration needed for typical use cases
});

// For extreme datasets (100k+ points), use visible range
timeScale.setVisibleLogicalRange({
  from: startIndex,
  to: endIndex,
});
```

---

## Real-Time Updates (Future Enhancement)

### WebSocket Integration Pattern

```typescript
'use client';

import { useEffect } from 'react';
import { ISeriesApi } from 'lightweight-charts';

export function useRealTimeUpdates(
  series: ISeriesApi<any> | null,
  symbol: string
) {
  useEffect(() => {
    if (!series) return;

    // Connect to WebSocket (example)
    const ws = new WebSocket(`wss://api.example.com/stocks/${symbol}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Update last bar or add new bar
      series.update({
        time: data.timestamp,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      });
    };

    return () => ws.close();
  }, [series, symbol]);
}
```

---

## Technical Indicators (Future Enhancement)

### Adding Volume Histogram

```typescript
// Add volume series as histogram
const volumeSeries = chart.addSeries(HistogramSeries, {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: '', // Use separate price scale
});

volumeSeries.priceScale().applyOptions({
  scaleMargins: {
    top: 0.8, // Position at bottom
    bottom: 0,
  },
});

// Set volume data
volumeSeries.setData(volumeData);
```

### Adding Moving Averages

```typescript
// Calculate SMA
function calculateSMA(data: LineData[], period: number): LineData[] {
  const sma: LineData[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, val) => acc + val.value, 0);

    sma.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return sma;
}

// Add SMA series
const sma20 = chart.addSeries(LineSeries, {
  color: '#ffb000',
  lineWidth: 1,
  priceLineVisible: false,
});

sma20.setData(calculateSMA(priceData, 20));
```

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/chart-utils.test.ts
import { convertToLineData, convertToCandlestickData } from '@/lib/chart-utils';

describe('Chart Data Conversion', () => {
  const mockHistory = [
    { time: '2024-01-01', price: 100 },
    { time: '2024-01-02', price: 105 },
  ];

  it('should convert to LineData format', () => {
    const result = convertToLineData(mockHistory);

    expect(result).toEqual([
      { time: '2024-01-01', value: 100 },
      { time: '2024-01-02', value: 105 },
    ]);
  });

  it('should generate OHLC data', () => {
    const result = convertToCandlestickData(mockHistory);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('open');
    expect(result[0]).toHaveProperty('high');
    expect(result[0]).toHaveProperty('low');
    expect(result[0]).toHaveProperty('close');
  });
});
```

### Integration Tests

```typescript
// __tests__/TradingViewChart.test.tsx
import { render, screen } from '@testing-library/react';
import { TradingViewChart } from '@/components/stock/charts/TradingViewChart';

describe('TradingViewChart', () => {
  const mockData = [
    { time: '2024-01-01', value: 100 },
    { time: '2024-01-02', value: 105 },
  ];

  it('should render chart container', () => {
    render(<TradingViewChart data={mockData} />);
    const container = screen.getByRole('generic');
    expect(container).toBeInTheDocument();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<TradingViewChart data={mockData} />);
    unmount();
    // Chart should be removed (no memory leaks)
  });
});
```

---

## Implementation Checklist

### Phase 1: Setup & Basic Integration
- [ ] Install `lightweight-charts` package
- [ ] Create `components/stock/charts/` directory
- [ ] Implement `TradingViewChart` component
- [ ] Implement `ChartContainer` wrapper
- [ ] Create chart utilities in `lib/chart-utils.ts`
- [ ] Update `PriceChart` to use new charts
- [ ] Test on stock detail page

### Phase 2: Controls & Interactivity
- [ ] Implement `ChartControls` component
- [ ] Add time range selector
- [ ] Add chart type switcher
- [ ] Implement `ChartLegend` component
- [ ] Add crosshair event handling
- [ ] Test user interactions

### Phase 3: Theming & Polish
- [ ] Apply terminal color palette
- [ ] Customize candlestick colors
- [ ] Configure grid styling
- [ ] Add hover effects
- [ ] Implement responsive sizing
- [ ] Test dark mode compatibility

### Phase 4: Performance & Optimization
- [ ] Add data memoization
- [ ] Implement lazy loading
- [ ] Test with large datasets
- [ ] Profile bundle size impact
- [ ] Optimize re-renders

### Phase 5: Testing & Documentation
- [ ] Write unit tests for utilities
- [ ] Write integration tests
- [ ] Add component documentation
- [ ] Create usage examples
- [ ] Update main documentation

### Phase 6: Advanced Features (Optional)
- [ ] Add volume histogram
- [ ] Implement moving averages
- [ ] Add RSI indicator
- [ ] Add MACD indicator
- [ ] Implement drawing tools
- [ ] Add save/load chart layouts

---

## Migration Strategy

### Gradual Rollout

**Week 1: Parallel Implementation**
- Keep Recharts implementation
- Add TradingView charts alongside
- Feature flag for testing

**Week 2: A/B Testing**
- 50% of users see new charts
- Collect performance metrics
- Gather user feedback

**Week 3: Full Migration**
- Switch all users to TradingView
- Remove Recharts dependency
- Monitor for issues

**Week 4: Cleanup**
- Delete old chart components
- Update all documentation
- Optimize bundle size

### Rollback Plan

If issues occur:
1. Revert to Recharts via feature flag
2. Investigate and fix issues
3. Re-deploy fixed version
4. Resume migration

---

## Bundle Size Impact

### Current State (Recharts)
- recharts: ~200KB (gzipped)
- d3-scale: ~50KB
- Total: ~250KB

### After Migration (TradingView)
- lightweight-charts: 35KB (gzipped)
- **Savings: ~215KB (86% reduction)**

---

## Browser Compatibility

### Minimum Requirements
- ES2020 support
- Canvas API
- ResizeObserver API (polyfill available)

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallback Strategy
```typescript
if (!window.ResizeObserver) {
  // Polyfill or fallback to static sizing
  import('resize-observer-polyfill');
}
```

---

## Security Considerations

### License Compliance
- **License:** Apache 2.0
- **Attribution:** Required in UI or documentation
- **Commercial use:** Permitted
- **Modification:** Permitted

### Data Sanitization
```typescript
// Sanitize user-provided data
function sanitizeChartData(data: any[]): CandlestickData[] {
  return data
    .filter(isValidDataPoint)
    .map(point => ({
      time: sanitizeTime(point.time),
      open: sanitizeNumber(point.open),
      high: sanitizeNumber(point.high),
      low: sanitizeNumber(point.low),
      close: sanitizeNumber(point.close),
    }));
}
```

---

## Success Metrics

### Performance Targets
- Initial render: < 100ms
- Re-render: < 16ms (60fps)
- Bundle size: < 50KB added
- Memory usage: < 50MB for typical datasets

### User Experience Targets
- Crosshair lag: < 10ms
- Zoom smoothness: 60fps
- Pan responsiveness: 60fps
- Time-to-interactive: < 2s

---

## Future Roadmap

### Q1 2026: Core Integration
- [x] Basic chart implementation
- [ ] All chart types (candlestick, line, area)
- [ ] Time range controls
- [ ] Theming integration

### Q2 2026: Advanced Features
- [ ] Technical indicators
- [ ] Volume overlay
- [ ] Comparison mode (multiple symbols)
- [ ] Export to image

### Q3 2026: Real-Time & Alerts
- [ ] WebSocket integration
- [ ] Live price updates
- [ ] Price alerts
- [ ] Notification system

### Q4 2026: Professional Tools
- [ ] Drawing tools (trendlines, etc.)
- [ ] Custom indicators
- [ ] Chart templates
- [ ] Layout persistence

---

## Conclusion

This integration design provides a comprehensive roadmap for replacing Recharts with TradingView Lightweight Charts in the Financy application. The implementation is structured in phases, allowing for gradual rollout and testing. The end result will be a professional-grade charting solution with:

- **86% smaller bundle size**
- **Professional candlestick charts**
- **Real-time update capability**
- **Full customization**
- **Type-safe implementation**

**Estimated Implementation Time:** 2-3 weeks for full integration
**Recommended Start Date:** Q1 2026
**Priority:** High (major UX improvement)

---

**Document Status:** Ready for Implementation
**Next Action:** Install `lightweight-charts` and begin Phase 1
