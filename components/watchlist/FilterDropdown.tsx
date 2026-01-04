"use client";

import { useState, useRef, useEffect } from 'react';
import { Filter, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssetType } from '@/lib/mockData';

interface FilterDropdownProps {
  selectedTypes: AssetType[];
  onFilterChange: (types: AssetType[]) => void;
}

const ASSET_TYPE_OPTIONS = [
  { type: AssetType.STOCK, label: 'Stocks', color: 'text-blue-400' },
  { type: AssetType.ETF, label: 'ETFs', color: 'text-purple-400' },
  { type: AssetType.CRYPTO, label: 'Crypto', color: 'text-orange-400' },
  { type: AssetType.INDEX, label: 'Indexes', color: 'text-cyan-400' },
];

export function FilterDropdown({ selectedTypes, onFilterChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleType = (type: AssetType) => {
    if (selectedTypes.includes(type)) {
      // Don't allow deselecting all types
      if (selectedTypes.length > 1) {
        onFilterChange(selectedTypes.filter(t => t !== type));
      }
    } else {
      onFilterChange([...selectedTypes, type]);
    }
  };

  const selectAll = () => {
    onFilterChange(ASSET_TYPE_OPTIONS.map(opt => opt.type));
  };

  const clearAll = () => {
    // Keep at least one selected
    onFilterChange([AssetType.STOCK]);
  };

  const isFiltered = selectedTypes.length < ASSET_TYPE_OPTIONS.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          isFiltered
            ? "bg-accent/10 text-accent border border-accent/30"
            : "bg-slate-800/50 text-slate-200 border border-slate-700 hover:bg-slate-800"
        )}
      >
        <Filter size={16} />
        <span>Filter</span>
        {isFiltered && (
          <span className="text-xs bg-accent/20 px-1.5 py-0.5 rounded tabular-nums">
            {selectedTypes.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Asset Types
            </span>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-accent hover:text-accent/80 font-medium"
              >
                All
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={clearAll}
                className="text-xs text-slate-400 hover:text-slate-200 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="py-2">
            {ASSET_TYPE_OPTIONS.map((option) => {
              const isSelected = selectedTypes.includes(option.type);
              const isLastSelected = selectedTypes.length === 1 && isSelected;

              return (
                <button
                  key={option.type}
                  onClick={() => toggleType(option.type)}
                  disabled={isLastSelected}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/50 transition-colors text-left",
                    isLastSelected && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center",
                    isSelected
                      ? "bg-accent/20 border-accent"
                      : "border-slate-600"
                  )}>
                    {isSelected && <Check size={12} className="text-accent" />}
                  </div>

                  {/* Label */}
                  <span className={cn("flex-1 text-sm", option.color)}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
