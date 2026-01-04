"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Legend } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChartModal } from '@/components/stock/ChartModal';

interface BalanceTabProps {
    stock: StockData;
}

const BALANCE_CHART_GROUPS = [
    {
        title: 'Short-term Position',
        description: 'Liquidity and current obligations',
        series: [
            { key: 'cashAndShortTermInvestments', label: 'Cash & Short-Term', color: '#3b82f6' }, // Blue
            { key: 'currentAssets', label: 'Current Assets', color: '#00ff41' }, // Green
            { key: 'currentLiabilities', label: 'Current Liabilities', color: '#ef4444' }, // Red
        ]
    },
    {
        title: 'Total Structure',
        description: 'Overall financial position breakdown',
        series: [
            { key: 'totalAssets', label: 'Total Assets', color: '#3b82f6' }, // Blue
            { key: 'totalLiabilities', label: 'Total Liabilities', color: '#ef4444' }, // Red
            { key: 'totalEquity', label: 'Total Equity', color: '#00ff41' }, // Green
        ]
    },
    {
        title: 'Debt vs Liquidity',
        description: 'Debt obligations compared to available cash',
        series: [
            { key: 'totalDebt', label: 'Total Debt', color: '#ef4444' }, // Red
            { key: 'cashAndShortTermInvestments', label: 'Cash & Short-Term', color: '#00ff41' }, // Green
        ]
    },
] as const;

export function BalanceTab({ stock }: BalanceTabProps) {
    const [selectedChart, setSelectedChart] = useState<typeof BALANCE_CHART_GROUPS[number] | null>(null);
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
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    {payload.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-slate-300">{item.name}:</span>
                            <span className="text-sm font-bold text-accent tabular-nums">
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
            <div className="flex justify-center gap-4 mt-3">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-slate-400">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <h2 className="text-xl font-bold text-white mb-1">Balance Sheet Analysis</h2>
            <p className="text-slate-500 text-sm mb-6">Financial position breakdown - assets, liabilities, and equity structure</p>

            <div className="space-y-6">
                {BALANCE_CHART_GROUPS.map((chartGroup, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="card-hover bg-card-dark p-6 rounded-xl border border-slate-800 group relative cursor-pointer"
                        onClick={() => setSelectedChart(chartGroup)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">{chartGroup.title}</h3>
                                <p className="text-sm text-slate-500">{chartGroup.description}</p>
                            </div>
                            <button
                                className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Expand ${chartGroup.title} chart`}
                            >
                                <Maximize2 size={18} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="h-[300px] w-full">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={previewData} barGap={4}>
                                        <XAxis
                                            dataKey="period"
                                            stroke="#64748b"
                                            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend content={<CustomLegend />} />
                                        {chartGroup.series.map((series) => (
                                            <Bar
                                                key={series.key}
                                                dataKey={series.key}
                                                name={series.label}
                                                fill={series.color}
                                                radius={[2, 2, 0, 0]}
                                                maxBarSize={50}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-slate-900/50 rounded animate-pulse" />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Modal */}
            {selectedChart && (
                <ChartModal
                    isOpen={!!selectedChart}
                    onClose={() => setSelectedChart(null)}
                    title={selectedChart.title}
                    description={selectedChart.description}
                    series={selectedChart.series}
                    annualData={stock.fundamentals.annual}
                    quarterlyData={stock.fundamentals.quarterly}
                />
            )}
        </>
    );
}
