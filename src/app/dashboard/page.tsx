"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Activity, Bookmark, History, Settings, User, 
    Beaker, Zap, Calendar, ArrowRight, ShieldCheck,
    FlaskConical, Microscope
} from "lucide-react";
import Link from "next/link";

const SavedProtocolCard = ({ title, date, compounds }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
            </span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-6">
            {compounds.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500 border border-slate-100 dark:border-slate-700">{c}</span>
            ))}
        </div>
        <button className="w-full py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
            View Protocol Details
            <ArrowRight className="w-3.5 h-3.5" />
        </button>
    </motion.div>
);

export default function Dashboard() {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Sidebar/Subnav (Horizontal for simplicity) */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-20 z-30">
                <div className="max-w-7xl mx-auto px-4 flex gap-8">
                    {[
                        { icon: Activity, label: "Overview", active: true },
                        { icon: Bookmark, label: "Saved Protocols", active: false },
                        { icon: History, label: "History", active: false },
                        { icon: Settings, label: "Settings", active: false },
                    ].map((item) => (
                        <button 
                            key={item.label}
                            className={`py-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${item.active ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* Welcome Banner */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                                <Microscope className="w-full h-full rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 italic">Researcher Profile</h2>
                                <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Welcome back, Scientist</h1>
                                <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed mb-8">
                                    Your latest laboratory protocols are synchronized and ready for analysis. 3 new batch updates available.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/protocol-finder" className="px-8 py-4 bg-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        New Protocol
                                    </Link>
                                    <button className="px-8 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Download Reports
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Protocols */}
                        <div>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Saved Protocols</h2>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Personal Research Library</p>
                                </div>
                                <Link href="#" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All →</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SavedProtocolCard 
                                    title="Muscle Recovery Stack A" 
                                    date="Oct 24, 2026" 
                                    compounds={["BPC-157", "TB-500", "Ipamorelin"]} 
                                />
                                <SavedProtocolCard 
                                    title="Neuro-Regen Protocol v2" 
                                    date="Oct 20, 2026" 
                                    compounds={["Semax", "Selank"]} 
                                />
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        
                        {/* Loyalty Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Zap className="w-8 h-8 fill-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio-Rewards Balance</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">12,450</p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Progress to Next Tier</span>
                                    <span className="text-primary">85%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%]" />
                                </div>
                            </div>
                            <button className="w-full py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">
                                Redeem Credits
                            </button>
                        </div>

                        {/* Lab Stats */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Account Verification</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Identity Verified</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level 2 Clearace</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FlaskConical className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Batch Integrity</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">99.8% Combined Purity</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
