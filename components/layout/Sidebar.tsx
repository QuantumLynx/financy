"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, LineChart, PieChart, Newspaper, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Watchlist', href: '/watchlist', icon: LineChart },
    { name: 'Portfolio', href: '/portfolio', icon: PieChart },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={cn(
            "bg-card-dark border-r border-slate-800 transition-all duration-300 h-screen sticky top-0 flex flex-col z-40",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between">
                {!collapsed && <span className="text-xl font-bold font-display bg-gradient-to-r from-[#00ff41] to-[#00d9ff] bg-clip-text text-transparent tracking-tight">Financy</span>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!collapsed}
                >
                    <Menu size={20} aria-hidden="true" />
                </button>
            </div>

            <nav className="flex-1 py-4 flex flex-col gap-2 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-250",
                                isActive
                                    ? "bg-slate-800 text-accent shadow-lg shadow-[#00d9ff]/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:translate-x-1",
                                collapsed && "justify-center"
                            )}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={item.name}
                        >
                            <item.icon size={20} aria-hidden="true" />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
