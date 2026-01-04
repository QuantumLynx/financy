import { MOCK_INDEXES } from '@/lib/mockData';
import { IndexCard } from '@/components/dashboard/IndexCard';
import { LiveStockSearch } from '@/components/dashboard/LiveStockSearch';
import { Activity, TrendingUp } from 'lucide-react';

export default function Home() {
  const indexes = MOCK_INDEXES;
  const majorIndexes = indexes.slice(0, 4); // SPX, NASDAQ, DOW, RUSSELL

  return (
    <div className="min-h-screen space-y-3 animate-fade-in">
      {/* Hero Header */}
      <div className="relative">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-5 right-1/4 w-48 h-48 bg-bullish/5 rounded-full blur-3xl" />
        </div>

        <div className="space-y-1">
          {/* Main title */}
          <div className="flex items-center gap-2">
            <Activity className="text-accent" size={20} />
            <h1
              className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              MARKET COMMAND CENTER
            </h1>
          </div>

          {/* Subtitle with live indicator */}
          <div className="flex items-center gap-2 pl-7">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-bullish/10 border border-bullish/30 rounded">
              <div className="w-1 h-1 rounded-full bg-bullish animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-bullish uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Track major market indexes and discover opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Major Indexes Grid */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2
              className="text-base font-bold text-white mb-0.5 tracking-tight"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              MAJOR INDEXES
            </h2>
            <p className="text-slate-400 text-[10px] font-mono">
              Live market performance across key benchmarks
            </p>
          </div>
          <TrendingUp className="text-accent" size={18} />
        </div>

        {/* Uniform 4-column grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {majorIndexes.map((index, i) => (
            <IndexCard
              key={index.id}
              index={index}
              size="medium"
              variant={i === 0 ? "primary" : "secondary"}
            />
          ))}
        </div>
      </section>

      {/* Additional Indexes */}
      {indexes.length > 4 && (
        <section>
          <div className="mb-2">
            <h2
              className="text-sm font-bold text-white mb-0.5 tracking-tight"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              COMMODITIES & CRYPTO
            </h2>
            <p className="text-slate-400 text-[10px] font-mono">
              Precious metals and cryptocurrency market performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {indexes.slice(4).map((index) => (
              <IndexCard key={index.id} index={index} size="small" variant="secondary" />
            ))}
          </div>
        </section>
      )}

      {/* Live Stock Search */}
      <section>
        <div className="mb-2">
          <h2
            className="text-sm font-bold text-white mb-0.5 tracking-tight"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            DISCOVER STOCKS
          </h2>
          <p className="text-slate-400 text-[10px] font-mono">
            Search stocks, ETFs, and cryptocurrencies
          </p>
        </div>
        <LiveStockSearch />
      </section>
    </div>
  );
}
