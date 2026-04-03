'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ColorType,
  LineStyle,
  CandlestickData,
  LineData,
  AreaData,
  UTCTimestamp,
} from 'lightweight-charts';

export type ChartType = 'area' | 'line' | 'candlestick';
export type TimeSeriesData = CandlestickData | LineData | AreaData;

interface TradingViewChartProps {
  data: TimeSeriesData[];
  chartType?: ChartType;
  height?: number;
  showGrid?: boolean;
  showTimeScale?: boolean;
  showPriceScale?: boolean;
}

export function TradingViewChart({
  data,
  chartType = 'area',
  height = 400,
  showGrid = true,
  showTimeScale = true,
  showPriceScale = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);

    // Create chart with terminal color scheme
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8', // slate-400
      },
      grid: {
        vertLines: {
          color: showGrid ? '#1e293b' : 'transparent', // slate-800
          style: LineStyle.Solid,
        },
        horzLines: {
          color: showGrid ? '#1e293b' : 'transparent', // slate-800
          style: LineStyle.Solid,
        },
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          color: '#00d9ff', // cyan accent
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#00d9ff',
        },
        horzLine: {
          color: '#00d9ff', // cyan accent
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#00d9ff',
        },
      },
      timeScale: {
        visible: showTimeScale,
        borderColor: '#334155', // slate-700
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        visible: showPriceScale,
        borderColor: '#334155', // slate-700
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    // Create series based on chart type
    let series: ISeriesApi<any>;

    if (chartType === 'candlestick') {
      series = chart.addCandlestickSeries({
        upColor: '#00ff41', // bullish green
        downColor: '#ff004d', // bearish red
        borderUpColor: '#00ff41',
        borderDownColor: '#ff004d',
        wickUpColor: '#00ff41',
        wickDownColor: '#ff004d',
      });
    } else if (chartType === 'line') {
      series = chart.addLineSeries({
        color: '#00d9ff', // cyan accent
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: '#00d9ff',
        crosshairMarkerBackgroundColor: '#0a0e14',
      });
    } else {
      // area chart (default)
      series = chart.addAreaSeries({
        topColor: 'rgba(0, 217, 255, 0.4)', // cyan with opacity
        bottomColor: 'rgba(0, 217, 255, 0.0)',
        lineColor: '#00d9ff', // cyan accent
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: '#00d9ff',
        crosshairMarkerBackgroundColor: '#0a0e14',
      });
    }

    // Set data
    series.setData(data);

    // Fit content to viewport
    chart.timeScale().fitContent();

    // Store references
    chartRef.current = chart;
    seriesRef.current = series;
    setIsLoading(false);

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [data, chartType, height, showGrid, showTimeScale, showPriceScale]);

  return (
    <div className="relative w-full">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-card-dark/50 backdrop-blur-sm z-10"
          style={{ height }}
        >
          <div className="text-slate-400 text-sm">Loading chart...</div>
        </div>
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
