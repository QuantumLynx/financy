"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FundamentalModal } from './FundamentalModal';

interface FundamentalGridProps {
    stock: StockData;
}

const METRICS = [
    { key: 'revenue', label: 'Total Revenues', color: '#ef4444' }, // Red (like reference)
    { key: 'operatingMargin', label: 'Operating Margin', color: '#f97316' }, // Orange
    { key: 'netIncome', label: 'Net Income', color: '#10b981' }, // Green
    { key: 'freeCashFlow', label: 'Free Cash Flow', color: '#3b82f6' }, // Blue
] as const;

export function FundamentalGrid({ stock }: FundamentalGridProps) {
    const [selectedMetric, setSelectedMetric] = useState<typeof METRICS[number] | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use annual data for preview, ensure chronological order (mock is generated 2015->2024 which is correct for charts)
    // We'll just show the last 5 years in the preview
    const previewData = stock.fundamentals.annual.slice(-5);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {METRICS.map((metric) => (
                    <div
                        key={metric.key}
                        className="card-hover bg-card-dark p-5 rounded-xl border border-slate-800 group relative cursor-pointer"
                        onClick={() => setSelectedMetric(metric)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: metric.color }} />
                                <h3 className="text-sm font-semibold text-slate-200">{metric.label}</h3>
                            </div>
                            <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 size={16} />
                            </button>
                        </div>

                        <div className="h-[150px] w-full">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={previewData}>
                                        {/* Minimal Chart for Preview */}
                                        <XAxis
                                            dataKey="period"
                                            hide
                                        />
                                        <Bar
                                            dataKey={metric.key}
                                            fill={metric.color}
                                            radius={[2, 2, 0, 0]}
                                            barSize={30}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-slate-900/50 rounded animate-pulse" />
                            )}
                        </div>

                        <div className="mt-2 flex justify-between text-xs text-slate-500 font-mono">
                            <span>{previewData[0].period}</span>
                            <span>{previewData[previewData.length - 1].period}</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMetric && (
                <FundamentalModal
                    stock={stock}
                    series={[{
                        key: selectedMetric.key,
                        label: selectedMetric.label,
                        color: selectedMetric.color
                    }]}
                    title={selectedMetric.label}
                    onClose={() => setSelectedMetric(null)}
                />
            )}
        </>
    );
}
