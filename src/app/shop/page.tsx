"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { Search, ArrowUpDown, Package, SlidersHorizontal, X, Loader2 } from "lucide-react";

const categories = [
    "All",
    "Peptide Vials",
    "Peptide Capsules",
    "Bioregulator Capsules",
    "Bioregulator Creams",
    "Bioregulator Vials",
];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const clearFilters = () => {
        setActiveCategory("All");
        setSearchQuery("");
        setSortBy("featured");
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter((p) => {
                const matchesSearch =
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory =
                    activeCategory === "All" || p.category === activeCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const priceA = a.isVariable && a.minPrice ? a.minPrice : a.price;
                const priceB = b.isVariable && b.minPrice ? b.minPrice : b.price;
                if (sortBy === "price-low") return priceA - priceB;
                if (sortBy === "price-high") return priceB - priceA;
                return 0; // "featured" maintains original or DB order roughly
            });
    }, [products, searchQuery, activeCategory, sortBy]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Live Inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                        Our Premium Compounds
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        {filteredProducts.length} research-grade products available
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="mb-8 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-2 pb-2 min-w-max">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Sort Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 border-none focus:ring-0 cursor-pointer outline-none"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active Filter Indicator */}
                {(activeCategory !== "All" || searchQuery) && (
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Active filters:</span>
                        {activeCategory !== "All" && (
                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                                {activeCategory}
                                <button onClick={() => setActiveCategory("All")} className="hover:text-primary/70">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                                &quot;{searchQuery}&quot;
                                <button onClick={() => setSearchQuery("")} className="hover:text-primary/70">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-slate-400 hover:text-primary font-medium transition-colors underline underline-offset-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">
                            Try adjusting your filters or search terms to find what you&apos;re looking for.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-primary font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

