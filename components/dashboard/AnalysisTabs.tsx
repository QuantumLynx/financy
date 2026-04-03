"use client";

import { cn } from "@/lib/utils";
import { BarChart3, DollarSign, LineChart, FileText, PieChart, Target, Share2, Activity, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const TABS = [
    { id: 'income', label: 'Income', icon: BarChart3 },
    { id: 'balance', label: 'Balance', icon: DollarSign },
    { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'ratios', label: 'Ratios', icon: PieChart },
    { id: 'estimates', label: 'Estimates', icon: Target },
    { id: 'compare', label: 'Compare', icon: Share2 },
    { id: 'score', label: 'Score', icon: Activity },
    { id: 'valuation', label: 'Valuation', icon: LineChart },
];

interface AnalysisTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function AnalysisTabs({ activeTab, onTabChange }: AnalysisTabsProps) {

    return (
        <div className="flex items-center gap-1 border-b border-slate-800 mb-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex flex-col items-center gap-2 px-6 py-3 min-w-[100px] transition-all relative",
                            isActive ? "text-accent" : "text-slate-500 hover:text-slate-300"
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                        <span className="text-xs font-medium">{tab.label}</span>

                        {isActive && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_-2px_6px_rgba(0,217,255,0.4)]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
