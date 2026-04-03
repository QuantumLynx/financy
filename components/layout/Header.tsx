"use client";

import { Search, Bell, User } from 'lucide-react';

export function Header() {
    return (
        <header className="h-16 bg-card-dark border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" size={18} aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search symbols (e.g., AAPL, TSLA)..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 transition-all focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-[#00d9ff]/20"
                        aria-label="Search stocks and symbols"
                        role="searchbox"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    className="text-slate-400 hover:text-accent p-2 hover:bg-slate-800 rounded-full transition-all hover:shadow-lg hover:shadow-[#00d9ff]/20"
                    aria-label="View notifications"
                >
                    <Bell size={20} aria-hidden="true" />
                </button>
                <button
                    className="flex items-center gap-2 text-slate-400 hover:text-white pl-2 transition-all"
                    aria-label="User account menu"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-slate-950">
                        <User size={18} aria-hidden="true" />
                    </div>
                </button>
            </div>
        </header>
    );
}
