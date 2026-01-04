"use client";

import { MarketIndex } from '@/lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketIndexCardProps {
  index: MarketIndex;
}

export function MarketIndexCard({ index }: MarketIndexCardProps) {
  const isPositive = index.change >= 0;

  return (
    <div className="bg-card-dark border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
      {/* Index Name */}
      <div className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">
        {index.name}
      </div>

      {/* Current Value */}
      <div className="text-white text-3xl font-bold tabular-nums mb-3">
        {index.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp size={18} className="text-bullish" />
        ) : (
          <TrendingDown size={18} className="text-bearish" />
        )}
        <div className={cn(
          "text-lg font-semibold tabular-nums",
          isPositive ? "text-bullish" : "text-bearish"
        )}>
          {isPositive ? '+' : ''}{index.change.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
        <div className={cn(
          "text-sm tabular-nums",
          isPositive ? "text-bullish/70" : "text-bearish/70"
        )}>
          ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}
