"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricOption {
    key: string;
    label: string;
    color: string;
}

interface MetricFilterProps {
    options: MetricOption[];
    selectedKeys: string[];
    onSelectionChange: (keys: string[]) => void;
    label?: string;
}

export function MetricFilter({
    options,
    selectedKeys,
    onSelectionChange,
    label = "Filter Metrics"
}: MetricFilterProps) {
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

    const toggleMetric = (key: string) => {
        if (selectedKeys.includes(key)) {
            // Don't allow deselecting if it's the last one
            if (selectedKeys.length > 1) {
                onSelectionChange(selectedKeys.filter(k => k !== key));
            }
        } else {
            onSelectionChange([...selectedKeys, key]);
        }
    };

    const selectAll = () => {
        onSelectionChange(options.map(opt => opt.key));
    };

    const clearAll = () => {
        // Keep at least one selected
        onSelectionChange([options[0].key]);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 transition-all"
            >
                <span>{label}</span>
                <span className="text-xs text-slate-400 tabular-nums">
                    ({selectedKeys.length}/{options.length})
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "transition-transform text-slate-400",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 animate-fade-in">
                    {/* Header with actions */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Select Metrics
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

                    {/* Options list */}
                    <div className="max-h-80 overflow-y-auto py-2">
                        {options.map((option) => {
                            const isSelected = selectedKeys.includes(option.key);
                            const isLastSelected = selectedKeys.length === 1 && isSelected;

                            return (
                                <button
                                    key={option.key}
                                    onClick={() => toggleMetric(option.key)}
                                    disabled={isLastSelected}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/50 transition-colors text-left",
                                        isLastSelected && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {/* Color indicator */}
                                    <div
                                        className="w-3 h-3 rounded-sm flex-shrink-0"
                                        style={{ backgroundColor: option.color }}
                                    />

                                    {/* Label */}
                                    <span className="flex-1 text-sm text-slate-200">
                                        {option.label}
                                    </span>

                                    {/* Checkmark */}
                                    {isSelected && (
                                        <Check size={16} className="text-accent flex-shrink-0" />
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
