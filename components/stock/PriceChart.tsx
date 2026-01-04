"use client";

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChartContainer } from '@/components/charts/ChartContainer';
import {
  generateMockPriceData,
  generateMockCandlestickData,
  toLineData,
  toCandlestickData,
  filterByTimeRange,
} from '@/lib/chartUtils';
import { TimeRange } from '@/components/charts/ChartControls';
import { ChartType } from '@/components/charts/TradingViewChart';

interface PriceChartProps {
    ticker: string;
    currentPrice: number;
    change: number;
    changePercent: string;
}

export function PriceChart({ ticker, currentPrice, change, changePercent }: PriceChartProps) {
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate mock data (memoized to prevent regeneration on every render)
    const mockData = useMemo(() => {
        // Determine number of days based on time range
        const daysMap: Record<TimeRange, number> = {
            '1D': 1,
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365,
            'ALL': 365 * 5, // 5 years
        };

        const days = daysMap[selectedTimeRange] || 365;

        // Generate both candlestick and price data
        return generateMockCandlestickData(currentPrice, change, days);
    }, [currentPrice, change, selectedTimeRange]);

    // Convert to TradingView format based on chart type
    const chartData = useMemo(() => {
        // For area/line charts, use toLineData
        // For candlestick, we'll let ChartContainer handle the conversion
        return toLineData(mockData);
    }, [mockData]);

    const candlestickData = useMemo(() => {
        return toCandlestickData(mockData);
    }, [mockData]);

    const isPositive = change >= 0;

    // Handle time range change
    const handleTimeRangeChange = (range: TimeRange) => {
        setSelectedTimeRange(range);
    };

    return (
        <div className="bg-card-dark border border-slate-800 rounded-xl p-6">
            {/* Price Header */}
            <div className="mb-6">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white tabular-nums">
                        ${currentPrice.toFixed(2)}
                    </span>
                    <div className={cn(
                        "flex items-center gap-1 text-lg font-semibold",
                        isPositive ? "text-bullish" : "text-bearish"
                    )}>
                        <span className="tabular-nums">{isPositive ? '+' : ''}{change.toFixed(2)}</span>
                        <span>({changePercent}%)</span>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                    Post Market: <span className="text-slate-300">${currentPrice.toFixed(2)}</span>
                    {' '}
                    <span className={isPositive ? "text-bullish" : "text-bearish"}>
                        {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)
                    </span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                    Fri Jan 3 2026 {new Date().toLocaleTimeString('en-US')}
                </p>
            </div>

            {/* Chart with Controls */}
            {isMounted ? (
                <ChartContainerWithDynamicData
                    lineData={chartData}
                    candlestickData={candlestickData}
                    selectedTimeRange={selectedTimeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                />
            ) : (
                <div className="w-full h-[400px] bg-slate-900/50 rounded animate-pulse" />
            )}
        </div>
    );
}

// Wrapper component to handle chart type switching with proper data
function ChartContainerWithDynamicData({
    lineData,
    candlestickData,
    selectedTimeRange,
    onTimeRangeChange,
}: {
    lineData: any[];
    candlestickData: any[];
    selectedTimeRange: TimeRange;
    onTimeRangeChange: (range: TimeRange) => void;
}) {
    const [chartType, setChartType] = useState<ChartType>('area');

    // Select appropriate data based on chart type
    const data = chartType === 'candlestick' ? candlestickData : lineData;

    const handleChartTypeChange = (type: ChartType) => {
        setChartType(type);
    };

    return (
        <ChartContainer
            data={data}
            timeRange={selectedTimeRange}
            chartType={chartType}
            height={400}
            showControls={true}
            showGrid={true}
            showTimeScale={true}
            showPriceScale={true}
            onTimeRangeChange={onTimeRangeChange}
            onChartTypeChange={handleChartTypeChange}
        />
    );
}
