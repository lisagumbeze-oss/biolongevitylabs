"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/store/useWishlist";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    const { items, removeItem, clearWishlist, _hasHydrated } = useWishlist();

    if (!_hasHydrated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link 
                            href="/shop" 
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Shop
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            Your Wishlist
                            <span className="text-xl font-bold text-slate-300 bg-slate-50 px-4 py-1 rounded-2xl">
                                {items.length}
                            </span>
                        </h1>
                    </div>
                    
                    {items.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm("Clear all items from your wishlist?")) {
                                    clearWishlist();
                                }
                            }}
                            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold text-xs uppercase tracking-widest transition-colors group"
                        >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Clear Wishlist
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {items.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {items.map((item) => (
                                <motion.div key={item.id} layout>
                                    <ProductCard {...item} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200"
                        >
                            <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-slate-200 flex items-center justify-center mb-8">
                                <Heart className="w-10 h-10 text-slate-200" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">Your wishlist is empty</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                                Save your favorite premium research compounds here to keep track of what you need for your next protocol.
                            </p>
                            <Link
                                href="/shop"
                                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 flex items-center gap-3 group"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                Start Shopping
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
