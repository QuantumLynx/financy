"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StockData } from '@/lib/mockData';
import { AssetTypeBadge } from './AssetTypeBadge';

interface SearchBarProps {
  allAssets: StockData[];
  onAddAsset?: (ticker: string) => void;
  placeholder?: string;
}

export function SearchBar({ allAssets, onAddAsset, placeholder = "Search stocks, ETFs, crypto..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter assets based on search query
  const filteredAssets = query.trim().length > 0
    ? allAssets.filter(asset =>
        asset.ticker.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Limit to 8 results
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleSelectAsset = (ticker: string) => {
    if (onAddAsset) {
      onAddAsset(ticker);
    }
    setQuery('');
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredAssets.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredAssets.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredAssets.length) {
          handleSelectAsset(filteredAssets[focusedIndex].ticker);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filteredAssets.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 animate-fade-in max-h-96 overflow-y-auto">
          {filteredAssets.map((asset, index) => {
            const isFocused = index === focusedIndex;
            const inWatchlist = asset.isInWatchlist;

            return (
              <button
                key={asset.ticker}
                onClick={() => handleSelectAsset(asset.ticker)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                  isFocused ? "bg-slate-800" : "hover:bg-slate-800/50",
                  inWatchlist && "opacity-60"
                )}
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-sm font-mono">
                    {asset.ticker.substring(0, 1)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white font-mono text-sm">
                      {asset.ticker}
                    </span>
                    <AssetTypeBadge type={asset.assetType} />
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {asset.name}
                  </div>
                </div>

                {/* Add Button */}
                {!inWatchlist ? (
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <Plus size={14} />
                    <span>Add</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">In watchlist</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length > 0 && filteredAssets.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 animate-fade-in px-4 py-6 text-center">
          <p className="text-sm text-slate-400">No assets found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
