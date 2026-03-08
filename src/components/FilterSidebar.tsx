"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";
import { categories, forms } from "@/data/products";

interface FilterSidebarProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedForm: string;
    setSelectedForm: (form: string) => void;
    minPrice: number;
    setMinPrice: (price: number) => void;
    maxPrice: number;
    setMaxPrice: (price: number) => void;
    clearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    selectedCategory,
    setSelectedCategory,
    selectedForm,
    setSelectedForm,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    clearFilters,
}) => {
    return (
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline transition-all"
                >
                    Clear All
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {/* Category Filter */}
                <details className="group" open>
                    <summary className="flex cursor-pointer items-center justify-between py-2 list-none">
                        <p className="font-medium text-base text-slate-900 dark:text-slate-100">Category</p>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="flex flex-col gap-3 pt-2 pb-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === ""}
                                onChange={() => setSelectedCategory("")}
                                className="form-radio h-5 w-5 text-primary border-slate-300 dark:border-slate-600 bg-transparent focus:ring-primary focus:ring-offset-0 dark:focus:ring-offset-slate-900"
                            />
                            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                All Categories
                            </span>
                        </label>
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                    className="form-radio h-5 w-5 text-primary border-slate-300 dark:border-slate-600 bg-transparent focus:ring-primary focus:ring-offset-0 dark:focus:ring-offset-slate-900"
                                />
                                <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                    {cat}
                                </span>
                            </label>
                        ))}
                    </div>
                </details>

                <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>

                {/* Product Form Filter */}
                <details className="group" open>
                    <summary className="flex cursor-pointer items-center justify-between py-2 list-none">
                        <p className="font-medium text-base text-slate-900 dark:text-slate-100">Product Form</p>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="flex flex-col gap-3 pt-2 pb-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="form"
                                checked={selectedForm === ""}
                                onChange={() => setSelectedForm("")}
                                className="form-radio h-5 w-5 text-primary border-slate-300 dark:border-slate-600 bg-transparent focus:ring-primary focus:ring-offset-0 dark:focus:ring-offset-slate-900"
                            />
                            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                All Forms
                            </span>
                        </label>
                        {forms.map((f) => (
                            <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="form"
                                    checked={selectedForm === f}
                                    onChange={() => setSelectedForm(f)}
                                    className="form-radio h-5 w-5 text-primary border-slate-300 dark:border-slate-600 bg-transparent focus:ring-primary focus:ring-offset-0 dark:focus:ring-offset-slate-900"
                                />
                                <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                    {f}
                                </span>
                            </label>
                        ))}
                    </div>
                </details>

                <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>

                {/* Price Range Filter */}
                <details className="group" open>
                    <summary className="flex cursor-pointer items-center justify-between py-2 list-none">
                        <p className="font-medium text-base text-slate-900 dark:text-slate-100">Price Range</p>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="pt-4 pb-6">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Min"
                                />
                            </div>
                            <span className="text-slate-400">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full pl-6 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </aside>
    );
};

export default FilterSidebar;
