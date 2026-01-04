"use client";

import { StockData } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StockCardProps {
    stock: StockData;
}

export function StockCard({ stock }: StockCardProps) {
    const isPositive = stock.change >= 0;

    return (
        <Link href={`/stock/${stock.ticker}`}>
            <div className="card-hover bg-card-dark p-6 rounded-xl hover:bg-slate-900/80 border border-slate-800 cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{stock.ticker}</h3>
                        <p className="text-slate-400 text-sm">{stock.name}</p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 font-semibold px-2 py-1 rounded transition-all",
                        isPositive ? "bg-[#00ff41]/10 text-bullish" : "bg-[#ff004d]/10 text-bearish"
                    )}>
                        {isPositive ? <ArrowUpRight size={16} aria-hidden="true" /> : <ArrowDownRight size={16} aria-hidden="true" />}
                        <span>{stock.changePercent}%</span>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-2xl font-bold text-slate-100 tabular-nums">${stock.price.toFixed(2)}</span>
                        <span className={cn("ml-2 text-sm tabular-nums", isPositive ? "text-bullish" : "text-bearish")}>
                            {isPositive ? '+' : ''}{stock.change}
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500 tabular-nums">
                    <span>Cap: {stock.marketCap}</span>
                    <span>P/E: {stock.peRatio}</span>
                </div>
            </div>
        </Link>
    );
}
