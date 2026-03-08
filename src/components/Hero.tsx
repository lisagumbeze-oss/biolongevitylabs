"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, ShieldCheck, Zap } from "lucide-react";

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-[90vh] flex items-center">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 60, -40, 0],
                        y: [0, -80, 40, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -50, 30, 0],
                        y: [0, 60, -50, 0],
                        scale: [1, 0.8, 1.1, 1],
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[80px]"
                />
                <motion.div
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -30, 60, 0],
                        scale: [1, 1.3, 0.95, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 6 }}
                    className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[90px]"
                />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left column */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <FlaskConical className="w-3.5 h-3.5" />
                            Research-Grade Compounds
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl xl:text-7xl tracking-tight font-black text-white leading-[1.05] mb-6"
                        >
                            Buy Research
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-indigo-400">
                                Peptides for Sale
                            </span>
                            Online
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-300 max-w-lg leading-relaxed mb-8"
                        >
                            Premium purity BPC-157, TB-500, and cutting-edge peptides. USA-made, third-party tested, and research-compliant biotechnology delivered to your door.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap gap-4 mb-12"
                        >
                            <Link
                                href="/shop"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 text-base"
                            >
                                Shop Catalog
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/shop?filter=deals"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-2xl transition-all text-base"
                            >
                                View Deals
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-wrap gap-6"
                        >
                            {[
                                { icon: ShieldCheck, label: "3rd Party Tested" },
                                { icon: Zap, label: "Same-Day Shipping" },
                                { icon: FlaskConical, label: "≥98% Purity" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                                    <Icon className="w-4 h-4 text-primary" />
                                    {label}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right column – product image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        {/* Glowing ring */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-violet-500/20 blur-xl scale-105" />
                        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-slate-900/60">
                            <img
                                className="w-full h-[480px] object-cover"
                                src="/hero-peptides.jpg"
                                alt="Research Peptides for Sale Online"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
