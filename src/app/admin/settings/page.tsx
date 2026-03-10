"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Truck, Shield, CreditCard, Save, Link as LinkIcon, Info, Lock, Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    instructions: string;
    enabled: boolean;
}

interface ShippingZone {
    standardRate: string;
    priorityRate: string;
    freeShippingThreshold: string;
}

interface StoreSettings {
    taxConfig: string;
    shipping: {
        usa: ShippingZone;
        international: ShippingZone;
    };
    paymentMethods: PaymentMethod[];
}

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('shipping');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Store Settings State
    const [settings, setSettings] = useState<StoreSettings>({
        taxConfig: 'auto',
        shipping: {
            usa: { standardRate: '15.00', priorityRate: '45.00', freeShippingThreshold: '149.00' },
            international: { standardRate: '55.00', priorityRate: '85.00', freeShippingThreshold: '299.00' }
        },
        paymentMethods: []
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings.');
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Password updated successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.error || 'Failed to update password');
            }
        } catch (error) {
            alert('Server error while updating password');
        }
    };

    const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: string | boolean) => {
        const newMethods = settings.paymentMethods.map(pm =>
            pm.id === id ? { ...pm, [field]: value } : pm
        );
        setSettings({ ...settings, paymentMethods: newMethods });
    };

    const addPaymentMethod = () => {
        const newMethod: PaymentMethod = {
            id: `method_${Date.now()}`,
            name: 'New Payment Method',
            instructions: '',
            enabled: false
        };
        setSettings({ ...settings, paymentMethods: [...settings.paymentMethods, newMethod] });
    };

    const deletePaymentMethod = (id: string) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;
        setSettings({ ...settings, paymentMethods: settings.paymentMethods.filter(pm => pm.id !== id) });
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        Loading Store Settings...
    </div>;

    return (
        <div className="flex flex-col gap-8 max-w-5xl animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Store Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure tax settings, shipping rates, and payment methods.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Settings Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'general' ? 'bg-primary/10 text-primary font-black shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm">General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'shipping' ? 'bg-primary/10 text-primary font-black shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`}
                        >
                            <Truck className="w-5 h-5" />
                            <span className="text-sm">Shipping & Tax</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'payments' ? 'bg-primary/10 text-primary font-black shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm">Payments</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('policies')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'policies' ? 'bg-primary/10 text-primary font-black shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'}`}
                        >
                            <Shield className="w-5 h-5" />
                            <span className="text-sm">Policies</span>
                        </button>
                    </nav>
                </aside>

                <div className="flex flex-col gap-8 flex-1">

                    {/* --- GENERAL TAB (PASSWORD) --- */}
                    {activeTab === 'general' && (
                        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Admin Security</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your administrative access credentials.</p>
                            </div>
                            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary" />
                                        Update Password
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type={showPasswords ? "text" : "password"}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords(!showPasswords)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">New Password</label>
                                                <input
                                                    required
                                                    type={showPasswords ? "text" : "password"}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
                                                <input
                                                    required
                                                    type={showPasswords ? "text" : "password"}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* --- SHIPPING & TAX TAB --- */}
                    {activeTab === 'shipping' && (
                        <>
                            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Tax Configuration</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Determine how sales tax is calculated at checkout.</p>
                                </div>
                                <div className="p-8 flex flex-col gap-4">
                                    <label className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all relative ${settings.taxConfig === 'auto' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        <input
                                            name="tax_config"
                                            type="radio"
                                            checked={settings.taxConfig === 'auto'}
                                            onChange={() => setSettings({ ...settings, taxConfig: 'auto' })}
                                            className="mt-0.5 w-5 h-5 text-primary border-slate-300 dark:border-slate-700 focus:ring-primary focus:ring-2"
                                        />
                                        <div className="flex flex-col flex-1 pr-16">
                                            <span className="text-base font-black text-slate-900 dark:text-white">Automatic US Sales Tax</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-bold">Automatically calculate precise US sales tax based on location.</span>
                                        </div>
                                        <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-lg absolute top-5 right-5 uppercase">Recommended</span>
                                    </label>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">USA Shipping Rates</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Set flat rates and thresholds for domestic orders.</p>
                                </div>
                                <div className="p-8 flex flex-col gap-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Standard Flat Rate</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.usa?.standardRate || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, usa: { ...settings.shipping.usa, standardRate: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority Express Rate</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.usa?.priorityRate || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, usa: { ...settings.shipping.usa, priorityRate: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Free Shipping Threshold</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.usa?.freeShippingThreshold || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, usa: { ...settings.shipping.usa, freeShippingThreshold: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Outside USA Shipping Rates</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Set flat rates and thresholds for international orders.</p>
                                </div>
                                <div className="p-8 flex flex-col gap-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Standard Flat Rate</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.international?.standardRate || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, international: { ...settings.shipping.international, standardRate: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority Express Rate</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.international?.priorityRate || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, international: { ...settings.shipping.international, priorityRate: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Free Shipping Threshold</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-black">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow font-bold"
                                                    type="text"
                                                    value={settings.shipping?.international?.freeShippingThreshold || ''}
                                                    onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, international: { ...settings.shipping.international, freeShippingThreshold: e.target.value } } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* --- PAYMENTS TAB --- */}
                    {activeTab === 'payments' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-2 flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white text-lg">Payment Methods</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                            Direct purchase methods ideal for research compounds.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={addPaymentMethod}
                                    className="bg-primary hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Method
                                </button>
                            </div>

                            {settings.paymentMethods.map((method) => (
                                <div key={method.id} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-all duration-300 ${!method.enabled ? 'opacity-60 grayscale-50' : ''}`}>
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-[200px] mr-4">
                                            <CreditCard className="w-6 h-6 text-primary shrink-0" />
                                            <input
                                                type="text"
                                                value={method.name}
                                                onChange={(e) => updatePaymentMethod(method.id, 'name', e.target.value)}
                                                className="text-slate-900 dark:text-white text-xl font-black bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary focus:outline-none w-full transition-colors p-1 pr-4 -ml-1 placeholder-slate-300 dark:placeholder-slate-700"
                                                placeholder="Payment Method Name"
                                            />
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <label className="relative inline-flex items-center cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={method.enabled}
                                                    onChange={(e) => updatePaymentMethod(method.id, 'enabled', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                            </label>
                                            <button
                                                onClick={() => deletePaymentMethod(method.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                                title="Delete Method"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Instructions</label>
                                            <textarea
                                                className="w-full rounded-xl text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary min-h-[100px] p-4 shadow-inner font-bold"
                                                value={method.instructions}
                                                onChange={(e) => updatePaymentMethod(method.id, 'instructions', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- POLICIES TAB --- */}
                    {activeTab === 'policies' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed animate-in fade-in duration-300">
                            <Shield className="w-12 h-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Policies Management</h3>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Currently managed via platform CMS.</p>
                        </div>
                    )}

                    {/* Global Save Actions */}
                    <div className="flex justify-end gap-4 pt-2 mb-10 sticky bottom-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-10">
                        <button className="px-6 py-3 text-sm font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            disabled={saving}
                            onClick={handleSaveSettings}
                            className="px-8 py-3 text-sm font-black text-white bg-primary hover:bg-sky-500 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
