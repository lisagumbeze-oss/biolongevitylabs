"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Play, RotateCcw, ShieldCheck, Database, LayoutDashboard, Search, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ScraperAdmin() {
    const [logs, setLogs] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/admin/scraper");
            const data = await res.json();
            if (data.logs) setLogs(data.logs);
        } catch (e) {
            console.error("Failed to fetch logs");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning) fetchLogs();
        }, 2000);
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const runScraper = async (script: string) => {
        setIsRunning(true);
        setLogs(`[SYSTEM] Initializing ${script}...\n`);
        try {
            const res = await fetch("/api/admin/scraper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ script })
            });
            if (res.ok) {
                setLastSync(new Date().toLocaleString());
            }
        } catch (e) {
            setLogs(prev => prev + "[ERROR] Failed to start scraper.\n");
        } finally {
            // Keep running state true to continue polling logs for a bit
            setTimeout(() => setIsRunning(false), 30000);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Scraper Command Center</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Data Synchronization</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar: Control Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary fill-primary" />
                                Execution Engine
                            </h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => runScraper('scrape_products')}
                                    disabled={isRunning}
                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    <Database className="w-4 h-4" />
                                    Sync Product Catalog
                                </button>
                                <button
                                    onClick={() => runScraper('scrape_descriptions')}
                                    disabled={isRunning}
                                    className="w-full h-16 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    <Search className="w-4 h-4" />
                                    Enrich Descriptions
                                </button>
                                <button
                                    onClick={() => runScraper('seed_coa')}
                                    disabled={isRunning}
                                    className="w-full h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-100 transition-all disabled:opacity-50"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Verify Lab Certificates
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Sync Status:</span>
                                    <span className={isRunning ? "text-primary animate-pulse" : "text-emerald-500"}>
                                        {isRunning ? "Running..." : "Idle"}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Last Sync:</span>
                                    <span>{lastSync || "Not synced this session"}</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Operational Guide</h3>
                            <ul className="space-y-3">
                                {[
                                    "Scrapers bypass caching for fresh data.",
                                    "Auto-syncs price drops every 24h.",
                                    "VPN rotation active on all sub-tasks.",
                                    "Rate limits respected for target domains."
                                ].map((text, i) => (
                                    <li key={i} className="flex gap-3 text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Right side: Terminal Log Viewer */}
                    <div className="lg:col-span-8 flex flex-col h-[700px]">
                        <div className="bg-slate-900 rounded-[2.5rem] flex flex-col h-full shadow-2xl border border-slate-800 overflow-hidden">
                            <div className="h-12 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between px-6">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                </div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">biolongevity-ops@machine01</div>
                                <button onClick={() => setLogs("")} className="text-slate-500 hover:text-white transition-colors">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 p-8 font-mono text-xs overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                <pre className="text-emerald-400/90 leading-relaxed whitespace-pre-wrap">
                                    {logs || `System ready. Waiting for execution...\n\n>_ type sync to begin.`}
                                </pre>
                                <div ref={logEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
