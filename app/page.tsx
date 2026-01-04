import { MOCK_STOCKS } from '@/lib/mockData';
import { StockCard } from '@/components/dashboard/StockCard';

export default function Home() {
  const stocks = Object.values(MOCK_STOCKS);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
        <p className="text-slate-400">Track your favorite companies and fundamental data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <StockCard key={stock.ticker} stock={stock} />
        ))}
      </div>

      {/* Placeholder for future sections */}
      <div className="mt-12 bg-card-dark p-8 rounded-xl border border-slate-800 text-center">
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Detailed Analysis</h2>
        <p className="text-slate-500">Select a stock above to view detailed charts and fundamental data.</p>
      </div>
    </div>
  );
}
