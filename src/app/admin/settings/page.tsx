"use client";

import React, { useState } from 'react';
import { Settings, Truck, Shield, CreditCard, Save, Link as LinkIcon, Info } from 'lucide-react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('shipping');

    // Shipping State
    const [taxConfig, setTaxConfig] = useState('auto');
    const [flatRate, setFlatRate] = useState('9.99');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('149.00');

    // Payment State
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            name: 'Zelle Transfer',
            iconUrl: '',
            instructions: 'Please send payment to payments@biolongevitylabs.com via Zelle. Include your order number in the memo.',
            enabled: true
        },
        {
            id: 2,
            name: 'CashApp',
            iconUrl: '',
            instructions: 'Send funds to $BioLongevs. Your order will be processed once verified.',
            enabled: true
        },
        {
            id: 3,
            name: 'Bank Wire Transfer',
            iconUrl: '',
            instructions: 'Account Name: BioLongevity Labs LLC\nRouting: XXXXXX\nAccount: YYYYYYY',
            enabled: false
        },
        { id: 4, name: '', iconUrl: '', instructions: '', enabled: false },
        { id: 5, name: '', iconUrl: '', instructions: '', enabled: false }
    ]);

    const updatePaymentMethod = (index: number, field: keyof typeof paymentMethods[0], value: string | number | boolean) => {
        const newMethods = [...paymentMethods];
        newMethods[index] = { ...newMethods[index], [field]: value };
        setPaymentMethods(newMethods);
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            {/* Page Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Store Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Configure tax settings, shipping rates, and manual payment methods.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Settings Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'general' ? 'bg-primary/10 text-primary font-bold shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm">General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'shipping' ? 'bg-primary/10 text-primary font-bold shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Truck className="w-5 h-5" />
                            <span className="text-sm">Shipping & Tax</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'payments' ? 'bg-primary/10 text-primary font-bold shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-sm">Payments</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('policies')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${activeTab === 'policies' ? 'bg-primary/10 text-primary font-bold shadow-inner' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <Shield className="w-5 h-5" />
                            <span className="text-sm">Policies</span>
                        </button>
                    </nav>
                </aside>

                <div className="flex flex-col gap-8 flex-1">

                    {/* --- SHIPPING & TAX TAB --- */}
                    {activeTab === 'shipping' && (
                        <>
                            {/* Tax Configuration Section */}
                            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tax Configuration</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Determine how sales tax is calculated at checkout.</p>
                                </div>
                                <div className="p-8 flex flex-col gap-4">
                                    <label className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all relative ${taxConfig === 'auto' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        <input
                                            name="tax_config"
                                            type="radio"
                                            checked={taxConfig === 'auto'}
                                            onChange={() => setTaxConfig('auto')}
                                            className="mt-0.5 w-5 h-5 text-primary bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-primary focus:ring-2"
                                        />
                                        <div className="flex flex-col flex-1 pr-16">
                                            <span className="text-base font-bold text-slate-900 dark:text-white">Automatic US Sales Tax</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Automatically calculate and collect precise US sales tax based on the customer&apos;s exact location.</span>
                                        </div>
                                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg absolute top-5 right-5">Recommended</span>
                                    </label>

                                    <label className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${taxConfig === 'manual' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        <input
                                            name="tax_config"
                                            type="radio"
                                            checked={taxConfig === 'manual'}
                                            onChange={() => setTaxConfig('manual')}
                                            className="mt-0.5 w-5 h-5 text-primary bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-primary focus:ring-2"
                                        />
                                        <div className="flex flex-col flex-1">
                                            <span className="text-base font-bold text-slate-900 dark:text-white">Manual State Tax Rates</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Manually set specific flat tax rates for each US state. Requires manual updates when state laws change.</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Shipping Rates Section */}
                            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Shipping Rates & Carriers</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set flat shipping rates, offer free shipping, and select active carriers.</p>
                                </div>
                                <div className="p-8 flex flex-col gap-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="flat_rate">Standard Flat Rate</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-medium">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow"
                                                    id="flat_rate"
                                                    type="text"
                                                    value={flatRate}
                                                    onChange={(e) => setFlatRate(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Default rate applied if free shipping isn&apos;t met.</p>
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="free_shipping">Free Shipping Threshold</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-medium">$</div>
                                                <input
                                                    className="pl-8 flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 shadow-inner transition-shadow"
                                                    id="free_shipping"
                                                    type="text"
                                                    value={freeShippingThreshold}
                                                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Orders above this amount ship for free.</p>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-slate-800" />

                                    {/* Carrier Selection */}
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Active US Carriers</h3>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/50 transition-colors cursor-pointer group">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-primary" />
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs shadow-sm">USPS</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">USPS Priority Mail</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Standard domestic delivery (2-3 days).</p>
                                                    </div>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary/50 transition-colors cursor-pointer group">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-primary bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-primary" />
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs shadow-sm">FedEx</div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">FedEx Express</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">Expedited and overnight options.</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* --- PAYMENTS TAB --- */}
                    {activeTab === 'payments' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-2">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Manual Payment Methods</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Configure up to 5 manual payment methods to offer customers at checkout. These allow direct purchases without automated gateways, ideal for high-risk research compounds.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {paymentMethods.map((method, index) => (
                                <div key={method.id} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-opacity ${!method.enabled && method.id > 3 ? 'opacity-60 grayscale-50' : ''}`}>
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="text-slate-900 dark:text-white text-xl font-bold flex items-center gap-3">
                                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">
                                                {method.id}
                                            </span>
                                            Payment Method {method.id}
                                        </h3>
                                        <label className="relative inline-flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={method.enabled}
                                                onChange={(e) => updatePaymentMethod(index, 'enabled', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-700 peer-checked:bg-primary"></div>
                                            <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-tight">Show on Checkout</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <label className="flex flex-col flex-1 gap-2">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Method Name (e.g., Zelle, Wire)</span>
                                            <input
                                                className="form-input w-full rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary h-12 px-4 shadow-inner"
                                                placeholder="Enter name"
                                                value={method.name}
                                                onChange={(e) => updatePaymentMethod(index, 'name', e.target.value)}
                                            />
                                        </label>
                                        <label className="flex flex-col flex-1 gap-2">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Icon/Logo URL (Optional)</span>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <LinkIcon className="text-slate-400 w-4 h-4" />
                                                </div>
                                                <input
                                                    className="form-input w-full rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary h-12 pl-11 px-4 shadow-inner"
                                                    placeholder="https://..."
                                                    value={method.iconUrl}
                                                    onChange={(e) => updatePaymentMethod(index, 'iconUrl', e.target.value)}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <label className="flex flex-col w-full gap-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Payment Instructions / Account Details</span>
                                        <textarea
                                            className="form-textarea w-full rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary min-h-[120px] p-4 shadow-inner resize-y"
                                            placeholder="Enter instructions shown to the customer after selecting this method..."
                                            value={method.instructions}
                                            onChange={(e) => updatePaymentMethod(index, 'instructions', e.target.value)}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- GENERAL / POLICIES TAB PLACEHOLDERS --- */}
                    {(activeTab === 'general' || activeTab === 'policies') && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed animate-in fade-in duration-300">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                {activeTab === 'general' ? <Settings className="w-8 h-8 text-slate-400" /> : <Shield className="w-8 h-8 text-slate-400" />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{activeTab} Settings</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
                                This section is currently under development. Selected configurations from other platforms will appear here soon.
                            </p>
                        </div>
                    )}

                    {/* Global Save Actions */}
                    <div className="flex justify-end gap-4 pt-2 mb-10 sticky bottom-6 bg-background-light dark:bg-background-dark/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <button className="px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button className="px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-sky-500 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
