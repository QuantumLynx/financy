import { StockData } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockHeaderProps {
    stock: StockData;
}

export function StockHeader({ stock }: StockHeaderProps) {
    const isPositive = stock.change >= 0;

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <div className="flex items-baseline gap-4">
                    <h1 className="text-4xl font-bold text-white">{stock.ticker}</h1>
                    <span className="text-xl text-slate-400">{stock.name}</span>
                </div>
                <p className="text-slate-500 mt-1">{stock.sector}</p>
            </div>

            <div className="text-right">
                <div className="text-4xl font-bold text-white">${stock.price.toFixed(2)}</div>
                <div className={cn(
                    "flex items-center justify-end gap-1 mt-1 font-semibold",
                    isPositive ? "text-emerald-500" : "text-red-500"
                )}>
                    {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    <span>{stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)</span>
                </div>
            </div>
        </div>
    );
}
