"use client";

import React from "react";
import { motion } from "framer-motion";

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-[40px] border border-slate-100 p-4 h-full flex flex-col gap-6">
            <div className="aspect-square rounded-[32px] bg-slate-100 animate-pulse overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="space-y-4 px-2 pb-2 flex-1">
                <div className="h-2 w-24 bg-slate-100 rounded-full animate-pulse" />
                <div className="space-y-2">
                    <div className="h-6 w-full bg-slate-100 rounded-full animate-pulse" />
                    <div className="h-6 w-2/3 bg-slate-100 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-slate-100 rounded-full animate-pulse" />
                </div>
                <div className="pt-4 flex items-center justify-between">
                    <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
                    <div className="h-12 w-12 bg-slate-100 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export const ShopSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
};

export default ProductSkeleton;
