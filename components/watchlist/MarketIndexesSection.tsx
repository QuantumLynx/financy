"use client";

import { MarketIndex } from '@/lib/mockData';
import { MarketIndexCard } from './MarketIndexCard';

interface MarketIndexesSectionProps {
  indexes: MarketIndex[];
  loading?: boolean;
}

export function MarketIndexesSection({ indexes, loading = false }: MarketIndexesSectionProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-card-dark border border-slate-800 rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 w-20 bg-slate-700 rounded mb-3"></div>
            <div className="h-9 w-32 bg-slate-700 rounded mb-3"></div>
            <div className="h-6 w-28 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {indexes.map((index) => (
        <MarketIndexCard key={index.id} index={index} />
      ))}
    </div>
  );
}
