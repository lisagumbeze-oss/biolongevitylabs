"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Search, Tag } from "lucide-react";
import { researchPosts } from "@/data/researchPosts";
import { motion } from "framer-motion";

export default function ResearchPage() {
    // Get the latest post for the featured spot
    const featuredPost = researchPosts[0];
    const regularPosts = researchPosts.slice(1);

    return (
        <div className="bg-background min-h-screen">
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
                                "name": "Research",
                                "item": "https://biolongevitylabss.com/research"
                            }
                        ]
                    })
                }}
            />
            {/* Header Section */}
            <section className="bg-slate-900 dark:bg-slate-950 py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold tracking-widest uppercase text-xs mb-6 border border-primary/20 backdrop-blur-md">
                            Knowledge Base
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Peptide <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Research</span>
                        </h1>
                        <p className="text-xl text-slate-300 font-medium">
                            Research-backed articles on peptide mechanisms and laboratory applications. Expert insights for scientists conducting in vitro studies.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-20">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Latest Research</h2>
                            <Link href={`/research/${featuredPost.slug}`} aria-label={`Read full research article: ${featuredPost.title}`} className="group block">
                                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                                    <div className="relative h-64 md:h-full min-h-[400px] overflow-hidden">
                                        <Image
                                            src={featuredPost.imageUrl}
                                            alt={featuredPost.title}
                                            fill
                                            priority
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute top-6 left-6 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                            {featuredPost.category}
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-4">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="text-slate-300 dark:text-slate-700">•</span>
                                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {featuredPost.author}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors leading-tight">
                                            {featuredPost.title}
                                        </h3>
                                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="inline-flex items-center text-primary font-bold text-lg group-hover:translate-x-2 transition-transform duration-300">
                                            Read Full Article <ArrowRight className="w-5 h-5 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Articles Grid */}
                        <div className="lg:col-span-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">All Articles</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {regularPosts.map((post, i) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link href={`/research/${post.slug}`} aria-label={`Read more about ${post.title}`} className="group block h-full">
                                            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                                                <div className="relative h-56 w-full overflow-hidden">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                                        {post.category}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-3">
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-400 font-medium text-sm mb-6 flex-1 line-clamp-3">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination (Visual Only) */}
                            <div className="mt-16 flex justify-center gap-2">
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30">1</span>
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">2</span>
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">3</span>
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent text-slate-500 font-medium">...</span>
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">7</span>
                                <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Search className="w-5 h-5 text-primary" /> Search Research
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" /> Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Peptide Research", "Quality Control", "Bioregulators", "In Vitro Studies", "Amino Acids", "Cellular Aging"].map((topic, i) => (
                                        <span key={i} className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-3xl p-8 border border-primary/20 text-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Stay Updated</h3>
                                <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-sm">
                                    Subscribe to our newsletter for the latest peptide research, laboratory protocols, and product updates.
                                </p>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/30">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
