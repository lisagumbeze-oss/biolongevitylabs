"use client";

import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Mail, 
    ShoppingBag, 
    DollarSign, 
    Calendar,
    ArrowUpRight,
    Loader2,
    Users,
    Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Customer {
    name: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
}

export default function CustomersAdminPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            }
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Customer Directory</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage laboratory partners and individual research clients.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Partners', value: customers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Avg. Lifetime Value', value: `$${(customers.reduce((acc, c) => acc + c.totalSpent, 0) / (customers.length || 1)).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Repeat Customers', value: `${((customers.filter(c => c.orderCount > 1).length / (customers.length || 1)) * 100).toFixed(0)}%`, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by name or laboratory email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 font-bold hover:text-primary transition-all shadow-sm">
                    <Filter className="w-5 h-5" />
                    Filter
                </button>
            </div>

            {/* Customers Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Querying database...</p>
                    </div>
                ) : filteredCustomers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer / Lab</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Lifetime Value</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Orders</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Last Active</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Profile</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredCustomers.map((customer, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200 dark:border-slate-700">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                                        {customer.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                ${customer.totalSpent.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-tighter">
                                                {customer.orderCount} Orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(customer.lastOrderDate).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={`/admin/customers/${encodeURIComponent(customer.email)}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            >
                                                Details
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">No scientific partners found</h3>
                        <p className="text-slate-500 mt-2 max-w-sm">No customers matching your search criteria were found in our laboratory records.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
