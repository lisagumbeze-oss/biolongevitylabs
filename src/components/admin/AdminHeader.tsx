"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [readOrders, setReadOrders] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('Unread');

    useEffect(() => {
        const saved = localStorage.getItem('admin_read_orders');
        if (saved) setReadOrders(JSON.parse(saved));

        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOrders(data.reverse()); // latest first
                }
            })
            .catch(console.error);
    }, []);

    const markAllAsRead = () => {
        const pendingIds = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Payments').map(o => o.id);
        const next = Array.from(new Set([...readOrders, ...pendingIds]));
        setReadOrders(next);
        localStorage.setItem('admin_read_orders', JSON.stringify(next));
    };

    const markAsRead = (id: string) => {
        if (!readOrders.includes(id)) {
            const next = [...readOrders, id];
            setReadOrders(next);
            localStorage.setItem('admin_read_orders', JSON.stringify(next));
        }
    };

    const allNotifications = orders.slice(0, 10);
    const unreadNotifications = orders.filter(o => (o.status === 'Pending' || o.status === 'Pending Payments') && !readOrders.includes(o.id));
    const displayList = activeTab === 'Unread' ? unreadNotifications : allNotifications;

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search orders, products..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 rounded-xl text-sm transition-all text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            {unreadNotifications.length > 0 && (
                                <>
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                </>
                            )}
                        </span>
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/50 overflow-hidden transform origin-top-right transition-all text-left">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Notifications</h3>
                                {unreadNotifications.length > 0 && (
                                    <button onClick={markAllAsRead} className="text-sm text-primary hover:text-sky-500 font-bold">Mark all as read</button>
                                )}
                            </div>

                            <div className="flex border-b border-slate-100 dark:border-slate-800/50 px-5 gap-6 bg-slate-50/50 dark:bg-slate-950/50">
                                <button
                                    onClick={() => setActiveTab('All')}
                                    className={`flex flex-col items-center justify-center border-b-[3px] pb-2 pt-3 font-bold transition-colors ${activeTab === 'All' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                    <span className="text-sm">All</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('Unread')}
                                    className={`flex flex-col items-center justify-center border-b-[3px] pb-2 pt-3 font-bold transition-colors ${activeTab === 'Unread' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                    <span className="text-sm flex items-center gap-2">
                                        Unread
                                        {unreadNotifications.length > 0 && (
                                            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadNotifications.length}</span>
                                        )}
                                    </span>
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {displayList.map((order, i) => {
                                    const isUnread = (order.status === 'Pending' || order.status === 'Pending Payments') && !readOrders.includes(order.id);
                                    return (
                                        <div key={order.id} className={`flex gap-4 p-5 transition-colors border-t border-slate-100 dark:border-slate-800 ${isUnread ? 'bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-70'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUnread ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                {isUnread ? <ShoppingCart className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-bold text-slate-900 dark:text-white">Order {order.id.startsWith('#') ? order.id : `#${order.id}`} {order.status === 'Pending' || order.status === 'Pending Payments' ? '' : order.status}</p>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isUnread ? 'text-primary bg-primary/10' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                        {order.status === 'Pending' || order.status === 'Pending Payments' ? 'Action Required' : 'Processed'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{order.email}</p>
                                                <p className="text-xs text-slate-400 font-bold">{order.date}</p>

                                                <Link
                                                    href={`/admin/orders/${order.id.replace('#', '')}`}
                                                    onClick={() => markAsRead(order.id)}
                                                    className={`mt-3 inline-block px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm ${isUnread ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                                    {isUnread ? 'Review Order' : 'View Details'}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}

                                {displayList.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                                        No {activeTab.toLowerCase()} notifications
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-950/50">
                                <Link href="/admin/orders" className="text-sm font-bold text-primary hover:text-sky-500">
                                    View all orders
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                {/* Profile */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Admin User</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Superadmin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm ring-2 ring-transparent group-hover:ring-primary/30 transition-all shadow-md">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
