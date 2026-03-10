"use client";

import React from 'react';
import { TrendingUp, Users, PackageOpen, DollarSign, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

interface AdminOrder {
    id: string;
    customer: string;
    email: string;
    status: string;
    total: string;
    date: string;
    items: number;
}

interface AdminProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
}

export default function AdminDashboardPage() {
    const [orders, setOrders] = React.useState<AdminOrder[]>([]);
    const [products, setProducts] = React.useState<AdminProduct[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/products')
                ]);
                const [ordersData, productsData] = await Promise.all([
                    ordersRes.json(),
                    productsRes.json()
                ]);
                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate real metrics
    const totalRevenue = orders
        .filter(o => o.status === 'Completed' || o.status === 'Shipped')
        .reduce((acc, o) => acc + parseFloat(o.total.replace('$', '')), 0);

    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const totalProducts = products.length;

    const metrics = [
        { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, trend: '+12.5%', trendUp: true, color: 'from-blue-500 to-cyan-400' },
        { title: 'Active Orders', value: activeOrders.toString(), icon: PackageOpen, trend: '+5.2%', trendUp: true, color: 'from-primary to-purple-500' },
        { title: 'Total Products', value: totalProducts.toString(), icon: PackageOpen, trend: '+3.1%', trendUp: true, color: 'from-primary to-blue-500' },
    ];

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back, Admin. Here&apos;s a snapshot of your store&apos;s performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-sm">
                    <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg transition-all">Last 30 Days</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-all">Last 90 Days</button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric) => (
                    <div key={metric.title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110`} />
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{metric.title}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">{metric.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg shadow-current/20`}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            {metric.trendUp ? (
                                <span className="flex items-center text-primary font-black bg-primary/10 px-2 py-0.5 rounded-lg">
                                    <ArrowUpRight className="w-4 h-4 mr-0.5" />
                                    {metric.trend}
                                </span>
                            ) : (
                                <span className="flex items-center text-rose-500 font-black bg-rose-500/10 px-2 py-0.5 rounded-lg">
                                    <ArrowDownRight className="w-4 h-4 mr-0.5" />
                                    {metric.trend}
                                </span>
                            )}
                            <span className="text-slate-400 ml-2 font-medium">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Preview */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Recent Orders</h3>
                        <button className="text-sm font-black text-primary hover:underline transition-all">View All Orders</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 font-black border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{order.id}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{order.customer}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Completed' ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                                    order.status === 'Processing' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{order.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Top Sellers</h3>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        {[
                            { name: 'BPC-157 (5mg)', sales: 124, price: '$49.99', image: 'https://via.placeholder.com/50' },
                            { name: 'TB-500 (2mg)', sales: 98, price: '$39.99', image: 'https://via.placeholder.com/50' },
                            { name: 'Ipamorelin (5mg)', sales: 86, price: '$44.99', image: 'https://via.placeholder.com/50' },
                            { name: 'Melanotan II', sales: 72, price: '$29.99', image: 'https://via.placeholder.com/50' },
                        ].map((prod, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden text-slate-400 flex items-center justify-center">
                                    <PackageOpen className="w-6 h-6 opacity-30" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{prod.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{prod.sales} Sold • {prod.price}</p>
                                </div>
                                <div className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                    #{i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
