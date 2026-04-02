"use client";

import React from 'react';
import Image from 'next/image';
import { Microscope, Activity, Shield, Sparkles, Beaker, ShieldCheck } from 'lucide-react';
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

                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/10 to-blue-500/10 border border-primary/20 mb-6 group-hover:scale-105 transition-transform w-fit">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Pioneering the Future</span>
                        </motion.div>

                        <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-8">
                            Redefining Human <span className="text-primary italic">Potential</span> Through Science.
                        </motion.h2>

                        <div className="space-y-6">
                            <motion.div variants={fadeInUp} className="flex items-start gap-4 group/item">
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-primary/5 shrink-0 group-hover/item:text-primary transition-colors">
                                    <Beaker className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg italic">Pharmaceutical Grade</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">99% pure research compounds synthesized in ISO-certified laboratories.</p>
                                </div>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="flex items-start gap-4 group/item">
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-primary/5 shrink-0 group-hover/item:text-primary transition-colors">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors">Trusted by Researchers</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Our compounds are sourced and synthesized under total quality control, meeting regulatory standards for academic research.</p>
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
                        <Image
                            src="https://images.unsplash.com/photo-1579154235821-f0967969324d?auto=format&fit=crop&w=1200&q=80"
                            alt="Laboratory Research"
                            fill
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 p-6 sm:p-8 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                                <div className="h-1 w-12 bg-primary mb-6 rounded-full" />
                                <p className="text-white text-lg sm:text-xl font-medium leading-relaxed italic drop-shadow-sm">
                                    &quot;Committed to providing the foundational building blocks for tomorrow&apos;s anti-aging and performance breakthroughs.&quot;
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
