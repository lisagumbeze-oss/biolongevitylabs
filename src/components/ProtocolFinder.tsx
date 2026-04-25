"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, 
    Brain, 
    Sparkles, 
    Zap, 
    ArrowRight, 
    Check, 
    ShoppingCart, 
    ChevronLeft,
    Beaker,
    ShieldCheck
} from 'lucide-react';
import { protocolGoals, ProtocolGoal } from '@/data/protocols';
import { products } from '@/data/products';
import Link from 'next/link';

const iconMap: any = {
    Activity: Activity,
    Brain: Brain,
    Sparkles: Sparkles,
    Zap: Zap
};

export default function ProtocolFinder() {
    const [step, setStep] = useState(1);
    const [selectedGoal, setSelectedGoal] = useState<ProtocolGoal | null>(null);

    const handleGoalSelect = (goal: ProtocolGoal) => {
        setSelectedGoal(goal);
        setStep(2);
    };

    const getRecommendedProducts = () => {
        if (!selectedGoal) return [];
        return products.filter(p => selectedGoal.recommendedProducts.includes(p.id));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                Research <span className="text-primary">Protocol Finder</span>
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                                Select your primary laboratory research objective to receive a curated peptide stack recommendation.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {protocolGoals.map((goal) => {
                                const Icon = iconMap[goal.icon];
                                return (
                                    <motion.button
                                        key={goal.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleGoalSelect(goal)}
                                        className="text-left p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl hover:border-primary transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                        
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{goal.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {goal.description}
                                        </p>
                                        
                                        <div className="mt-6 flex items-center text-primary font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Analyze Protocols <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <button 
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Objectives
                        </button>

                        <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Recommended Stack
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                                    The <span className="text-primary">{selectedGoal?.title}</span> Protocol
                                </h2>
                                <p className="text-slate-300 text-lg max-w-2xl font-medium">
                                    Our analysis indicates these specific compounds offer the highest synergistic potential for your research goals.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {getRecommendedProducts().map((product) => (
                                <div key={product.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                                    <div className="aspect-video relative bg-slate-50 dark:bg-slate-800 p-8 flex items-center justify-center">
                                        <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-2xl" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-1">
                                                <Beaker className="w-3 h-3" />
                                                99.8% Purity
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6 flex-1 flex flex-col">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{product.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">IN STOCK</span>
                                            </div>
                                            <Link 
                                                href={`/product/${product.id}`}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl active:scale-95"
                                            >
                                                View Compound
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white">Scientific Guarantee</h4>
                                    <p className="text-sm text-slate-500 font-medium">All suggested stacks are verified for compound synergy and purity.</p>
                                </div>
                            </div>
                            <button className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                                Add Full Stack to Cart
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
