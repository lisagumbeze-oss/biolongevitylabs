"use client";

import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    ShoppingBag, 
    Users, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Download,
    Filter
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';

interface AnalyticsData {
    kpis: {
        revenue: { value: number; growth: number };
        orders: { value: number; growth: number };
        aov: { value: number; growth: number };
    };
    chartData: { date: string; revenue: number; orders: number }[];
    topProducts: { name: string; units: number; revenue: number }[];
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('30');
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics?period=${period}`);
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-400">Processing lab data...</p>
            </div>
        );
    }

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Research Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Laboratory performance metrics and growth insights.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                        {[
                            { label: '7D', value: '7' },
                            { label: '30D', value: '30' },
                            { label: '90D', value: '90' },
                        ].map((p) => (
                            <button 
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                    period === p.value 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { 
                        title: 'Total Revenue', 
                        value: formatCurrency(data?.kpis.revenue.value || 0), 
                        growth: data?.kpis.revenue.growth || 0,
                        icon: DollarSign,
                        color: 'from-blue-500 to-cyan-400'
                    },
                    { 
                        title: 'Total Orders', 
                        value: (data?.kpis.orders.value || 0).toString(), 
                        growth: data?.kpis.orders.growth || 0,
                        icon: ShoppingBag,
                        color: 'from-primary to-purple-500'
                    },
                    { 
                        title: 'Avg. Order Value', 
                        value: formatCurrency(data?.kpis.aov.value || 0), 
                        growth: data?.kpis.aov.growth || 0,
                        icon: TrendingUp,
                        color: 'from-emerald-500 to-teal-400'
                    }
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-200" /> : kpi.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-lg shadow-current/20`}>
                                <kpi.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${
                                kpi.growth >= 0 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-rose-500/10 text-rose-500'
                            }`}>
                                {kpi.growth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {Math.abs(kpi.growth).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">vs prev. period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Revenue Overview</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Daily laboratory sales performance</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Revenue</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {loading ? (
                            <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'black' }}
                                        formatter={(val: any) => [formatCurrency(val as number), 'Revenue']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Top Research Stacks</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Best performing compounds by revenue</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        {data?.topProducts.map((product, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate pr-4">{product.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{product.units} units sold</p>
                                    </div>
                                    <p className="text-sm font-black text-primary">{formatCurrency(product.revenue)}</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                                        style={{ width: `${(product.revenue / (data?.topProducts[0]?.revenue || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        {(!data?.topProducts || data.topProducts.length === 0) && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <BarChart3 className="w-12 h-12 text-slate-300 mb-2" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No data available for this period</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 py-3 text-xs font-black text-slate-500 hover:text-primary border border-slate-200 dark:border-slate-800 rounded-xl transition-all uppercase tracking-widest">
                        Full Inventory Report
                    </button>
                </div>
            </div>

            {/* Detailed Volume Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Volume</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Transaction frequency across the research timeline</p>
                </div>

                <div className="h-[200px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'black' }}
                                />
                                <Bar 
                                    dataKey="orders" 
                                    fill="#3b82f6" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={20}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
