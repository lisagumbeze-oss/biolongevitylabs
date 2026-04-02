"use client";

import React, { useEffect, useState, Suspense } from "react";
import { CheckCircle2, ArrowRight, ShoppingBag, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/useCart";

function OrderConfirmationContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        // Get order ID from URL params
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
        } else {
            // Fallback if no ID in URL
            const randomId = Math.floor(100000000 + Math.random() * 900000000);
            setOrderId(`#ORD-${randomId}`);
        }
    }, [searchParams, clearCart]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background transition-colors">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-500">
                <div className="h-2 w-full bg-primary shadow-[0_0_15px_rgba(19,127,236,0.4)]"></div>

                <div className="flex flex-col items-center px-8 py-12 md:py-16 text-center">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        Order Successfully Placed!
                    </h1>

                    <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                        <span className="text-sm font-black text-primary">{orderId}</span>
                    </div>

                    <div className="max-w-md mx-auto space-y-6 mb-12">
                        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            Thank you for your purchase! We&apos;ve received your order and it&apos;s currently <span className="text-primary font-bold italic">awaiting manual payment confirmation</span>.
                        </p>

                        <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl text-left flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">Check Your Inbox</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    We sent a confirmation email with detailed instructions for your selected payment method.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                        <Link
                            href="/shop"
                            className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary/95 text-white font-black transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 group uppercase tracking-widest text-sm"
                        >
                            Continue Shopping
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/support"
                            className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black transition-all active:scale-95 uppercase tracking-widest text-sm"
                        >
                            Contact Support
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6">
                        <div className="flex flex-col items-center gap-1">
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lab-Grade Purity</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col items-center gap-1">
                            <ExternalLink className="w-5 h-5 text-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Tracking Provided</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse text-slate-400">Loading Order Confirmation...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
