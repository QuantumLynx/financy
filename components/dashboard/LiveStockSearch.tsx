'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { MOCK_STOCKS, StockData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function LiveStockSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allStocks = Object.values(MOCK_STOCKS);

  // Filter stocks based on query
  const filteredStocks = query.trim()
    ? allStocks.filter(
        (stock) =>
          stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = filteredStocks.length > 0;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredStocks.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredStocks.length) % filteredStocks.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredStocks[selectedIndex]) {
            handleSelectStock(filteredStocks[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredStocks]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectStock = (stock: StockData) => {
    // In production, this would trigger backend data fetch
    router.push(`/stock/${stock.ticker}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Search input container */}
      <div className="relative group">
        {/* Animated border glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent via-bullish to-accent rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-500 group-focus-within:opacity-75" />

        {/* Input wrapper */}
        <div className="relative bg-slate-900 rounded-lg border-2 border-slate-700 group-focus-within:border-accent transition-all duration-300 overflow-hidden">
          {/* Scan line effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-[scan_3s_ease-in-out_infinite]" />

          <div className="flex items-center gap-2.5 p-2.5">
            {/* Search icon with pulse */}
            <div className="relative">
              <Search className="text-accent" size={16} />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-md animate-pulse" />
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search stocks, ETFs, or crypto... (e.g., AAPL, TSLA, BTC)"
              className="flex-1 bg-transparent text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />

            {/* Live indicator */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 border border-accent/30 rounded">
              <Zap size={10} className="text-accent animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-wider">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-4 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl shadow-accent/10 overflow-hidden">
            {hasResults ? (
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {/* Results header */}
                <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {filteredStocks.length} Result{filteredStocks.length !== 1 ? 's' : ''} Found
                  </span>
                </div>

                {/* Results list */}
                <div className="py-2">
                  {filteredStocks.map((stock, index) => {
                    const isPositive = stock.change >= 0;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={stock.ticker}
                        onClick={() => handleSelectStock(stock)}
                        className={cn(
                          'w-full px-6 py-4 flex items-center justify-between gap-4 transition-all duration-200 group/item',
                          isSelected
                            ? 'bg-accent/10 border-l-4 border-accent'
                            : 'hover:bg-slate-800/50 border-l-4 border-transparent'
                        )}
                      >
                        {/* Left: Stock info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Logo placeholder */}
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all',
                              isSelected
                                ? 'bg-accent text-slate-900 scale-110'
                                : 'bg-slate-800 text-accent group-hover/item:bg-accent/20'
                            )}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {stock.ticker.charAt(0)}
                          </div>

                          {/* Name and ticker */}
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-lg font-bold text-white"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              >
                                {stock.ticker}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded font-mono">
                                {stock.assetType}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400 truncate max-w-xs">
                              {stock.name}
                            </div>
                          </div>
                        </div>

                        {/* Center: Price */}
                        <div className="text-right">
                          <div
                            className="text-lg font-bold text-white tabular-nums"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            ${stock.price.toLocaleString()}
                          </div>
                          <div
                            className={cn(
                              'text-sm font-semibold tabular-nums',
                              isPositive ? 'text-bullish' : 'text-bearish'
                            )}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {isPositive ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>

                        {/* Right: Arrow */}
                        <div
                          className={cn(
                            'transition-all duration-200',
                            isSelected
                              ? 'text-accent translate-x-1'
                              : 'text-slate-600 group-hover/item:text-accent group-hover/item:translate-x-1'
                          )}
                        >
                          <ArrowRight size={20} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="text-slate-500 mb-2">No results found for "{query}"</div>
                <div className="text-xs text-slate-600 font-mono">
                  Try searching for: AAPL, TSLA, MSFT, BTC-USD
                </div>
              </div>
            )}

            {/* Keyboard hints */}
            {hasResults && (
              <div className="px-6 py-3 bg-slate-800/30 border-t border-slate-700 flex items-center gap-6 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => {
            setIsOpen(false);
            setQuery('');
          }}
        />
      )}
    </div>
  );
}
