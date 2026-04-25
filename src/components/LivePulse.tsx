"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Globe, Beaker, ShieldCheck } from "lucide-react";

const activities = [
    { city: "London", country: "UK", product: "BPC-157 5mg", action: "verified order" },
    { city: "New York", country: "USA", product: "TB-500 10mg", action: "research log updated" },
    { city: "Berlin", country: "Germany", product: "Epitalon", action: "batch analysis viewed" },
    { city: "Tokyo", country: "Japan", product: "GHK-Cu", action: "new order placed" },
    { city: "Sydney", country: "Australia", product: "Ipamorelin", action: "verified order" },
    { city: "Toronto", country: "Canada", product: "Semaglutide", action: "COA downloaded" },
    { city: "Paris", country: "France", product: "Retatrutide", action: "verified order" },
];

export default function LivePulse() {
    const [currentActivity, setCurrentActivity] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after 3 seconds
        const initialTimeout = setTimeout(() => setIsVisible(true), 3000);

        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentActivity((prev) => (prev + 1) % activities.length);
                setIsVisible(true);
            }, 1000);
        }, 15000); // Show every 15 seconds

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-2xl shadow-primary/10 flex items-center gap-4 max-w-[320px] pointer-events-auto"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Globe className="w-6 h-6 animate-pulse" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                    {activities[currentActivity].city}, {activities[currentActivity].country}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Just now</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-tight">
                                <span className="font-black text-slate-900 dark:text-white">{activities[currentActivity].product}</span>
                                <br />
                                {activities[currentActivity].action}
                            </p>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                        >
                            <Zap className="w-3.5 h-3.5 fill-primary text-primary" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
