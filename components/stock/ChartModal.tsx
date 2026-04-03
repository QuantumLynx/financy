"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartSeries {
    key: string;
    label: string;
    color: string;
}

interface ChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    series: ChartSeries[];
    annualData: any[];
    quarterlyData: any[];
    showReferenceLine?: boolean;
}

export function ChartModal({
    isOpen,
    onClose,
    title,
    description,
    series,
    annualData,
    quarterlyData,
    showReferenceLine = false,
}: ChartModalProps) {
    const [period, setPeriod] = useState<'annual' | 'quarterly'>('annual');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const data = period === 'annual' ? annualData : quarterlyData;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
                    <p className="text-sm text-slate-400 mb-2 font-semibold">{label}</p>
                    {payload.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 mb-1.5">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-300 min-w-[140px]">{item.name}:</span>
                            <span className="text-base font-bold text-accent tabular-nums">
                                {item.value?.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-slate-300 font-medium">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-[95vw] h-[90vh] max-w-[1400px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-800">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                        {description && <p className="text-slate-400">{description}</p>}
                    </div>

                    {/* Period Toggle */}
                    <div className="flex items-center gap-4 mx-6">
                        <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
                            <button
                                onClick={() => setPeriod('annual')}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                    period === 'annual'
                                        ? "bg-accent text-slate-950 font-semibold"
                                        : "text-slate-400 hover:text-slate-200"
                                )}
                            >
                                Annual
                            </button>
                            <button
                                onClick={() => setPeriod('quarterly')}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                                    period === 'quarterly'
                                        ? "bg-accent text-slate-950 font-semibold"
                                        : "text-slate-400 hover:text-slate-200"
                                )}
                            >
                                Quarterly
                            </button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                        aria-label="Close modal"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>

                {/* Chart Area */}
                <div className="flex-1 p-8 overflow-auto">
                    <div className="h-full w-full min-h-[500px]">
                        {isMounted ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} barGap={series.length > 1 ? 6 : 0}>
                                    <XAxis
                                        dataKey="period"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                                        tickLine={false}
                                        angle={period === 'quarterly' ? -45 : 0}
                                        textAnchor={period === 'quarterly' ? 'end' : 'middle'}
                                        height={period === 'quarterly' ? 80 : 50}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                                        tickLine={false}
                                        tickFormatter={(value) => {
                                            if (Math.abs(value) >= 1000) {
                                                return `${(value / 1000).toFixed(1)}k`;
                                            }
                                            return value.toLocaleString();
                                        }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={<CustomLegend />} />
                                    {showReferenceLine && (
                                        <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" strokeWidth={2} />
                                    )}
                                    {series.map((s) => (
                                        <Bar
                                            key={s.key}
                                            dataKey={s.key}
                                            name={s.label}
                                            fill={s.color}
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={series.length === 1 ? 80 : 60}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full bg-slate-900/50 rounded animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
