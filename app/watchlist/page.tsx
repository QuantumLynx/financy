"use client";

import { useState, useMemo } from 'react';
import { MOCK_STOCKS, MOCK_INDEXES, AssetType } from '@/lib/mockData';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MarketIndexesSection } from '@/components/watchlist/MarketIndexesSection';
import { AssetTypeBadge } from '@/components/watchlist/AssetTypeBadge';
import { FilterDropdown } from '@/components/watchlist/FilterDropdown';
import { SortDropdown, SortField, SortOrder } from '@/components/watchlist/SortDropdown';
import { SearchBar } from '@/components/watchlist/SearchBar';
import { X } from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { useToast } from '@/lib/hooks/useToast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function WatchlistPage() {
  const { showToast } = useToast();

  // State management with localStorage persistence
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([
    AssetType.STOCK,
    AssetType.ETF,
    AssetType.CRYPTO,
    AssetType.INDEX
  ]);
  const [sortBy, setSortBy] = useState<SortField>('ticker');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Persist watchlist to localStorage
  const [watchlistTickers, setWatchlistTickers] = useLocalStorage<string[]>(
    'financy-watchlist',
    Object.values(MOCK_STOCKS).filter(s => s.isInWatchlist).map(s => s.ticker)
  );

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    ticker: string;
    name: string;
  }>({ isOpen: false, ticker: '', name: '' });

  // Get all available assets
  const allAssets = Object.values(MOCK_STOCKS);

  // Filter watchlist assets
  const watchlistAssets = useMemo(() => {
    return allAssets.filter(stock =>
      watchlistTickers.includes(stock.ticker) &&
      selectedTypes.includes(stock.assetType)
    );
  }, [watchlistTickers, selectedTypes, allAssets]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    const sorted = [...watchlistAssets];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'ticker':
          aValue = a.ticker;
          bValue = b.ticker;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'assetType':
          aValue = a.assetType;
          bValue = b.assetType;
          break;
        default:
          return 0;
      }

      // Handle string vs number comparison
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue - bValue;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return sorted;
  }, [watchlistAssets, sortBy, sortOrder]);

  // Add asset to watchlist
  const handleAddAsset = (ticker: string) => {
    if (!watchlistTickers.includes(ticker)) {
      const asset = allAssets.find(a => a.ticker === ticker);
      setWatchlistTickers([...watchlistTickers, ticker]);

      // Show success toast
      showToast(
        `${asset?.name || ticker} added to watchlist`,
        'success',
        3000
      );
    } else {
      // Show info toast if already in watchlist
      showToast(
        `${ticker} is already in your watchlist`,
        'info',
        3000
      );
    }
  };

  // Initiate remove with confirmation
  const handleRemoveAsset = (ticker: string) => {
    const asset = allAssets.find(a => a.ticker === ticker);
    setConfirmModal({
      isOpen: true,
      ticker,
      name: asset?.name || ticker,
    });
  };

  // Confirm and remove asset
  const confirmRemoveAsset = () => {
    const { ticker, name } = confirmModal;
    setWatchlistTickers(watchlistTickers.filter(t => t !== ticker));

    // Show success toast
    showToast(
      `${name} removed from watchlist`,
      'success',
      3000
    );

    // Close modal
    setConfirmModal({ isOpen: false, ticker: '', name: '' });
  };

  // Check if filters are active
  const isFiltered = selectedTypes.length < 4;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Watchlist</h1>
        <p className="text-slate-400 text-sm">Your personalized stock watchlist.</p>
      </div>

      {/* Market Indexes Section */}
      <MarketIndexesSection indexes={MOCK_INDEXES} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Bar */}
        <div className="flex-1 min-w-[300px]">
          <SearchBar
            allAssets={allAssets}
            onAddAsset={handleAddAsset}
          />
        </div>

        {/* Filter */}
        <FilterDropdown
          selectedTypes={selectedTypes}
          onFilterChange={setSelectedTypes}
        />

        {/* Sort */}
        <SortDropdown
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
        />
      </div>

      {/* Active Filter Chips */}
      {isFiltered && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Active filters:</span>
          {selectedTypes.map(type => (
            <div
              key={type}
              className="flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/30 text-accent rounded text-xs"
            >
              <span>{type}</span>
              <button
                onClick={() => {
                  if (selectedTypes.length > 1) {
                    setSelectedTypes(selectedTypes.filter(t => t !== type));
                  }
                }}
                className="hover:text-accent/80"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setSelectedTypes([AssetType.STOCK, AssetType.ETF, AssetType.CRYPTO, AssetType.INDEX])}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Watchlist Table */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        {/* Category Header */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <h2 className="text-lg font-semibold text-white">My Watchlist</h2>
              <span className="text-sm text-slate-400 tabular-nums">
                ({sortedAssets.length} {sortedAssets.length === 1 ? 'asset' : 'assets'})
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        {sortedAssets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Asset Type
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Symbol or Company name
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    1D Change
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    YTD %
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Operating Margin
                  </th>
                  <th className="text-right py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Net Income Margin
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map((stock) => {
                  const isPositive = stock.change >= 0;
                  // Use deterministic YTD % from stock data
                  const ytdPercent = stock.ytdChangePercent;
                  const ytdPositive = ytdPercent >= 0;

                  return (
                    <tr
                      key={stock.ticker}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Asset Type Badge */}
                      <td className="py-4 px-6">
                        <AssetTypeBadge type={stock.assetType} />
                      </td>

                      {/* Symbol / Company Name */}
                      <td className="py-4 px-4">
                        <Link href={`/stock/${stock.ticker}`} className="flex items-center gap-3">
                          {/* Logo placeholder */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-accent font-bold text-sm font-mono">
                              {stock.ticker.substring(0, 1)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white font-mono">{stock.ticker}</div>
                            <div className="text-xs text-slate-400 truncate max-w-[200px]">
                              {stock.name}
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Current Price */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className="font-bold text-white tabular-nums">
                            ${stock.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            ${(stock.price - stock.change).toFixed(2)}
                          </div>
                        </Link>
                      </td>

                      {/* 1D Change */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className={cn(
                            "font-semibold tabular-nums",
                            isPositive ? "text-bullish" : "text-bearish"
                          )}>
                            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                          <div className={cn(
                            "text-xs tabular-nums",
                            isPositive ? "text-bullish/70" : "text-bearish/70"
                          )}>
                            {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                          </div>
                        </Link>
                      </td>

                      {/* YTD % */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className={cn(
                            "font-semibold tabular-nums",
                            ytdPositive ? "text-bullish" : "text-bearish"
                          )}>
                            {ytdPositive ? '+' : ''}{ytdPercent.toFixed(2)}%
                          </div>
                          <div className={cn(
                            "text-xs tabular-nums",
                            ytdPositive ? "text-bullish/70" : "text-bearish/70"
                          )}>
                            {ytdPositive ? '+' : ''}${(stock.price * ytdPercent / (100 + ytdPercent)).toFixed(2)}
                          </div>
                        </Link>
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className="text-white font-medium tabular-nums">{stock.marketCap}</div>
                        </Link>
                      </td>

                      {/* Operating Margin */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className="text-white font-medium tabular-nums">
                            {stock.margins.operatingMargin > 0
                              ? `${stock.margins.operatingMargin.toFixed(2)}%`
                              : 'N/A'}
                          </div>
                        </Link>
                      </td>

                      {/* Net Income Margin */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/stock/${stock.ticker}`}>
                          <div className="text-white font-medium tabular-nums">
                            {stock.margins.netIncomeMargin > 0
                              ? `${stock.margins.netIncomeMargin.toFixed(2)}%`
                              : 'N/A'}
                          </div>
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleRemoveAsset(stock.ticker)}
                          className="text-slate-500 hover:text-bearish transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from watchlist"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Empty State
          <div className="px-6 py-12 text-center">
            <p className="text-slate-400 mb-2">No assets match your filters</p>
            <button
              onClick={() => setSelectedTypes([AssetType.STOCK, AssetType.ETF, AssetType.CRYPTO, AssetType.INDEX])}
              className="text-sm text-accent hover:text-accent/80 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, ticker: '', name: '' })}
        onConfirm={confirmRemoveAsset}
        title="Remove from Watchlist"
        message={`Are you sure you want to remove ${confirmModal.name} from your watchlist? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
