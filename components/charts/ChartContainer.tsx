'use client';

import { useState, useEffect } from 'react';
import { TradingViewChart, ChartType, TimeSeriesData } from './TradingViewChart';
import { ChartControls, TimeRange } from './ChartControls';

interface ChartContainerProps {
  data: TimeSeriesData[];
  initialTimeRange?: TimeRange;
  initialChartType?: ChartType;
  timeRange?: TimeRange;
  chartType?: ChartType;
  height?: number;
  showControls?: boolean;
  showGrid?: boolean;
  showTimeScale?: boolean;
  showPriceScale?: boolean;
  onTimeRangeChange?: (range: TimeRange) => void;
  onChartTypeChange?: (type: ChartType) => void;
}

export function ChartContainer({
  data,
  initialTimeRange = '1M',
  initialChartType = 'area',
  timeRange: controlledTimeRange,
  chartType: controlledChartType,
  height = 400,
  showControls = true,
  showGrid = true,
  showTimeScale = true,
  showPriceScale = true,
  onTimeRangeChange,
  onChartTypeChange,
}: ChartContainerProps) {
  const [internalTimeRange, setInternalTimeRange] = useState<TimeRange>(initialTimeRange);
  const [internalChartType, setInternalChartType] = useState<ChartType>(initialChartType);

  // Use controlled props if provided, otherwise use internal state
  const timeRange = controlledTimeRange ?? internalTimeRange;
  const chartType = controlledChartType ?? internalChartType;

  // Sync internal state when controlled props change
  useEffect(() => {
    if (controlledTimeRange !== undefined) {
      setInternalTimeRange(controlledTimeRange);
    }
  }, [controlledTimeRange]);

  useEffect(() => {
    if (controlledChartType !== undefined) {
      setInternalChartType(controlledChartType);
    }
  }, [controlledChartType]);

  const handleTimeRangeChange = (range: TimeRange) => {
    if (controlledTimeRange === undefined) {
      setInternalTimeRange(range);
    }
    onTimeRangeChange?.(range);
  };

  const handleChartTypeChange = (type: ChartType) => {
    if (controlledChartType === undefined) {
      setInternalChartType(type);
    }
    onChartTypeChange?.(type);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      {showControls && (
        <ChartControls
          timeRange={timeRange}
          chartType={chartType}
          onTimeRangeChange={handleTimeRangeChange}
          onChartTypeChange={handleChartTypeChange}
        />
      )}

      {/* Chart */}
      <div className="bg-card-dark rounded-xl border border-slate-800 p-4">
        <TradingViewChart
          data={data}
          chartType={chartType}
          height={height}
          showGrid={showGrid}
          showTimeScale={showTimeScale}
          showPriceScale={showPriceScale}
        />
      </div>
    </div>
  );
}
