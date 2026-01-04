"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FundamentalChartProps {
    stock: StockData;
}

type MetricType = 'revenue' | 'netIncome' | 'operatingMargin' | 'freeCashFlow';

const METRICS: { key: MetricType; label: string; color: string }[] = [
    { key: 'revenue', label: 'Revenue', color: '#3b82f6' }, // Blue
    { key: 'netIncome', label: 'Net Income', color: '#10b981' }, // Emerald
    { key: 'operatingMargin', label: 'Operating Margin', color: '#f59e0b' }, // Amber
    { key: 'freeCashFlow', label: 'Free Cash Flow', color: '#8b5cf6' }, // Violet
];

export function FundamentalChart({ stock }: FundamentalChartProps) {
    const [metric, setMetric] = useState<MetricType>('revenue');
    const [period, setPeriod] = useState<'quarterly' | 'annual'>('annual');

    // For charts we prefer chronological order
    const data = [...stock.fundamentals[period]]; // Already sorted chronologically in generateFundamentals?
    // Actually generateFundamentals pushes annually in linear order 2015->2024. 
    // But quarterly was reversed. Let's fix ordering if needed.
    // Assuming annual is sorted Ascending (2015...2024).

    // Sort by period if it's not strictly numeric (like Q1 2024), but for Annual it is.
    // Let's trust the generator order for now.

    const currentMetricConfig = METRICS.find(m => m.key === metric)!;

    return (
        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white">{stock.name} {currentMetricConfig.label}</h3>
                    <p className="text-slate-400 text-sm">{period === 'annual' ? 'Annual' : 'Quarterly'} financial performance</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex mr-4 h-fit">
                        <button
                            onClick={() => setPeriod('annual')}
                            className={cn("px-3 py-1 text-xs font-medium rounded transition-all", period === 'annual' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
                        >
                            Annual
                        </button>
                        <button
                            onClick={() => setPeriod('quarterly')}
                            className={cn("px-3 py-1 text-xs font-medium rounded transition-all", period === 'quarterly' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
                        >
                            Quarterly
                        </button>
                    </div>

                    <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex gap-1 h-fit overflow-x-auto">
                        {METRICS.map((m) => (
                            <button
                                key={m.key}
                                onClick={() => setMetric(m.key)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded transition-all whitespace-nowrap",
                                    metric === m.key ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="period"
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) =>
                                metric === 'operatingMargin' ? `${val}%` : `$${val}B`
                            }
                        />
                        <Tooltip
                            cursor={{ fill: '#1e293b', opacity: 0.5 }}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ color: '#f1f5f9' }}
                            formatter={(value: any) => [
                                metric === 'operatingMargin' ? `${value}%` : `$${value}B`,
                                currentMetricConfig.label
                            ]}
                        />
                        <Bar
                            dataKey={metric}
                            fill={currentMetricConfig.color}
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
