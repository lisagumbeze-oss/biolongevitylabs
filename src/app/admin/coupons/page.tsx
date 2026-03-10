"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Ticket, Edit, Trash2, ToggleLeft, ToggleRight, Loader2, Wand2 } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    minCartAmount: number;
    usageCount: number;
    active: boolean;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: '',
        type: 'percentage',
        value: 10,
        minCartAmount: 0,
        usageCount: 0,
        active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons');
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (coupon?: Coupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData(coupon);
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                type: 'percentage',
                value: 10,
                minCartAmount: 0,
                usageCount: 0,
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCoupon(null);
    };

    const generateCode = () => {
        const prefix = formData.type === 'percentage' ? 'SAVE' : 'OFF';
        const rawval = formData.value || 10;
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        setFormData({ ...formData, code: `${prefix}${rawval}-${randomString}` });
    };

    const saveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchCoupons();
                handleCloseModal();
            } else {
                alert('Failed to save coupon.');
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const toggleStatus = async (coupon: Coupon) => {
        try {
            const updatedCoupon = { ...coupon, active: !coupon.active };
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCoupon)
            });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error('Toggle error:', error);
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchCoupons();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-bold">Loading Coupons...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Coupons & Discounts</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage promotional codes and cart rules.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-sky-500 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="truncate">Add Coupon</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Min. Cart</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredCoupons.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg inline-block">{item.code}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                                        {item.type === 'percentage' ? `${item.value}% OFF` : `$${item.value.toFixed(2)} OFF`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {item.minCartAmount > 0 ? `$${item.minCartAmount.toFixed(2)}` : 'None'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-bold">
                                        {item.usageCount} times
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => toggleStatus(item)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${item.active ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                                            {item.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                            {item.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(item)} className="text-slate-400 hover:text-primary transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteCoupon(item.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-lg" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCoupons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No coupons found. Create a new coupon to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-primary" />
                                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <Trash2 className="w-5 h-5" /> {/* Just using any icon for close if X not imported, actually let's use a standard close btn or just wait it's easier to write 'Cancel' */}
                                Close
                            </button>
                        </div>
                        <form onSubmit={saveCoupon} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex justify-between">
                                        Coupon Code
                                        <button type="button" onClick={generateCode} className="text-primary hover:text-sky-500 flex items-center gap-1 transition-colors">
                                            <Wand2 className="w-3 h-3" /> Auto-generate
                                        </button>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="SUMMER20"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Discount Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary outline-none"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed_amount">Fixed Amount ($)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Discount Value</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary outline-none"
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Minimum Cart Amount ($) <span className="text-slate-400 lowercase font-medium">(Optional)</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.minCartAmount === 0 ? '' : formData.minCartAmount}
                                        onChange={e => setFormData({ ...formData, minCartAmount: e.target.value ? parseFloat(e.target.value) : 0 })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-3 rounded-xl font-black bg-primary flex items-center justify-center text-white hover:bg-sky-500 transition-colors shadow-lg shadow-primary/20">
                                    {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
