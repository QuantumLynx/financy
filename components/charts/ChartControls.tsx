'use client';

import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, CandlestickChart } from 'lucide-react';
import { ChartType } from './TradingViewChart';

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface ChartControlsProps {
  timeRange: TimeRange;
  chartType: ChartType;
  onTimeRangeChange: (range: TimeRange) => void;
  onChartTypeChange: (type: ChartType) => void;
}

const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

const CHART_TYPES: { type: ChartType; icon: React.ReactNode; label: string }[] = [
  { type: 'area', icon: <BarChart3 size={16} />, label: 'Area' },
  { type: 'line', icon: <TrendingUp size={16} />, label: 'Line' },
  { type: 'candlestick', icon: <CandlestickChart size={16} />, label: 'Candles' },
];

export function ChartControls({
  timeRange,
  chartType,
  onTimeRangeChange,
  onChartTypeChange,
}: ChartControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Time Range Selector */}
      <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 rounded-lg p-1">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded transition-all',
              timeRange === range
                ? 'bg-accent text-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 rounded-lg p-1">
        {CHART_TYPES.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => onChartTypeChange(type)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all',
              chartType === type
                ? 'bg-accent text-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            )}
            title={label}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
