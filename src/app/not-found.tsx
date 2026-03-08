import React from 'react';
import Link from 'next/link';
import { Ghost, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 min-h-[80vh] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-[700px] w-full text-center relative z-10 flex flex-col items-center">

                {/* 404 Hero Section */}
                <div className="mb-4 relative">
                    <h1 className="text-slate-200 dark:text-slate-800/50 text-[140px] md:text-[200px] font-black leading-none tracking-tighter select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                        <Ghost className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl animate-pulse" />
                    </div>
                </div>

                <div className="relative -mt-16 md:-mt-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl w-full">
                    <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight mb-4">Compound Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                        It seems the research material you're looking for has been moved, deprecated, or the link is broken.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Link
                            href="/shop"
                            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-sky-500 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 active:scale-95"
                        >
                            Return to Catalog
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-xl h-14 px-8 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-base font-bold transition-all shadow-md active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Helpful Links */}
                <div className="mt-16 w-full max-w-2xl">
                    <p className="text-slate-500 dark:text-slate-500 text-sm font-bold uppercase tracking-widest mb-6">Helpful Destinations</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Link href="/about" className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Our Lab</span>
                        </Link>
                        <Link href="/support" className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Support FAQ</span>
                        </Link>
                        <Link href="/terms" className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Policies</span>
                        </Link>
                        <Link href="/cart" className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg transition-all">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">View Cart</span>
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
