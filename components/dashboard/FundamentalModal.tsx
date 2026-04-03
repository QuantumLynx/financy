"use client";

import { StockData, FundamentalDatapoint } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalSeriesConfig {
    key: string;
    label: string;
    color: string;
}

interface FundamentalModalProps {
    stock: StockData;
    series: ModalSeriesConfig[];
    onClose: () => void;
    title: string;
}

export function FundamentalModal({ stock, series, onClose, title }: FundamentalModalProps) {
    const [range, setRange] = useState('5 Years');
    const [view, setView] = useState('Absolute');
    const [chartType, setChartType] = useState<'annual' | 'quarterly'>('annual');

    // Filter Data Logic
    const data = useMemo(() => {
        let rawData = [...stock.fundamentals[chartType]];

        if (chartType === 'quarterly') {
            rawData = [...rawData].reverse();
        }

        // Filter Range
        let count = rawData.length;
        if (range === '5 Years') {
            count = chartType === 'annual' ? 5 : 20;
        } else if (range === '10 Years') {
            count = chartType === 'annual' ? 10 : 40;
        }

        if (count > rawData.length) count = rawData.length;
        const sliced = rawData.slice(-count);

        return sliced.map((d, i, arr) => {
            const newItem: any = { ...d };

            // Process each series key
            series.forEach(s => {
                let val = (d as any)[s.key];

                if (view === 'YOY Growth') {
                    if (i === 0) {
                        val = 0;
                    } else {
                        const prev = (arr[i - 1] as any)[s.key];
                        if (prev) {
                            val = ((val - prev) / prev) * 100;
                        } else {
                            val = 0;
                        }
                    }
                } else if (view === 'As a % of Revenue') {
                    const revenue = d.revenue;
                    val = revenue ? (val / revenue) * 100 : 0;
                }
                newItem[s.key] = val;
            });

            return newItem;
        });

    }, [stock, chartType, range, view, series]);

    const formatYAxis = (val: number | undefined | null) => {
        if (val === undefined || val === null) return '-';
        if (view === 'YOY Growth' || view === 'As a % of Revenue') return `${val.toFixed(1)}%`;
        // Check if any series is a margin metric
        if (series.some(s => s.key.includes('Margin'))) return `${val.toFixed(1)}%`;

        return `$${val}B`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-5xl h-[600px] flex flex-col shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6 border-b border-slate-800 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {series.map(s => (
                                <div key={s.key} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-sm font-semibold text-slate-300">{s.label}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-600 text-lg mx-2">|</span>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500 font-medium ml-1">Select Range</label>
                            <div className="relative">
                                <select
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-emerald-500 appearance-none min-w-[120px]"
                                >
                                    <option>5 Years</option>
                                    <option>10 Years</option>
                                    <option>Max</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500 font-medium ml-1">View</label>
                            <select
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-emerald-500 appearance-none min-w-[140px]"
                            >
                                <option>Absolute</option>
                                <option>YOY Growth</option>
                                <option>As a % of Revenue</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500 font-medium ml-1">Chart Type</label>
                            <select
                                value={chartType}
                                onChange={(e) => setChartType(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 pr-8 focus:outline-none focus:border-emerald-500 appearance-none min-w-[120px]"
                            >
                                <option value="annual">Annually</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="period"
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: '#334155' }}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip
                                cursor={{ fill: '#1e293b', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#f1f5f9' }}
                                formatter={(value: any, name: any) => [
                                    formatYAxis(value),
                                    // Map key to label
                                    series.find(s => s.key === name)?.label || name
                                ]}
                            />
                            <Legend />
                            {series.map(s => (
                                <Bar
                                    key={s.key}
                                    dataKey={s.key}
                                    name={s.key}
                                    fill={s.color}
                                    radius={[4, 4, 0, 0]}
                                    barSize={series.length > 1 ? 20 : 60}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
