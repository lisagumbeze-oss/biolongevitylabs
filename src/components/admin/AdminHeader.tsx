"use client";

import React, { useState } from 'react';
import { Bell, Search, CheckCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function AdminHeader() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search orders, products, customers..."
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transform origin-top-right transition-all text-left">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Notifications</h3>
                                <button className="text-sm text-primary hover:text-sky-500 font-bold">Mark all as read</button>
                            </div>

                            <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 gap-6 bg-slate-50/50 dark:bg-slate-950/50">
                                <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 pb-2 pt-3 font-bold transition-colors">
                                    <span className="text-sm">All</span>
                                </button>
                                <button className="flex flex-col items-center justify-center border-b-[3px] border-primary text-slate-900 dark:text-white pb-2 pt-3 font-bold">
                                    <span className="text-sm flex items-center gap-2">
                                        Unread
                                        <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
                                    </span>
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {/* Unread Item 1 */}
                                <div className="flex gap-4 p-5 bg-primary/5 hover:bg-primary/10 transition-colors border-l-4 border-primary">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-slate-900 dark:text-white">New Order #89432</p>
                                            <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">Awaiting Payment</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">guest@example.com</p>
                                        <p className="text-xs text-slate-400 font-bold">2 mins ago</p>

                                        <Link href="/admin/orders/ORD-89432" className="mt-3 inline-block px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm">
                                            Review Payment
                                        </Link>
                                    </div>
                                </div>

                                {/* Unread Item 2 */}
                                <div className="flex gap-4 p-5 bg-primary/5 hover:bg-primary/10 transition-colors border-l-4 border-primary border-t border-slate-100 dark:border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-slate-900 dark:text-white">New Order #89431</p>
                                            <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">Awaiting Payment</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">quickshopper@email.com</p>
                                        <p className="text-xs text-slate-400 font-bold">15 mins ago</p>

                                        <Link href="/admin/orders" className="mt-3 inline-block px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm">
                                            Review Payment
                                        </Link>
                                    </div>
                                </div>

                                {/* Read Item */}
                                <div className="flex gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800 opacity-60">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-slate-900 dark:text-white">Order #89430 Paid</p>
                                            <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">Completed</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">user99@email.com</p>
                                        <p className="text-xs text-slate-400 font-bold">2 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-950/50">
                                <Link href="/admin/notifications" className="text-sm font-bold text-primary hover:text-sky-500">
                                    View all activity
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
