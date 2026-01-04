"use client";

import { MOCK_STOCKS } from '@/lib/mockData';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  // Mock portfolio holdings
  const holdings = [
    { ...MOCK_STOCKS['AAPL'], shares: 50, avgCost: 180.00 },
    { ...MOCK_STOCKS['MSFT'], shares: 30, avgCost: 360.00 },
  ];

  const totalValue = holdings.reduce((acc, h) => acc + (h.price * h.shares), 0);
  const totalCost = holdings.reduce((acc, h) => acc + (h.avgCost * h.shares), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-slate-400">Track your investments and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-2">Total Value</div>
          <div className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-2">Total Cost</div>
          <div className="text-2xl font-bold text-slate-300">${totalCost.toLocaleString()}</div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-2">Total Gain/Loss</div>
          <div className={cn(
            "text-2xl font-bold",
            totalGain >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-sm mb-2">Return</div>
          <div className={cn(
            "text-2xl font-bold flex items-center gap-2",
            Number(totalGainPercent) >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {Number(totalGainPercent) >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
            {Number(totalGainPercent) >= 0 ? '+' : ''}{totalGainPercent}%
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-card-dark rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Holdings</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors">
            <PlusCircle size={20} />
            Add Position
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr className="text-left text-slate-400 text-sm">
                <th className="p-4 font-semibold">Symbol</th>
                <th className="p-4 font-semibold">Shares</th>
                <th className="p-4 font-semibold">Avg Cost</th>
                <th className="p-4 font-semibold">Current Price</th>
                <th className="p-4 font-semibold">Market Value</th>
                <th className="p-4 font-semibold">Gain/Loss</th>
                <th className="p-4 font-semibold">Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {holdings.map((holding) => {
                const marketValue = holding.price * holding.shares;
                const costBasis = holding.avgCost * holding.shares;
                const gainLoss = marketValue - costBasis;
                const returnPercent = ((gainLoss / costBasis) * 100).toFixed(2);
                const isPositive = gainLoss >= 0;

                return (
                  <tr key={holding.ticker} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <Link href={`/stock/${holding.ticker}`} className="hover:text-emerald-400 transition-colors">
                        <div className="font-bold text-white">{holding.ticker}</div>
                        <div className="text-xs text-slate-400">{holding.name}</div>
                      </Link>
                    </td>
                    <td className="p-4 text-slate-300">{holding.shares}</td>
                    <td className="p-4 text-slate-300">${holding.avgCost.toFixed(2)}</td>
                    <td className="p-4 text-white font-semibold">${holding.price.toFixed(2)}</td>
                    <td className="p-4 text-white font-semibold">${marketValue.toFixed(2)}</td>
                    <td className={cn(
                      "p-4 font-semibold",
                      isPositive ? "text-emerald-500" : "text-red-500"
                    )}>
                      {isPositive ? '+' : ''}${gainLoss.toFixed(2)}
                    </td>
                    <td className={cn(
                      "p-4 font-bold",
                      isPositive ? "text-emerald-500" : "text-red-500"
                    )}>
                      {isPositive ? '+' : ''}{returnPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Asset Allocation</h2>
          <div className="space-y-3">
            {holdings.map((holding) => {
              const value = holding.price * holding.shares;
              const percentage = ((value / totalValue) * 100).toFixed(1);

              return (
                <div key={holding.ticker}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">{holding.ticker}</span>
                    <span className="text-sm font-semibold text-white">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
              <span className="text-slate-400">Today's Change</span>
              <span className="text-emerald-500 font-bold">+$234.50</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
              <span className="text-slate-400">1 Week</span>
              <span className="text-emerald-500 font-bold">+2.3%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
              <span className="text-slate-400">1 Month</span>
              <span className="text-emerald-500 font-bold">+5.7%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded">
              <span className="text-slate-400">YTD</span>
              <span className="text-emerald-500 font-bold">+12.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
