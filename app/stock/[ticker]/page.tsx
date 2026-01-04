"use client";

import { MOCK_STOCKS } from '@/lib/mockData';
import { StockInfoSidebar } from '@/components/stock/StockInfoSidebar';
import { PriceChart } from '@/components/stock/PriceChart';
import { IncomeTab } from '@/components/stock/tabs/IncomeTab';
import { BalanceTab } from '@/components/stock/tabs/BalanceTab';
import { CashFlowTab } from '@/components/stock/tabs/CashFlowTab';
import { EstimatesTab } from '@/components/stock/tabs/EstimatesTab';
import { RatiosTab } from '@/components/stock/tabs/RatiosTab';
import { AnalysisTabs } from '@/components/dashboard/AnalysisTabs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function StockPage() {
    const params = useParams();
    const ticker = (params.ticker as string)?.toUpperCase();
    const stock = MOCK_STOCKS[ticker];
    const [activeTab, setActiveTab] = useState('income');

    if (!stock) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                <h2 className="text-2xl font-bold mb-2">Stock Not Found</h2>
                <p>Could not find data for ticker: {ticker}</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden animate-fade-in">
            {/* Left Sidebar */}
            <StockInfoSidebar stock={stock} />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto p-6 space-y-6">
                    {/* Price Chart */}
                    <PriceChart
                        ticker={stock.ticker}
                        currentPrice={stock.price}
                        change={stock.change}
                        changePercent={stock.changePercent}
                    />

                    {/* Tab Navigation & Content */}
                    <div className="bg-card-dark border border-slate-800 rounded-xl p-6">
                        <AnalysisTabs activeTab={activeTab} onTabChange={setActiveTab} />

                        <div className="mt-6">
                            {activeTab === 'income' && <IncomeTab stock={stock} />}

                            {activeTab === 'balance' && <BalanceTab stock={stock} />}

                            {activeTab === 'cashflow' && <CashFlowTab stock={stock} />}

                            {activeTab === 'estimates' && <EstimatesTab stock={stock} />}

                            {activeTab === 'ratios' && <RatiosTab stock={stock} />}

                            {/* Placeholders for other tabs */}
                            {['reports', 'compare', 'score', 'valuation'].includes(activeTab) && (
                                <div className="h-[300px] flex items-center justify-center text-slate-500">
                                    <p className="text-lg">Analysis for {activeTab} coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
