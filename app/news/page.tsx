"use client";

import { Newspaper, TrendingUp, AlertCircle, Clock } from 'lucide-react';

export default function NewsPage() {
  // Mock news data
  const newsItems = [
    {
      id: 1,
      title: "Tech Stocks Rally on Strong Earnings Reports",
      summary: "Major technology companies beat earnings expectations, driving market gains across the sector.",
      source: "Market Watch",
      time: "2 hours ago",
      category: "Market",
      ticker: "AAPL",
    },
    {
      id: 2,
      title: "Federal Reserve Signals Potential Rate Changes",
      summary: "Central bank officials hint at upcoming policy adjustments in response to economic data.",
      source: "Financial Times",
      time: "4 hours ago",
      category: "Economy",
      ticker: null,
    },
    {
      id: 3,
      title: "Tesla Announces New Production Targets",
      summary: "Electric vehicle manufacturer sets ambitious goals for the upcoming quarter.",
      source: "Bloomberg",
      time: "5 hours ago",
      category: "Company",
      ticker: "TSLA",
    },
    {
      id: 4,
      title: "Microsoft Cloud Revenue Surges in Q4",
      summary: "Azure platform shows strong growth as enterprise adoption accelerates.",
      source: "Reuters",
      time: "6 hours ago",
      category: "Company",
      ticker: "MSFT",
    },
    {
      id: 5,
      title: "Market Volatility Expected Ahead of Key Economic Data",
      summary: "Analysts predict increased trading activity as investors await inflation numbers.",
      source: "CNBC",
      time: "8 hours ago",
      category: "Analysis",
      ticker: null,
    },
  ];

  const categories = ["All", "Market", "Economy", "Company", "Analysis"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
        <p className="text-slate-400">Stay updated with the latest financial news and analysis</p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              category === "All"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Breaking News Banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <div className="text-red-500 font-semibold mb-1 flex items-center gap-2">
              <span>BREAKING NEWS</span>
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-slate-300">
              Major market indices reach new highs following positive economic indicators
            </p>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="bg-card-dark p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {news.ticker && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">
                      {news.ticker}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">
                    {news.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock size={12} />
                    {news.time}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {news.title}
                </h3>

                <p className="text-slate-400 text-sm mb-3">{news.summary}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Newspaper size={14} />
                  <span>{news.source}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-slate-600" size={32} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <button className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium">
          Load More News
        </button>
      </div>

      {/* Trending Topics */}
      <div className="bg-card-dark p-6 rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-500" />
          Trending Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Earnings Season", "Fed Policy", "Tech Stocks", "EV Market", "AI Innovation", "Crypto", "Inflation"].map((topic) => (
            <button
              key={topic}
              className="px-4 py-2 bg-slate-900/50 text-slate-300 rounded-full text-sm hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
