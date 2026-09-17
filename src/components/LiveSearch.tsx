"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Package, X } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import { productPath } from "@/lib/product-slug";
import { motion, AnimatePresence } from "framer-motion";

interface LiveSearchProps {
    autoFocus?: boolean;
    className?: string;
    onNavigate?: () => void;
}

export default function LiveSearch({ autoFocus, className, onNavigate }: LiveSearchProps = {}) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const closeSearch = () => {
        setQuery("");
        setIsFocused(false);
        onNavigate?.();
    };

    const results = query.trim().length > 1
        ? products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6)
        : [];

    const showDropdown = isFocused && query.trim().length > 1;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (autoFocus) {
            setIsFocused(true);
            inputRef.current?.focus();
        }
    }, [autoFocus]);

    return (
        <div ref={ref} className={`relative flex-1 max-w-xl ${className ?? ""}`}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    ref={inputRef}
                    className="block w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-10 text-sm leading-5 text-slate-900 placeholder:text-slate-500 shadow-none transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Search research products..."
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                {query && (
                    <button
                        onClick={closeSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                        {results.length > 0 ? (
                            <>
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                                </div>
                                {results.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <Link
                                            href={productPath(product)}
                                            onClick={closeSearch}
                                            className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                                        >
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary">{product.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{product.category}</p>
                                            </div>
                                            <p className="text-sm font-black text-primary shrink-0">${product.price.toFixed(2)}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                                    <Link
                                        href={`/shop?q=${encodeURIComponent(query)}`}
                                        onClick={closeSearch}
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        View all results for &quot;{query}&quot; →
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="px-4 py-6 flex flex-col items-center text-center gap-2">
                                <Package className="w-8 h-8 text-slate-300" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">No products found for &quot;<span className="font-bold">{query}</span>&quot;</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
