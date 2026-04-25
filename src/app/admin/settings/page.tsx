"use client";

import React, { useState, useEffect } from 'react';
import { 
    Settings, 
    Truck, 
    CreditCard, 
    Globe, 
    Mail, 
    ShieldAlert, 
    Save, 
    Loader2, 
    Check,
    AlertTriangle,
    Info,
    Plus,
    Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsAdminPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'payments'>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success('Settings saved successfully');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast.error('Could not save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateGeneral = (field: string, value: any) => {
        setSettings({
            ...settings,
            general: { ...settings.general, [field]: value }
        });
    };

    const updateShipping = (zone: string, field: string, value: string) => {
        setSettings({
            ...settings,
            shipping: {
                ...settings.shipping,
                [zone]: { ...settings.shipping[zone], [field]: value }
            }
        });
    };

    const updatePayment = (id: string, field: string, value: any) => {
        setSettings({
            ...settings,
            paymentMethods: settings.paymentMethods.map((pm: any) => 
                pm.id === id ? { ...pm, [field]: value } : pm
            )
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing systems...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Global Configuration</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage laboratory identifiers, shipping zones, and scientific protocols.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Deploy Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm w-fit">
                {[
                    { id: 'general', label: 'General', icon: Settings },
                    { id: 'shipping', label: 'Logistics', icon: Truck },
                    { id: 'payments', label: 'Revenue', icon: CreditCard },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* General Settings */}
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Laboratory Identity
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Store Name</label>
                                        <input 
                                            type="text"
                                            value={settings.general?.storeName}
                                            onChange={(e) => updateGeneral('storeName', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                type="email"
                                                value={settings.general?.supportEmail}
                                                onChange={(e) => updateGeneral('supportEmail', e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <div className="flex items-center justify-between p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                                <ShieldAlert className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-rose-900 dark:text-rose-100">Maintenance Mode</h4>
                                                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Suspend public access for laboratory re-calibration.</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => updateGeneral('maintenanceMode', !settings.general?.maintenanceMode)}
                                            className={`relative w-14 h-8 rounded-full transition-colors ${settings.general?.maintenanceMode ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings.general?.maintenanceMode ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-4">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-3 h-3" />
                                    System Status
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Supabase Sync</span>
                                        <span className="text-emerald-500">CONNECTED</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Environment</span>
                                        <span className="text-slate-900 dark:text-white uppercase">Production</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">Node Version</span>
                                        <span className="text-slate-900 dark:text-white">v20.x</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shipping Settings */}
                {activeTab === 'shipping' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['usa', 'international'].map((zone) => (
                            <div key={zone} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-primary" />
                                    {zone === 'usa' ? 'Domestic (USA)' : 'International'} Logistics
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Standard Research Rate ($)</label>
                                        <input 
                                            type="text"
                                            value={settings.shipping?.[zone]?.standardRate}
                                            onChange={(e) => updateShipping(zone, 'standardRate', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority Express Rate ($)</label>
                                        <input 
                                            type="text"
                                            value={settings.shipping?.[zone]?.priorityRate}
                                            onChange={(e) => updateShipping(zone, 'priorityRate', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Free Logistics Threshold ($)</label>
                                        <input 
                                            type="text"
                                            value={settings.shipping?.[zone]?.freeShippingThreshold}
                                            onChange={(e) => updateShipping(zone, 'freeShippingThreshold', e.target.value)}
                                            className="w-full bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 text-sm font-black text-emerald-600 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payment Methods */}
                {activeTab === 'payments' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {settings.paymentMethods?.map((pm: any) => (
                                <div key={pm.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/3 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{pm.name}</h3>
                                            <button 
                                                type="button"
                                                onClick={() => updatePayment(pm.id, 'enabled', !pm.enabled)}
                                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pm.enabled ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}
                                            >
                                                {pm.enabled ? 'Enabled' : 'Disabled'}
                                            </button>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Method Type</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Un-monitored Direct Transfer</p>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-2/3 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Checkout Instructions</label>
                                        <textarea 
                                            value={pm.instructions}
                                            onChange={(e) => updatePayment(pm.id, 'instructions', e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-medium focus:ring-primary/20 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
