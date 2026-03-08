"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Package, X } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveSearch() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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

    return (
        <div ref={ref} className="relative flex-1 max-w-xl">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    className="block w-full pl-12 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl leading-5 bg-slate-50 dark:bg-slate-800/50 text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all shadow-inner"
                    placeholder="Search research products..."
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setIsFocused(false); }}
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
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/20 z-50 overflow-hidden"
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
                                            href={`/product/${product.id}`}
                                            onClick={() => { setQuery(""); setIsFocused(false); }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{product.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{product.category}</p>
                                            </div>
                                            <p className="text-sm font-black text-primary shrink-0">${product.price.toFixed(2)}</p>
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                                    <Link
                                        href={`/shop?q=${encodeURIComponent(query)}`}
                                        onClick={() => { setQuery(""); setIsFocused(false); }}
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
