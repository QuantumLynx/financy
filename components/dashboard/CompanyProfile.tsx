import { StockData } from '@/lib/mockData';

interface CompanyProfileProps {
    stock: StockData;
}

export function CompanyProfile({ stock }: CompanyProfileProps) {
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="border-t border-slate-800 py-4 first:border-t-0">
            <h3 className="text-slate-400 text-sm font-semibold mb-3 flex justify-between items-center cursor-pointer hover:text-white transition-colors">
                {title}
                <span className="text-xs opacity-50">▲</span>
            </h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );

    const Row = ({ label, value }: { label: string, value: string | number | null }) => (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-200 font-mono">{value !== null ? value : 'N/A'}</span>
        </div>
    );

    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Stock Information</h2>
            <div className="text-slate-400 text-sm mb-6 leading-relaxed">
                {stock.description}
            </div>

            <Section title="Financials">
                <Row label="Market Cap" value={stock.marketCap} />
                <Row label="P/E Ratio" value={stock.peRatio} />
                <Row label="Sector" value={stock.sector} />
            </Section>

            {stock.yields && (
                <Section title="Yields">
                    <Row label="Earnings Yield" value={stock.yields.earningsYield ? `${stock.yields.earningsYield}%` : 'N/A'} />
                    <Row label="Cash Flow Yield" value={stock.yields.cashFlowYield ? `${stock.yields.cashFlowYield}%` : 'N/A'} />
                    <Row label="Free Cash Flow Yield" value={stock.yields.freeCashFlowYield ? `${stock.yields.freeCashFlowYield}%` : 'N/A'} />
                    <Row label="Dividend Yield" value={stock.yields.dividendYield ? `${stock.yields.dividendYield}%` : 'N/A'} />
                </Section>
            )}

            {stock.balances && (
                <Section title="Balances">
                    <Row label="Total Cash" value={stock.balances.totalCash} />
                    <Row label="Total Debt" value={stock.balances.totalDebt} />
                    <Row label="Net Cash Position" value={stock.balances.netCashPosition} />
                </Section>
            )}

            {stock.margins && (
                <Section title="Margins">
                    <Row label="Gross Margin" value={`${stock.margins.grossMargin}%`} />
                    <Row label="Operating Margin" value={`${stock.margins.operatingMargin}%`} />
                    <Row label="Net Income Margin" value={`${stock.margins.netIncomeMargin}%`} />
                </Section>
            )}
        </div>
    );
}
