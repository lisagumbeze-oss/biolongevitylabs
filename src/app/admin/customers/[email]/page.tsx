"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Mail, 
    Calendar, 
    Package, 
    DollarSign, 
    ArrowUpRight,
    Loader2,
    ShoppingBag,
    User,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Order {
    id: string;
    date: string;
    total: string;
    status: string;
    items: number;
}

interface CustomerDetail {
    name: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    orders: Order[];
}

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const email = decodeURIComponent(params.email as string);
    
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomerData();
    }, [email]);

    const fetchCustomerData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            if (Array.isArray(data)) {
                const found = data.find(c => c.email === email);
                if (found) {
                    setCustomer(found);
                } else {
                    toast.error('Customer not found');
                    router.push('/admin/customers');
                }
            }
        } catch (error) {
            toast.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Decrypting profile...</p>
            </div>
        );
    }

    if (!customer) return null;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="p-3 text-slate-500 hover:text-primary bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{customer.name}</h1>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
                                <Mail className="w-4 h-4" />
                                {customer.email}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                                Research Partner
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex gap-3">
                    <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        Edit Profile
                    </button>
                    <button className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                        New Order
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Lifetime Value', value: `$${customer.totalSpent.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500' },
                    { label: 'Order Volume', value: customer.orderCount, icon: ShoppingBag, color: 'text-blue-500' },
                    { label: 'Avg. Order', value: `$${(customer.totalSpent / customer.orderCount).toFixed(2)}`, icon: ArrowUpRight, color: 'text-purple-500' },
                    { label: 'Last Engagement', value: new Date(customer.lastOrderDate).toLocaleDateString(), icon: Calendar, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Scientific Transaction History</h3>
                            <span className="text-xs text-slate-500 font-bold">{customer.orderCount} total records</span>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {customer.orders.map((order, i) => (
                                <div key={i} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{order.id}</span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                                    order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{order.total}</p>
                                        <Link 
                                            href={`/admin/orders/${order.id.replace('#', '')}`}
                                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Report
                                            <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Account Details & Metadata */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">Laboratory Intelligence</h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal ID</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">USR-{customer.email.split('@')[0].toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Channel</p>
                                <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                                    {customer.email}
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Tier</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Professional Researcher</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-xs font-bold mb-4">
                                <span className="text-slate-500">Marketing Opt-in</span>
                                <span className="text-emerald-500 uppercase">Verified</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-500">Account Status</span>
                                <span className="text-emerald-500 uppercase">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">Advanced Actions</h4>
                        <div className="space-y-2">
                            <button className="w-full text-left text-xs font-bold text-rose-500 hover:underline">Suspend partner account</button>
                            <button className="w-full text-left text-xs font-bold text-rose-500 hover:underline">Clear transaction history</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
