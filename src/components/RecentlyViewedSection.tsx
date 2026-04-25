"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useRecentlyViewed } from "@/store/useRecentlyViewed";
import { History, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecentlyViewedSectionProps {
    currentProductId?: string;
}

const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({ currentProductId }) => {
    const items = useRecentlyViewed((state) => state.items);
    
    // Filter out current product and limit to 4
    const displayItems = items
        .filter(item => item.id !== currentProductId)
        .slice(0, 4);

    if (displayItems.length === 0) return null;

    return (
        <div className="mt-40 pt-20 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="text-left">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Recently Viewed</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <History className="w-4 h-4 text-primary" />
                        Pick up where you left off
                    </p>
                </div>
                <Link href="/shop" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:text-slate-900 dark:hover:text-white transition-all">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayItems.map((p) => (
                    <ProductCard key={p.id} {...p} />
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewedSection;
