"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, Beaker, CheckCircle2 } from "lucide-react";
import { PROTOCOL_QUESTIONS, getRecommendations, Recommendation } from "@/lib/protocol-logic";
import Link from "next/link";
import { products } from "@/data/products";

const ProtocolFinder = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (questionId: string, optionId: string) => {
        const newAnswers = { ...answers, [questionId]: optionId };
        setAnswers(newAnswers);

        if (step < PROTOCOL_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setShowResults(true);
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setShowResults(false);
    };

    if (showResults) {
        const recommendations = getRecommendations(answers);
        
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl mx-auto p-1"
            >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-12 shadow-2xl shadow-primary/5">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full mb-6">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol Matched</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Your Recommended Compound</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Based on your research objectives, these compounds represent the highest efficacy profile.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {recommendations.map((rec) => {
                            const product = products.find(p => p.id === rec.productId);
                            if (!product) return null;

                            return (
                                <Link 
                                    key={rec.productId}
                                    href={`/product/${product.id}`}
                                    className="group relative bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-6 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden shrink-0">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                            <p className="text-xs font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                        {rec.reason}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Study Product</span>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={reset}
                            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                        >
                            Start New Assessment
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const currentQuestion = PROTOCOL_QUESTIONS[step];

    return (
        <div className="w-full max-w-4xl mx-auto p-1">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-12 shadow-2xl shadow-primary/5">
                {/* Progress */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex gap-1.5">
                        {PROTOCOL_QUESTIONS.map((_, i) => (
                            <div 
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-primary' : 'w-1.5 bg-slate-200 dark:bg-slate-800'}`}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {step + 1} of {PROTOCOL_QUESTIONS.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-12 leading-[1.1]">
                            {currentQuestion.text}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                                    className="group relative text-left p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-700/50 hover:border-primary/50 hover:bg-primary/[0.02] hover:shadow-2xl hover:shadow-primary/5 transition-all outline-none"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                            {option.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{option.label}</h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{option.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {step > 0 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Previous Step
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProtocolFinder;
