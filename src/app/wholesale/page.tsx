"use client";

import React, { useState } from 'react';
import { 
    Truck, 
    Zap, 
    ShieldCheck, 
    Package, 
    Send, 
    Building2, 
    Users,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function WholesalePage() {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            volume: formData.get('volume'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/wholesale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to submit application');

            toast.success('Application submitted. Our wholesale team will contact you within 24 hours.');
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error('Wholesale Error:', error);
            toast.error('Submission failed. Please try again or contact support.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

                {/* Hero Section */}
                <div className="text-center space-y-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20"
                    >
                        <Building2 className="w-3 h-3" />
                        Research Partnership Program
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white"
                    >
                        Bulk <span className="text-primary italic">Wholesale</span> Solutions
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
                    >
                        Tiered pricing and priority logistics for laboratory research centers, scientific institutions, and verified bulk procurement partners.
                    </motion.p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 relative z-10">
                    {[
                        {
                            icon: Zap,
                            title: 'Volume Pricing',
                            desc: 'Access aggressive tiered discounts starting at just 10 vials. Maximize your research budget.'
                        },
                        {
                            icon: Truck,
                            title: 'Priority Logistics',
                            desc: 'Complimentary overnight shipping on all wholesale orders with temperature-monitored tracking.'
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Batch Consistency',
                            desc: 'Reserve specific batches to ensure long-term study consistency across multiple vials.'
                        }
                    ].map((benefit, i) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <benefit.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Pricing Tiers Table */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-24 bg-slate-900 rounded-[40px] p-8 md:p-16 text-white border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black leading-tight">Tiered Discount <span className="text-primary">Structure</span></h2>
                            <p className="text-slate-400 font-medium">Automatic discounts applied to your cart based on aggregate quantity.</p>
                            
                            <div className="space-y-4">
                                {[
                                    { qty: '10-24 Vials', disc: '10% OFF' },
                                    { qty: '25-49 Vials', disc: '20% OFF' },
                                    { qty: '50-99 Vials', disc: '30% OFF' },
                                    { qty: '100+ Vials', disc: 'CUSTOM QUOTE' }
                                ].map((tier) => (
                                    <div key={tier.qty} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                        <span className="font-black text-slate-300 uppercase tracking-widest text-xs">{tier.qty}</span>
                                        <span className="font-black text-primary">{tier.disc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 text-slate-900 shadow-2xl">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                                Apply for Wholesale
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                        <input name="name" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all" type="text" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company / Lab</label>
                                        <input name="company" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all" type="text" placeholder="Research Institute" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input name="email" required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all" type="email" placeholder="john@research.edu" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Approx. Monthly Volume</label>
                                    <select name="volume" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-primary/20 transition-all appearance-none">
                                        <option>10 - 50 Vials</option>
                                        <option>50 - 200 Vials</option>
                                        <option>200+ Vials</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Context</label>
                                    <textarea name="message" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-primary/20 transition-all resize-none" rows={3} placeholder="Tell us about your research focus..."></textarea>
                                </div>
                                <button 
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-black rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Submit Application
                                </button>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Response within 24 hours guaranteed
                                </p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
