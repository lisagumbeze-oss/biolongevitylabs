"use client";

import React, { useState } from 'react';
import { Search, Plus, Bell, Edit, Trash2, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import Image from 'next/image';

// Mock inventory data
const initialInventory = [
    {
        id: 1,
        name: 'BPC-157 (5mg)',
        sku: 'PEP-BPC-05',
        price: 49.99,
        stock: 150,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1618413344605-df1a774ea059?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 2,
        name: 'TB-500 (10mg)',
        sku: 'PEP-TB-10',
        price: 89.99,
        stock: 12,
        status: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 3,
        name: 'Semaglutide (3mg)',
        sku: 'PEP-SEM-03',
        price: 120.00,
        stock: 0,
        status: 'Out of Stock',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5e478950c?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: 4,
        name: 'Tirzepatide (10mg)',
        sku: 'PEP-TIR-10',
        price: 150.00,
        stock: 45,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1563213126-a4f653457a41?auto=format&fit=crop&q=80&w=200'
    }
];

export default function AdminInventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

    const filteredInventory = initialInventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            (activeFilter === 'In Stock' && item.stock > 20) ||
            (activeFilter === 'Low Stock' && item.stock > 0 && item.stock <= 20) ||
            (activeFilter === 'Out of Stock' && item.stock === 0);

        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (stock: number) => {
        if (stock === 0) return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
        if (stock <= 20) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 border-primary/20 dark:border-primary/80';
    };

    const getStatusText = (stock: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 20) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage catalog, stock levels, and pricing.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search SKUs, products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                        />
                    </div>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-sky-500 transition-colors shrink-0">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="truncate">Add Product</span>
                    </button>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-sm font-bold transition-all shadow-sm ${activeFilter === filter
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">Image</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[200px]">Product Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono bg-slate-100 dark:bg-slate-800 inline-block px-1.5 py-0.5 rounded">SKU: {item.sku}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                                        ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-bold ${item.stock === 0 ? 'text-rose-600 dark:text-rose-400' : item.stock <= 20 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {item.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(item.stock)}`}>
                                            {getStatusText(item.stock)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No matching inventory found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 gap-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Showing <span className="font-bold text-slate-900 dark:text-white">{filteredInventory.length > 0 ? 1 : 0}</span> to <span className="font-bold text-slate-900 dark:text-white">{filteredInventory.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredInventory.length}</span> results
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-sm shadow-primary/20">1</button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-bold transition-colors">2</button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
