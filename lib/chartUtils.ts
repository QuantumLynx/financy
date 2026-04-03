import { UTCTimestamp, CandlestickData, LineData } from 'lightweight-charts';

export interface PriceDataPoint {
  date: Date | string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

/**
 * Convert a Date to UTCTimestamp (seconds since epoch)
 */
export function dateToUTCTimestamp(date: Date | string): UTCTimestamp {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return Math.floor(dateObj.getTime() / 1000) as UTCTimestamp;
}

/**
 * Generate mock historical price data for a stock
 * @param currentPrice Current stock price
 * @param change Today's price change
 * @param days Number of days to generate
 * @param volatility Price volatility (0-1, default 0.02)
 */
export function generateMockPriceData(
  currentPrice: number,
  change: number,
  days: number = 100,
  volatility: number = 0.02
): PriceDataPoint[] {
  const data: PriceDataPoint[] = [];
  let price = currentPrice - Math.abs(change) * 50;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    date.setHours(0, 0, 0, 0); // Normalize to midnight

    // Random walk with slight upward bias
    const drift = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + drift, 0.01); // Ensure positive price

    data.push({
      date,
      price: Number(price.toFixed(2)),
    });
  }

  return data;
}

/**
 * Generate mock candlestick data for a stock
 * @param currentPrice Current stock price
 * @param change Today's price change
 * @param days Number of days to generate
 * @param volatility Intraday volatility (0-1, default 0.015)
 */
export function generateMockCandlestickData(
  currentPrice: number,
  change: number,
  days: number = 100,
  volatility: number = 0.015
): PriceDataPoint[] {
  const data: PriceDataPoint[] = [];
  let price = currentPrice - Math.abs(change) * 50;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    date.setHours(0, 0, 0, 0);

    // Generate OHLC with realistic relationships
    const open = price;
    const dailyMove = (Math.random() - 0.48) * volatility * price;
    const close = Math.max(open + dailyMove, 0.01);

    // High is above both open and close
    const maxOC = Math.max(open, close);
    const high = maxOC + Math.random() * volatility * price * 0.5;

    // Low is below both open and close
    const minOC = Math.min(open, close);
    const low = Math.max(minOC - Math.random() * volatility * price * 0.5, 0.01);

    // Volume (random between 1M and 10M)
    const volume = Math.floor(Math.random() * 9000000 + 1000000);

    data.push({
      date,
      price: close,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    // Update price for next iteration
    price = close;
  }

  return data;
}

/**
 * Convert price data to TradingView Line/Area format
 */
export function toLineData(data: PriceDataPoint[]): LineData[] {
  return data.map((point) => ({
    time: dateToUTCTimestamp(point.date),
    value: point.price || point.close || 0,
  }));
}

/**
 * Convert price data to TradingView Candlestick format
 */
export function toCandlestickData(data: PriceDataPoint[]): CandlestickData[] {
  return data.map((point) => {
    // If OHLC data exists, use it; otherwise generate from price
    const price = point.price || point.close || 0;
    const open = point.open ?? price;
    const high = point.high ?? price;
    const low = point.low ?? price;
    const close = point.close ?? price;

    return {
      time: dateToUTCTimestamp(point.date),
      open,
      high,
      low,
      close,
    };
  });
}

/**
 * Filter data by time range
 */
export function filterByTimeRange(
  data: PriceDataPoint[],
  range: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'
): PriceDataPoint[] {
  if (range === 'ALL') return data;

  const now = new Date();
  const cutoffDate = new Date(now);

  switch (range) {
    case '1D':
      cutoffDate.setDate(now.getDate() - 1);
      break;
    case '1W':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '1M':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case '3M':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case '6M':
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case '1Y':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return data.filter((point) => {
    const pointDate = typeof point.date === 'string' ? new Date(point.date) : point.date;
    return pointDate >= cutoffDate;
  });
}

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: PriceDataPoint[], period: number = 20): PriceDataPoint[] {
  const smaData: PriceDataPoint[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const average =
      slice.reduce((sum, point) => sum + (point.price || point.close || 0), 0) / period;

    smaData.push({
      date: data[i].date,
      price: Number(average.toFixed(2)),
    });
  }

  return smaData;
}
