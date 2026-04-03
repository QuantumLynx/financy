"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChartModal } from '@/components/stock/ChartModal';

interface IncomeTabProps {
    stock: StockData;
}

const INCOME_METRICS = [
    { key: 'revenue', label: 'Total Revenues', color: '#ef4444' }, // Red
    { key: 'grossProfit', label: 'Gross Profit', color: '#f97316' }, // Orange
    { key: 'operatingIncome', label: 'Operating Income', color: '#00ff41' }, // Terminal green
    { key: 'netIncome', label: 'Net Income', color: '#00ff41' }, // Terminal green
    { key: 'eps', label: 'Earnings Per Share', color: '#00ff41' }, // Terminal green
    { key: 'sharesOutstanding', label: 'Shares Outstanding Diluted', color: '#3b82f6' }, // Blue
] as const;

export function IncomeTab({ stock }: IncomeTabProps) {
    const [selectedMetric, setSelectedMetric] = useState<typeof INCOME_METRICS[number] | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use last 5 years for preview
    const previewData = stock.fundamentals.annual.slice(-5);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className="text-sm font-bold text-accent tabular-nums">
                        {payload[0].value?.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <h2 className="text-xl font-bold text-white mb-1">Income Statement Analysis</h2>
            <p className="text-slate-500 text-sm mb-6">Revenue, profitability, and share statistics over time</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INCOME_METRICS.map((metric) => (
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
                            <button
                                className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Expand ${metric.label} chart`}
                            >
                                <Maximize2 size={16} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="h-[150px] w-full">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={previewData}>
                                        <XAxis dataKey="period" hide />
                                        <Tooltip content={<CustomTooltip />} />
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

            {/* Chart Modal */}
            {selectedMetric && (
                <ChartModal
                    isOpen={!!selectedMetric}
                    onClose={() => setSelectedMetric(null)}
                    title={selectedMetric.label}
                    description="Historical trend analysis"
                    series={[selectedMetric]}
                    annualData={stock.fundamentals.annual}
                    quarterlyData={stock.fundamentals.quarterly}
                />
            )}
        </>
    );
}
