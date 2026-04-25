"use client";

import React from "react";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCart();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                
                {/* Header */}
                <div className="mb-12">
                    <Link 
                        href="/shop" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        Your Shopping Bag
                        <span className="text-xl font-bold text-slate-300 bg-slate-50 px-4 py-1 rounded-2xl">
                            {items.length}
                        </span>
                    </h1>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 group"
                                    >
                                        <div className="relative w-full sm:w-32 h-32 bg-white rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <Link href={`/product/${item.id}`} className="text-lg font-black text-slate-900 hover:text-primary transition-colors line-clamp-1">
                                                        {item.name}
                                                    </Link>
                                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                                <span key={key} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500">
                                                                    {key}: {value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap justify-between items-end gap-4 mt-6">
                                                <div className="flex items-center gap-2 border border-slate-200 rounded-2xl bg-white p-1.5 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-slate-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-2xl font-black text-slate-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6">
                                <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
                                    <h2 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h2>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-slate-400">
                                            <p className="text-sm font-bold uppercase tracking-widest">Subtotal</p>
                                            <p className="text-lg font-bold text-white">${subtotal.toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-400">
                                            <p className="text-sm font-bold uppercase tracking-widest">Shipping</p>
                                            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Calculated at next step</p>
                                        </div>
                                        <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Due</p>
                                            <p className="text-4xl font-black text-primary tracking-tighter">${subtotal.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="w-full bg-primary hover:bg-sky-500 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 group"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-black mt-6">
                                        Free Standard Shipping on all orders
                                    </p>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { icon: ShieldCheck, title: "Secure Checkout", desc: "256-bit SSL encrypted connection" },
                                        { icon: Truck, title: "Fast Dispatch", desc: "Orders ship within 24 hours" },
                                        { icon: RotateCcw, title: "Research Guarantee", desc: "60-day replacement policy" }
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shrink-0">
                                                <badge.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">{badge.title}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium">{badge.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-slate-200 flex items-center justify-center mb-8">
                            <ShoppingBag className="w-10 h-10 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Your bag is empty</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                            Looks like you haven&apos;t added any research compounds to your order yet. Start your protocol by browsing our collection.
                        </p>
                        <Link
                            href="/shop"
                            className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 flex items-center gap-3 group"
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
