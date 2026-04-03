"use client";

import { StockData, EstimateDatapoint } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EstimatesTabProps {
    stock: StockData;
}

export function EstimatesTab({ stock }: EstimatesTabProps) {
    const renderEstimateTable = (
        title: string,
        data: EstimateDatapoint[],
        valueLabel: string
    ) => {
        // Reverse to show most recent first
        const sortedData = [...data].reverse();

        return (
            <div className="bg-card-dark border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Period
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Actual
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Estimate
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Difference
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Beat/Miss
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Analysts
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((row, index) => {
                                const isBeat = row.difference > 0;
                                const isRecent = index === 0;

                                return (
                                    <tr
                                        key={row.period}
                                        className={cn(
                                            "border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors",
                                            isRecent && "bg-slate-800/20"
                                        )}
                                    >
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-white font-mono">
                                                {row.period}
                                            </span>
                                            {isRecent && (
                                                <span className="ml-2 text-xs text-accent font-semibold">
                                                    LATEST
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm font-semibold text-white tabular-nums">
                                                {row.actual.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm text-slate-300 tabular-nums">
                                                {row.estimate.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span
                                                className={cn(
                                                    "text-sm font-semibold tabular-nums",
                                                    isBeat ? "text-bullish" : "text-bearish"
                                                )}
                                            >
                                                {isBeat ? '+' : ''}{row.difference.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isBeat ? (
                                                    <TrendingUp size={14} className="text-bullish" />
                                                ) : (
                                                    <TrendingDown size={14} className="text-bearish" />
                                                )}
                                                <span
                                                    className={cn(
                                                        "text-sm font-semibold tabular-nums",
                                                        isBeat ? "text-bullish" : "text-bearish"
                                                    )}
                                                >
                                                    {isBeat ? '+' : ''}{row.percentDiff.toFixed(2)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm text-slate-400 tabular-nums">
                                                {row.numAnalysts}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <>
            <h2 className="text-xl font-bold text-white mb-1">Earnings Estimates</h2>
            <p className="text-slate-500 text-sm mb-6">Analyst estimates vs actual reported results</p>

            <div className="space-y-6">
                {renderEstimateTable(
                    'EPS Estimates',
                    stock.estimates.eps,
                    'EPS'
                )}

                {renderEstimateTable(
                    'Revenue Estimates',
                    stock.estimates.revenue,
                    'Revenue'
                )}
            </div>
        </>
    );
}
