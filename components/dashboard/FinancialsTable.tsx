"use client";

import { StockData, FundamentalDatapoint } from '@/lib/mockData';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FinancialsTableProps {
    stock: StockData;
}

export function FinancialsTable({ stock }: FinancialsTableProps) {
    const [period, setPeriod] = useState<'quarterly' | 'annual'>('quarterly');
    const data = stock.fundamentals[period];

    return (
        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Financials</h3>
                <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
                    <button
                        onClick={() => setPeriod('quarterly')}
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            period === 'quarterly' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Quarterly
                    </button>
                    <button
                        onClick={() => setPeriod('annual')}
                        className={cn(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            period === 'annual' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                        )}
                    >
                        Annual
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="pb-3 font-semibold text-slate-400 text-left pl-4">Period</th>
                            <th className="pb-3 font-semibold text-slate-400 text-right">Revenue (B)</th>
                            <th className="pb-3 font-semibold text-slate-400 text-right">Net Income (B)</th>
                            <th className="pb-3 font-semibold text-slate-400 text-right pr-4">EPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: FundamentalDatapoint, index: number) => (
                            <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors last:border-0">
                                <td className="py-3 text-slate-200 font-medium pl-4">{item.period}</td>
                                <td className="py-3 text-right text-slate-300 font-mono">
                                    {item.revenue !== undefined ? `$${item.revenue.toFixed(1)}B` : '-'}
                                </td>
                                <td className="py-3 text-right text-slate-300 font-mono">
                                    {item.netIncome !== undefined ? `$${item.netIncome.toFixed(1)}B` : '-'}
                                </td>
                                <td className="py-3 text-right text-slate-300 font-mono pr-4">
                                    {item.eps !== undefined ? `$${item.eps.toFixed(2)}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
