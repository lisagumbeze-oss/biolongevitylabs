"use client";

import React, { useState } from 'react';
import { Search, Eye, Filter, Download, MoreVertical, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Order Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">Monitor and process customer orders in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-sm">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-black hover:bg-sky-500 transition-all shadow-lg shadow-primary/20 text-sm">
                        <Calendar className="w-4 h-4" />
                        Schedule Report
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Filters Bar */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <select className="flex-1 lg:flex-none px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none">
                            <option>All Statuses</option>
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-slate-400 dark:text-slate-500 uppercase bg-white dark:bg-slate-900 font-black border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5 tracking-widest">Order Details</th>
                                <th className="px-6 py-5 tracking-widest">Customer</th>
                                <th className="px-6 py-5 tracking-widest">Status</th>
                                <th className="px-6 py-5 tracking-widest">Total</th>
                                <th className="px-6 py-5 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all">
                                    <td className="px-6 py-6">
                                        <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{order.id}</div>
                                        <div className="text-slate-500 dark:text-slate-500 text-xs mt-1 font-bold">{order.date} • {order.items} item(s)</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-slate-900 dark:text-slate-200 font-black text-sm">{order.customer}</div>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">{order.email}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${order.status === 'Completed' ? 'bg-primary/10 text-primary dark:text-blue-400' :
                                            order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                order.status === 'Processing' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                                    'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-primary' :
                                                order.status === 'Shipped' ? 'bg-blue-500' :
                                                    order.status === 'Processing' ? 'bg-purple-500' :
                                                        'bg-amber-500'
                                                }`} />
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="font-black text-slate-900 dark:text-white text-sm">{order.total}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">Paid via Transfer</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/orders/${order.id.replace('#', '')}`}
                                                className="flex items-center gap-2 px-4 py-2 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-primary bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm group-hover:border-primary/50"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Review
                                            </Link>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="px-6 py-20 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">No orders found</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto text-sm">We couldn't find any orders matching your search. Try adjusting your filters.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-6 text-primary font-black text-sm hover:underline"
                        >
                            Clear all searches
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
