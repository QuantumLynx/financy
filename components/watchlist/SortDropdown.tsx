"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortField =
  | 'ticker'
  | 'name'
  | 'price'
  | 'changePercent'
  | 'marketCap'
  | 'assetType';

export type SortOrder = 'asc' | 'desc';

interface SortDropdownProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const SORT_OPTIONS = [
  { field: 'ticker' as SortField, label: 'Symbol' },
  { field: 'name' as SortField, label: 'Company Name' },
  { field: 'price' as SortField, label: 'Current Price' },
  { field: 'changePercent' as SortField, label: '1D Change %' },
  { field: 'assetType' as SortField, label: 'Asset Type' },
];

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
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

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      // Toggle order if same field
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for new field
      onSortChange(field, 'desc');
    }
    setIsOpen(false);
  };

  const currentOption = SORT_OPTIONS.find(opt => opt.field === sortBy);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-200 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm font-medium transition-all"
      >
        <ArrowUpDown size={16} />
        <span>Sort: {currentOption?.label}</span>
        {sortOrder === 'asc' ? (
          <ArrowUp size={14} className="text-accent" />
        ) : (
          <ArrowDown size={14} className="text-accent" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sort By
            </span>
          </div>

          {/* Options */}
          <div className="py-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = option.field === sortBy;

              return (
                <button
                  key={option.field}
                  onClick={() => handleSort(option.field)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/50 transition-colors text-left"
                >
                  <span className={cn(
                    "text-sm",
                    isActive ? "text-accent font-medium" : "text-slate-200"
                  )}>
                    {option.label}
                  </span>

                  {isActive && (
                    sortOrder === 'asc' ? (
                      <ArrowUp size={14} className="text-accent" />
                    ) : (
                      <ArrowDown size={14} className="text-accent" />
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
