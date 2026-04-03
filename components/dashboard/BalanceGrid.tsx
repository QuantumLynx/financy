"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FundamentalModal } from './FundamentalModal';

interface BalanceGridProps {
    stock: StockData;
}

const BALANCE_METRICS = [
    {
        id: 'shortTerm',
        label: 'Short-term Position',
        series: [
            { key: 'currentAssets', label: 'Current Assets', color: '#3b82f6' }, // Blue
            { key: 'currentLiabilities', label: 'Current Liabilities', color: '#ef4444' } // Red
        ]
    },
    {
        id: 'structure',
        label: 'Total Structure',
        series: [
            { key: 'totalAssets', label: 'Total Assets', color: '#3b82f6' },
            { key: 'totalLiabilities', label: 'Total Liabilities', color: '#ef4444' }
        ]
    },
    {
        id: 'debt',
        label: 'Debt vs Liquidity',
        series: [
            { key: 'totalDebt', label: 'Total Debt', color: '#ef4444' }, // Red
            { key: 'cashAndShortTermInvestments', label: 'Cash & Short-Term', color: '#10b981' } // Green
        ]
    }
];

export function BalanceGrid({ stock }: BalanceGridProps) {
    const [selectedMetric, setSelectedMetric] = useState<typeof BALANCE_METRICS[number] | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const previewData = stock.fundamentals.annual.slice(-5);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BALANCE_METRICS.map((metric) => (
                    <div
                        key={metric.id}
                        className="card-hover bg-card-dark p-5 rounded-xl border border-slate-800 group relative cursor-pointer"
                        onClick={() => setSelectedMetric(metric)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-semibold text-slate-200">{metric.label}</h3>
                                <div className="flex gap-2">
                                    {metric.series.map(s => (
                                        <div key={s.key} className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                                            <span className="text-[10px] text-slate-500">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 size={16} />
                            </button>
                        </div>

                        <div className="h-[150px] w-full">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={previewData}>
                                        <XAxis dataKey="period" hide />
                                        {metric.series.map(s => (
                                            <Bar
                                                key={s.key}
                                                dataKey={s.key}
                                                fill={s.color}
                                                radius={[2, 2, 0, 0]}
                                                barSize={12} // Thinner bars for grouped
                                            />
                                        ))}
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
                    series={selectedMetric.series}
                    title={selectedMetric.label}
                    onClose={() => setSelectedMetric(null)}
                />
            )}
        </>
    );
}
