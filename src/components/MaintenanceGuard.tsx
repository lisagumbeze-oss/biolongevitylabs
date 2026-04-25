"use client";

import React from 'react';
import { useSettings } from "@/store/useSettings";
import { AlertTriangle, Loader2, Globe } from 'lucide-react';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { settings, loading } = useSettings();

    // Don't show maintenance on admin routes
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        return <>{children}</>;
    }

    if (loading) return <>{children}</>;

    if (settings?.general?.maintenanceMode) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                            <Globe className="w-12 h-12 animate-pulse" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            Laboratory <span className="text-primary italic">Re-calibration</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {settings.general.storeName || "BioLongevity Labs"} is currently undergoing essential system upgrades and laboratory re-calibration. 
                            We will return shortly with enhanced research capabilities.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            System Synchronization In Progress
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
