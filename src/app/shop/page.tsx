"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Product } from "@/data/products";
import { Search, ArrowUpDown, Package, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ShopSkeleton } from "@/components/Skeleton";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeForm, setActiveForm] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [sortBy, setSortBy] = useState("featured");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
                // Add a small delay to show off the skeleton (optional, but feels better)
                setTimeout(() => setIsLoading(false), 800);
            }
        };

        fetchProducts();
    }, []);

    const clearFilters = () => {
        setActiveCategory("All");
        setActiveForm("All");
        setMinPrice(0);
        setMaxPrice(5000);
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
                const matchesForm =
                    activeForm === "All" || p.form === activeForm;

                const price = p.isVariable && p.minPrice ? p.minPrice : p.price;
                const matchesPrice = price >= minPrice && price <= maxPrice;

                return matchesSearch && matchesCategory && matchesForm && matchesPrice;
            })
            .sort((a, b) => {
                if (sortBy === "price-low") {
                    const priceA = a.isVariable && a.minPrice ? a.minPrice : a.price;
                    const priceB = b.isVariable && b.minPrice ? b.minPrice : b.price;
                    return priceA - priceB;
                }
                if (sortBy === "price-high") {
                    const priceA = a.isVariable && a.minPrice ? a.minPrice : a.price;
                    const priceB = b.isVariable && b.minPrice ? b.minPrice : b.price;
                    return priceB - priceA;
                }
                if (sortBy === "newest") {
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return b.id.localeCompare(a.id);
                }
                if (sortBy === "rating") {
                    return (b.rating || 0) - (a.rating || 0);
                }
                if (a.isBestseller && !b.isBestseller) return -1;
                if (!a.isBestseller && b.isBestseller) return 1;
                return 0;
            });
    }, [products, searchQuery, activeCategory, activeForm, minPrice, maxPrice, sortBy]);

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen pt-8 pb-20">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="h-10 w-64 bg-slate-100 rounded-full animate-pulse mb-4" />
                        <div className="h-4 w-48 bg-slate-100 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="hidden lg:block w-64 shrink-0 space-y-8">
                            <div className="h-8 w-full bg-slate-100 rounded-full animate-pulse" />
                            <div className="space-y-4">
                                <div className="h-4 w-2/3 bg-slate-100 rounded-full animate-pulse" />
                                <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" />
                                <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <ShopSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen transition-colors">
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://biolongevitylabss.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Shop",
                                "item": "https://biolongevitylabss.com/shop"
                            }
                        ]
                    })
                }}
            />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                        Our Premium Compounds
                    </h1>
                    <p className="text-slate-500 text-base flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Showing {filteredProducts.length} of {products.length} research-grade products
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:border-primary transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>

                        <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 flex-1 lg:flex-none">
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 border-none focus:ring-0 cursor-pointer outline-none w-full"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="rating">Top Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-28">
                            <FilterSidebar 
                                selectedCategory={activeCategory === "All" ? "" : activeCategory}
                                setSelectedCategory={(cat) => setActiveCategory(cat || "All")}
                                selectedForm={activeForm === "All" ? "" : activeForm}
                                setSelectedForm={(f) => setActiveForm(f || "All")}
                                minPrice={minPrice}
                                setMinPrice={setMinPrice}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Active Filter Indicator */}
                        {(activeCategory !== "All" || activeForm !== "All" || minPrice > 0 || maxPrice < 5000 || searchQuery) && (
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                <span className="text-sm text-slate-500 mr-2 font-bold uppercase tracking-widest text-[10px]">Active filters:</span>
                                {activeCategory !== "All" && (
                                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-primary/20">
                                        {activeCategory}
                                        <button onClick={() => setActiveCategory("All")} className="hover:text-primary/70">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {activeForm !== "All" && (
                                    <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-500 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-indigo-500/20">
                                        {activeForm}
                                        <button onClick={() => setActiveForm("All")} className="hover:text-indigo-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {(minPrice > 0 || maxPrice < 5000) && (
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                        ${minPrice} - ${maxPrice}
                                        <button onClick={() => { setMinPrice(0); setMaxPrice(5000); }} className="hover:text-emerald-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1.5 bg-slate-900/10 text-slate-900 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-slate-900/20">
                                        &quot;{searchQuery}&quot;
                                        <button onClick={() => setSearchQuery("")} className="hover:text-slate-900/70">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-[11px] text-slate-400 hover:text-primary font-black uppercase tracking-widest transition-colors ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-white rounded-full shadow-xl shadow-slate-200 flex items-center justify-center mb-6">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">No products found</h2>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">
                                    Try adjusting your filters or search terms to find what you&apos;re looking for.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-white z-[70] p-6 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Filters</h2>
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <FilterSidebar 
                                selectedCategory={activeCategory === "All" ? "" : activeCategory}
                                setSelectedCategory={(cat) => setActiveCategory(cat || "All")}
                                selectedForm={activeForm === "All" ? "" : activeForm}
                                setSelectedForm={(f) => setActiveForm(f || "All")}
                                minPrice={minPrice}
                                setMinPrice={setMinPrice}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                clearFilters={clearFilters}
                            />
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                >
                                    Apply Filters ({filteredProducts.length})
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

