"use client";

import { StockData } from '@/lib/mockData';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RatiosTabProps {
    stock: StockData;
}

const RATIO_METRICS = [
    { key: 'currentRatio', label: 'Current Ratio', color: '#00d9ff', description: 'Liquidity measure' },
    { key: 'quickRatio', label: 'Quick Ratio', color: '#3b82f6', description: 'Short-term liquidity' },
    { key: 'debtToEquity', label: 'Debt to Equity', color: '#ef4444', description: 'Leverage ratio' },
    { key: 'returnOnEquity', label: 'Return on Equity (%)', color: '#00ff41', description: 'Profitability ratio' },
    { key: 'returnOnAssets', label: 'Return on Assets (%)', color: '#00ff41', description: 'Asset efficiency' },
    { key: 'assetTurnover', label: 'Asset Turnover', color: '#f97316', description: 'Revenue efficiency' },
    { key: 'operatingMargin', label: 'Operating Margin (%)', color: '#00ff41', description: 'Operating efficiency' },
    { key: 'freeCashFlow', label: 'Free Cash Flow', color: '#00d9ff', description: 'Cash generation' },
    { key: 'eps', label: 'Earnings Per Share', color: '#00ff41', description: 'Per-share earnings' },
] as const;

export function RatiosTab({ stock }: RatiosTabProps) {
    const [selectedMetric, setSelectedMetric] = useState<typeof RATIO_METRICS[number] | null>(null);
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
            <h2 className="text-xl font-bold text-white mb-1">Financial Ratios</h2>
            <p className="text-slate-500 text-sm mb-6">Key performance metrics and efficiency ratios over time</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RATIO_METRICS.map((metric) => {
                    // Get latest and previous values for trend
                    const latestValue = previewData[previewData.length - 1]?.[metric.key as keyof typeof previewData[0]];
                    const previousValue = previewData[previewData.length - 2]?.[metric.key as keyof typeof previewData[0]];
                    const trend = latestValue && previousValue
                        ? ((Number(latestValue) - Number(previousValue)) / Number(previousValue) * 100)
                        : 0;
                    const isPositive = trend >= 0;

                    return (
                        <div
                            key={metric.key}
                            className="card-hover bg-card-dark p-5 rounded-xl border border-slate-800 group relative cursor-pointer"
                            onClick={() => setSelectedMetric(metric)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: metric.color }} />
                                        <h3 className="text-sm font-semibold text-slate-200">{metric.label}</h3>
                                    </div>
                                    <p className="text-xs text-slate-500">{metric.description}</p>
                                </div>
                                <button
                                    className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Expand ${metric.label} chart`}
                                >
                                    <Maximize2 size={16} aria-hidden="true" />
                                </button>
                            </div>

                            {/* Current Value */}
                            <div className="mb-3">
                                <span className="text-2xl font-bold text-white tabular-nums">
                                    {latestValue ? Number(latestValue).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }) : 'N/A'}
                                </span>
                                {trend !== 0 && (
                                    <span className={`ml-2 text-sm font-semibold ${isPositive ? 'text-bullish' : 'text-bearish'}`}>
                                        {isPositive ? '+' : ''}{trend.toFixed(2)}%
                                    </span>
                                )}
                            </div>

                            <div className="h-[100px] w-full">
                                {isMounted ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={previewData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="period" hide />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey={metric.key}
                                                stroke={metric.color}
                                                strokeWidth={2}
                                                dot={{ fill: metric.color, r: 3 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full bg-slate-900/50 rounded animate-pulse" />
                                )}
                            </div>

                            <div className="mt-2 flex justify-between text-xs text-slate-500 font-mono">
                                <span>{previewData[0]?.period}</span>
                                <span>{previewData[previewData.length - 1]?.period}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal placeholder - could reuse ChartModal but with LineChart */}
        </>
    );
}
