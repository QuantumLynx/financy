'use client';

import { MarketIndex } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IndexCardProps {
  index: MarketIndex;
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary';
}

export function IndexCard({ index, size = 'medium', variant = 'secondary' }: IndexCardProps) {
  const [displayValue, setDisplayValue] = useState(index.value);
  const isPositive = index.change >= 0;

  // Animated number roller effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = (index.value - displayValue) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setDisplayValue((prev) => {
        const newValue = prev + increment;
        return currentStep >= steps ? index.value : newValue;
      });

      if (currentStep >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [index.value]);

  const sizeClasses = {
    large: 'p-3 lg:p-4',
    medium: 'p-3 lg:p-3.5',
    small: 'p-2.5 lg:p-3',
  };

  const valueSize = {
    large: 'text-2xl lg:text-3xl',
    medium: 'text-xl lg:text-2xl',
    small: 'text-lg lg:text-xl',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-500',
        sizeClasses[size],
        variant === 'primary'
          ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border-accent/40 shadow-[0_0_20px_rgba(0,217,255,0.15)] hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]'
          : 'bg-slate-900/60 border-slate-700/50 hover:border-accent/30 hover:bg-slate-900/80'
      )}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Glitch effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider">
        <Activity size={10} className="text-accent animate-pulse" />
        <span className="text-accent/80">LIVE</span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Symbol */}
        <div className="mb-1.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={cn(
                'font-mono font-bold tracking-tight',
                size === 'large' ? 'text-sm' : size === 'medium' ? 'text-sm' : 'text-xs',
                'text-white/90'
              )}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {index.symbol}
            </span>
            {isPositive ? (
              <TrendingUp className="text-bullish" size={14} />
            ) : (
              <TrendingDown className="text-bearish" size={14} />
            )}
          </div>
          <h3
            className={cn(
              'font-bold tracking-tight',
              'text-[10px]',
              'text-slate-400'
            )}
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {index.name}
          </h3>
        </div>

        {/* Value with number roller */}
        <div className="mb-1.5">
          <div
            className={cn(
              'font-bold tabular-nums tracking-tight',
              valueSize[size],
              'text-white'
            )}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {displayValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        {/* Change indicators */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div
            className={cn(
              'text-sm font-bold tabular-nums',
              isPositive ? 'text-bullish' : 'text-bearish'
            )}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {isPositive ? '+' : ''}
            {index.change.toFixed(2)}
          </div>
          <div
            className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums',
              isPositive
                ? 'bg-bullish/10 text-bullish border border-bullish/20'
                : 'bg-bearish/10 text-bearish border border-bearish/20'
            )}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {isPositive ? '+' : ''}
            {index.changePercent.toFixed(2)}%
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
          Updated: {new Date(index.updatedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-accent/5 to-transparent rounded-tl-full" />
    </div>
  );
}
