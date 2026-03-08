"use client";

import React from 'react';
import { Microscope, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const AboutSection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            {/* Background glowing elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="flex flex-col">
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs tracking-widest uppercase mb-8 w-fit shadow-sm border border-primary/20">
                            <Activity className="w-4 h-4" />
                            About BioLongevity Labs
                        </motion.div>

                        <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
                            Advancing the Frontier of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Longevity Research</span>
                        </motion.h2>

                        <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                            BioLongevity Labs is dedicated to providing the highest purity research compounds, including cutting-edge peptides and bioregulators, to scientific communities and researchers worldwide. Our mission is to accelerate discoveries in metabolic function, cellular longevity, and human performance optimization.
                        </motion.p>

                        <div className="space-y-8">
                            <motion.div variants={fadeInUp} className="flex gap-5 group">
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1">
                                    <Microscope className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">Uncompromising Purity</h4>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Every batch is rigorously tested via HPLC and MS to guarantee ≥99% purity, ensuring clean and reproducible research results for your critical protocols.</p>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex gap-5 group">
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-1">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">Trusted by Researchers</h4>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Our compounds are sourced and synthesized under total quality control, meeting the strict standards required for top-tier academic and private laboratories.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image / Graphic Content */}
                    <motion.div
                        variants={fadeInUp}
                        className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-square lg:aspect-auto lg:h-[650px] transform hover:-translate-y-2 transition-transform duration-700"
                    >
                        {/* 
                            Using a high-quality relevant Unsplash image representing a modern lab environment.
                        */}
                        <img
                            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
                            alt="Laboratory Research"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-700" />

                        <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
                            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <div className="h-1 w-12 bg-primary mb-6 rounded-full" />
                                <p className="text-white text-lg sm:text-xl font-medium leading-relaxed italic drop-shadow-sm">
                                    "Committed to providing the foundational building blocks for tomorrow's anti-aging and performance breakthroughs."
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
};

export default AboutSection;
