"use client";

import { StockData } from '@/lib/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StockInfoSidebarProps {
    stock: StockData;
}

interface CollapsibleSectionProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-slate-800/50 transition-colors"
            >
                <span className="text-sm font-semibold text-slate-300">{title}</span>
                {isOpen ? (
                    <ChevronUp size={16} className="text-slate-500" aria-hidden="true" />
                ) : (
                    <ChevronDown size={16} className="text-slate-500" aria-hidden="true" />
                )}
            </button>
            {isOpen && (
                <div className="px-4 pb-3 space-y-2 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
}

function DataRow({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs text-slate-400">{label}</span>
            <span className={cn(
                "text-sm font-semibold tabular-nums",
                highlight ? "text-accent" : "text-slate-200"
            )}>
                {value}
            </span>
        </div>
    );
}

export function StockInfoSidebar({ stock }: StockInfoSidebarProps) {
    // Mock financial data - in real app, this would come from API
    const financials = {
        marketCap: stock.marketCap,
        pe: stock.peRatio,
        fwdPE: 28.07,
        fwdPEG: 0.94,
        priceToCF: 19.92,
    };

    const yields = {
        earningsYield: 3.12,
        cashFlowYield: 5.02,
        freeCashFlowYield: 4.55,
        dividendYield: 'N/A',
        payoutRatio: 'N/A',
    };

    const balances = {
        totalCash: '$28.54B',
        totalDebt: '$2.44B',
        netCashPosition: '$26.11B',
    };

    const margins = {
        grossMargin: 43.04,
        operatingMargin: 26.26,
        netIncomeMargin: 18.67,
    };

    return (
        <aside className="w-[280px] bg-card-dark border-r border-slate-800 h-full overflow-y-auto sticky top-16">
            {/* Stock Header */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{stock.ticker[0]}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white font-display">{stock.ticker}</h2>
                        <p className="text-xs text-slate-400">{stock.name}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-xs text-slate-500">
                        <span>Sector: </span>
                        <span className="text-slate-400">{stock.sector || 'Unknown'}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                        <span>Industry: </span>
                        <span className="text-slate-400">{stock.sector || 'Unknown'}</span>
                    </div>
                </div>
            </div>

            {/* Collapsible Sections */}
            <div>
                <CollapsibleSection title="Financials" defaultOpen={true}>
                    <DataRow label="Market Cap" value={financials.marketCap} highlight />
                    <DataRow label="P/E" value={financials.pe} />
                    <DataRow label="FWD P/E" value={financials.fwdPE} />
                    <DataRow label="FWD PEG" value={financials.fwdPEG} />
                    <DataRow label="P/CF" value={financials.priceToCF} />
                </CollapsibleSection>

                <CollapsibleSection title="Yields" defaultOpen={true}>
                    <DataRow label="Earnings Yield" value={`${yields.earningsYield}%`} />
                    <DataRow label="Cash Flow Yield" value={`${yields.cashFlowYield}%`} />
                    <DataRow label="Free Cash Flow Yield" value={`${yields.freeCashFlowYield}%`} />
                    <DataRow label="Dividend Yield" value={yields.dividendYield} />
                    <DataRow label="Payout Ratio" value={yields.payoutRatio} />
                </CollapsibleSection>

                <CollapsibleSection title="Balances" defaultOpen={true}>
                    <DataRow label="Total Cash" value={balances.totalCash} highlight />
                    <DataRow label="Total Debt" value={balances.totalDebt} />
                    <DataRow label="Net Cash Position" value={balances.netCashPosition} />
                </CollapsibleSection>

                <CollapsibleSection title="Margins" defaultOpen={true}>
                    <DataRow label="Gross Margin" value={`${margins.grossMargin}%`} highlight />
                    <DataRow label="Operating Margin" value={`${margins.operatingMargin}%`} />
                    <DataRow label="Net Income Margin" value={`${margins.netIncomeMargin}%`} />
                </CollapsibleSection>
            </div>
        </aside>
    );
}
