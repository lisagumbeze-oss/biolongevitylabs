"use client";

import React from 'react';
import Image from 'next/image';
import { Microscope, Activity, Shield, CheckCircle2, FlaskConical, Award } from 'lucide-react';
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

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://biolongevitylabss.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "About",
                                "item": "https://biolongevitylabss.com/about"
                            }
                        ]
                    })
                }}
            />
            {/* Hero Section for About */}
            <section className="relative overflow-hidden mb-24">
                <div className="absolute inset-0 bg-slate-900">
                    <Image
                        src="/about-hero.png"
                        alt="BioLongevity Labs Research"
                        fill
                        priority
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-black text-xs tracking-widest uppercase mb-8 border border-white/20">
                            <Activity className="w-4 h-4 text-primary" />
                            Our Mission & Vision
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 drop-shadow-lg">
                            Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-400">BioLongevity Labs</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                            Your Trusted Research Partner for premium peptides and bioregulators.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32"
                >
                    <div className="flex flex-col">
                        <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                            Premium Research Peptides & Bioregulators
                        </motion.h2>

                        <motion.div variants={fadeInUp} className="prose prose-lg dark:prose-invert prose-slate mb-10">
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                At <strong>BioLongevity Labs</strong>, we specialize in providing premium research peptides and bioregulators.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                All of our products are meticulously formulated and produced in the United States, with purity levels exceeding 99%. Our expert team is here to meet your needs with precision and reliability.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div variants={fadeInUp} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <FlaskConical className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">99%+ Purity</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Meticulously formulated for maximum research efficacy.</p>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <Award className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">US Manufactured</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Produced in state-of-the-art facilities in the United States.</p>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div variants={fadeInUp} className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-200 dark:border-slate-700">
                        <img
                            src="/about-facility.png"
                            alt="State of the art lab facilities"
                            className="w-full h-full object-cover aspect-square md:aspect-4/3 transform group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                // Fallback image if the scraped one fails to load
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80";
                            }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent" />
                    </motion.div>
                </motion.div>

                {/* State of the Art Facilities Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="bg-slate-50 rounded-3xl p-8 md:p-16 border border-slate-100"
                >
                    <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
                            Manufactured in our state of the art US-based facilities
                        </h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div variants={fadeInUp} className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unmatched Quality</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Our products are manufactured under stringent quality standards, including Good Manufacturing Practices (GMP) and rigorous third-party testing for purity, and consistency.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comprehensive Product Range</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We offer an extensive catalog of products, including standard formulations and advanced blends to meet your research requirements.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Expert Guidance and Support</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We pride ourselves on building lasting relationships. Our dedicated customer service team is available to guide you through every step, from product selection to post-delivery support.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fast and Reliable Shipping</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We deliver quickly and efficiently to ensure you have what you need when you need it. Orders over $400 include free shipping, making access to premium peptides and bioregulators even easier.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={fadeInUp} className="mt-16 text-center">
                        <p className="text-lg text-slate-600 dark:text-slate-400 italic">
                            For custom peptides or wholesale inquiries, contact our support team through our website.
                        </p>
                    </motion.div>

                </motion.div>
            </section>
        </div>
    );
}
