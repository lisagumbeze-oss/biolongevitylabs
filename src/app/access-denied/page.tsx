"use client";

import React from 'react';
import Link from 'next/link';
import { Ban, ShieldAlert, ArrowLeft } from 'lucide-react';

// Metadata cannot be exported from a Client Component, so we remove it.

export default function AccessDeniedPage() {
    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />


            <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-8 sm:px-12 py-16 shadow-2xl max-w-lg w-full relative z-10 text-center">

                <div className="w-24 h-24 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2 relative">
                    <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping" />
                    <Ban className="w-12 h-12" />
                </div>

                <div className="flex w-full flex-col items-center gap-4">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Access Denied</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                        Our research compounds are intended strictly for individuals 21 years of age and older.
                    </p>
                    <div className="flex items-center gap-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mt-2 text-left border border-slate-200 dark:border-slate-700">
                        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Please review our <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">Terms of Service</Link> or <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</Link> for more information.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center gap-4 mt-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-xl h-14 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold transition-all shadow-md active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                    <Link
                        href="/contact"
                        className="flex w-full max-w-[280px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 border-2 border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all"
                    >
                        Contact Support
                    </Link>
                </div>

            </div>
        </main>
    );
}
