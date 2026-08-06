"use client";

import React, { useEffect, useState, Suspense } from "react";
import { CheckCircle2, ArrowRight, ShoppingBag, Mail, ExternalLink, Copy, Check, Bitcoin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/useCart";
import { trackPurchaseFromSession } from "@/lib/analytics";

interface OrderPaymentInfo {
    paymentMethod: string;
    paymentType?: string;
    walletAddress?: string;
    total: string;
}

function OrderConfirmationContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");
    const [paymentInfo, setPaymentInfo] = useState<OrderPaymentInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);
    const [submittingPayment, setSubmittingPayment] = useState(false);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
            trackPurchaseFromSession(id);

            try {
                const stored = sessionStorage.getItem(`order_payment_${id}`);
                if (stored) {
                    setPaymentInfo(JSON.parse(stored));
                }
            } catch {
                // ignore parse errors
            }
        } else {
            const randomId = Math.floor(100000000 + Math.random() * 900000000);
            setOrderId(`#ORD-${randomId}`);
        }
    }, [searchParams]);

    const isCryptoPayment = paymentInfo?.paymentType === "crypto" && paymentInfo?.walletAddress;

    const handleCopyAddress = async () => {
        if (!paymentInfo?.walletAddress) return;
        try {
            await navigator.clipboard.writeText(paymentInfo.walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: select-all is available via select-all styling
        }
    };

    const handlePaymentSubmitted = async () => {
        if (!orderId || submittingPayment || paymentSubmitted) return;

        setSubmittingPayment(true);
        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: orderId,
                    status: "Pending Payments",
                    payment_status: "PENDING",
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to notify payment");
            }

            setPaymentSubmitted(true);
        } catch {
            alert("Could not submit payment notification. Please contact support with your order ID.");
        } finally {
            setSubmittingPayment(false);
        }
    };

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

                    <div className="max-w-md mx-auto space-y-6 mb-12 w-full">
                        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            Thank you for your purchase! We&apos;ve received your order and it&apos;s currently{" "}
                            <span className="text-primary font-bold italic">awaiting manual payment confirmation</span>.
                        </p>

                        {paymentInfo && !isCryptoPayment && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl text-left w-full">
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                    Payment method: {paymentInfo.paymentMethod}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
                                    Amount due: ${paymentInfo.total}
                                </p>

                                {paymentSubmitted ? (
                                    <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-black uppercase tracking-wider">Payment notification received — thank you!</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handlePaymentSubmitted}
                                        disabled={submittingPayment}
                                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submittingPayment ? "Submitting..." : "I Have Paid"}
                                    </button>
                                )}
                            </div>
                        )}

                        {isCryptoPayment && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl text-left w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                        <Bitcoin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Bitcoin Payment</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            Send ${paymentInfo.total} worth of BTC
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">BTC Wallet Address</p>
                                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white break-all select-all text-left">
                                        {paymentInfo.walletAddress}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyAddress}
                                        className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? "Copied!" : "Copy Address"}
                                    </button>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
                                    Include your order ID <strong className="text-slate-700 dark:text-slate-300">{orderId}</strong> in the transaction memo if your wallet supports it.
                                </p>

                                {paymentSubmitted ? (
                                    <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-black uppercase tracking-wider">Payment notification received — thank you!</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handlePaymentSubmitted}
                                        disabled={submittingPayment}
                                        className="w-full py-4 rounded-xl bg-primary hover:bg-primary/95 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {submittingPayment ? "Submitting..." : "I Have Paid"}
                                    </button>
                                )}
                            </div>
                        )}

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
                            className="flex-1 h-16 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black transition-all active:scale-95 uppercase tracking-widest text-sm"
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
