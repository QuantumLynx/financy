"use client";

import { AssetType } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface AssetTypeBadgeProps {
  type: AssetType;
}

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

export function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const styles = ASSET_TYPE_STYLES[type];

  return (
    <div className={cn(
      "px-2 py-0.5 rounded text-xs font-medium border inline-block",
      styles.bg,
      styles.border,
      styles.text
    )}>
      {type}
    </div>
  );
}
