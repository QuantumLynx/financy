"use client";

import { StockData } from '@/lib/mockData';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChartModal } from '@/components/stock/ChartModal';
import { MetricFilter } from '@/components/stock/MetricFilter';

interface CashFlowTabProps {
    stock: StockData;
}

const CASHFLOW_CHART_GROUPS = [
    {
        title: 'Cash Flow Breakdown',
        description: 'Operating, investing, and financing activities',
        series: [
            { key: 'operatingCashFlow', label: 'Operating Cash Flow', color: '#00ff41' }, // Green
            { key: 'investingCashFlow', label: 'Investing Cash Flow', color: '#ef4444' }, // Red
            { key: 'financingCashFlow', label: 'Financing Cash Flow', color: '#ffb000' }, // Amber
            { key: 'freeCashFlow', label: 'Free Cash Flow', color: '#00d9ff' }, // Cyan
        ]
    },
    {
        title: 'Operating Cash Flow vs Net Income',
        description: 'Cash generation compared to accounting profit',
        series: [
            { key: 'operatingCashFlow', label: 'Operating Cash Flow', color: '#00d9ff' }, // Cyan
            { key: 'netIncome', label: 'Net Income', color: '#00ff41' }, // Green
        ]
    },
] as const;

export function CashFlowTab({ stock }: CashFlowTabProps) {
    const [selectedChart, setSelectedChart] = useState<typeof CASHFLOW_CHART_GROUPS[number] | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
        'operatingCashFlow',
        'investingCashFlow',
        'financingCashFlow',
        'freeCashFlow'
    ]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Use last 5 years for preview
    const previewData = stock.fundamentals.annual.slice(-5);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    {payload.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-slate-300">{item.name}:</span>
                            <span className="text-sm font-bold text-accent tabular-nums">
                                {item.value?.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs text-slate-400">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Filter the first chart group's series based on selected metrics
    const getFilteredSeries = (chartGroup: typeof CASHFLOW_CHART_GROUPS[number], groupIndex: number) => {
        if (groupIndex === 0) {
            return chartGroup.series.filter(s => selectedMetrics.includes(s.key));
        }
        return chartGroup.series;
    };

    return (
        <>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">Cash Flow Analysis</h2>
                    <p className="text-slate-500 text-sm">Cash generation and usage across operating, investing, and financing activities</p>
                </div>
                <MetricFilter
                    options={CASHFLOW_CHART_GROUPS[0].series}
                    selectedKeys={selectedMetrics}
                    onSelectionChange={setSelectedMetrics}
                    label="Filter Metrics"
                />
            </div>

            <div className="space-y-6">
                {CASHFLOW_CHART_GROUPS.map((chartGroup, groupIndex) => {
                    const filteredSeries = getFilteredSeries(chartGroup, groupIndex);

                    return (
                    <div
                        key={groupIndex}
                        className="card-hover bg-card-dark p-6 rounded-xl border border-slate-800 group relative cursor-pointer"
                        onClick={() => setSelectedChart(chartGroup)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">{chartGroup.title}</h3>
                                <p className="text-sm text-slate-500">{chartGroup.description}</p>
                            </div>
                            <button
                                className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Expand ${chartGroup.title} chart`}
                            >
                                <Maximize2 size={18} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="h-[300px] w-full">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={previewData} barGap={4}>
                                        <XAxis
                                            dataKey="period"
                                            stroke="#64748b"
                                            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend content={<CustomLegend />} />
                                        <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                                        {filteredSeries.map((series) => (
                                            <Bar
                                                key={series.key}
                                                dataKey={series.key}
                                                name={series.label}
                                                fill={series.color}
                                                radius={[2, 2, 0, 0]}
                                                maxBarSize={50}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-slate-900/50 rounded animate-pulse" />
                            )}
                        </div>
                    </div>
                    );
                })}
            </div>

            {/* Chart Modal */}
            {selectedChart && (
                <ChartModal
                    isOpen={!!selectedChart}
                    onClose={() => setSelectedChart(null)}
                    title={selectedChart.title}
                    description={selectedChart.description}
                    series={
                        CASHFLOW_CHART_GROUPS.indexOf(selectedChart) === 0
                            ? selectedChart.series.filter(s => selectedMetrics.includes(s.key))
                            : selectedChart.series
                    }
                    annualData={stock.fundamentals.annual}
                    quarterlyData={stock.fundamentals.quarterly}
                    showReferenceLine={true}
                />
            )}
        </>
    );
}
