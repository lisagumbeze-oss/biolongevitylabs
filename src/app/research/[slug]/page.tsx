"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark } from "lucide-react";
import { researchPosts } from "@/data/researchPosts";
import { motion } from "framer-motion";

// Very simple markdown parser for the included data
const parseMarkdown = (text: string) => {
    let html = text
        .replace(/^# (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-12 mb-6 tracking-tight">$1</h2>')
        .replace(/^## (.*$)/gim, '<h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-5">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc mb-2">$1</li>')
        // Wrap contiguous text blocks in <p> tags if they aren't headers or lists
        .split('\n\n').filter(Boolean).map(block => {
            if (block.startsWith('<h') || block.startsWith('<li')) return block;
            return `<p class="mb-6 text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">${block}</p>`;
        }).join('\n');

    // Group adjacent li tags into ul
    html = html.replace(/(<li.*<\/li>\n)+/g, '<ul class="mb-6">$1</ul>');

    return { __html: html };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = researchPosts.find(p => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const otherPosts = researchPosts.filter(p => p.id !== post.id).slice(0, 3);

    return (
        <div className="bg-background min-h-screen">
            {/* Article Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "image": [
                            post.imageUrl.startsWith("http") ? post.imageUrl : `https://biolongevitylabss.com${post.imageUrl}`
                        ],
                        "datePublished": post.date,
                        "author": {
                            "@type": "Person",
                            "name": post.author
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "BioLongevity Labs",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://biolongevitylabss.com/logo.png"
                            }
                        },
                        "description": post.excerpt
                    })
                }}
            />

            {/* Post Header Hero */}
            <div className="relative h-[60vh] min-h-[500px] w-full mt-20">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

                <div className="absolute inset-0 flex items-end pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10">
                        <Link href="/research" className="inline-flex items-center text-primary font-bold mb-8 hover:text-white transition-colors group bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Research
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 font-medium mb-4">
                            <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-slate-500">•</span>
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <article className="lg:w-2/3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                        >
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={parseMarkdown(post.content)}
                            />

                            {/* Tags & Sharing */}
                            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-slate-400" />
                                    <div className="flex gap-2">
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-1.5 rounded-lg">Research</span>
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold px-4 py-1.5 rounded-lg">Science</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Share:</span>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 space-y-8">
                        {/* Author Info */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center text-primary border border-primary/20">
                                <User className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">{post.author}</h2>
                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
                                Senior scientific reviewer and content editor at BioLongevity Labs.
                            </p>
                            <button className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold py-3 rounded-xl hover:border-primary transition-colors">
                                View Articles
                            </button>
                        </div>

                        {/* Newsletter Mini */}
                        <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-3xl p-8 border border-primary/20">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Newsletter</h2>
                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-sm">
                                Get exclusive research updates delivered weekly.
                            </p>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-white dark:bg-slate-800 border-[1px] border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm"
                            />
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/30">
                                Subscribe
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Read More Section */}
            <div className="bg-slate-50 dark:bg-slate-950/50 py-16 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10 text-center">Continue Reading</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {otherPosts.map((otherPost) => (
                            <Link key={otherPost.id} href={`/research/${otherPost.slug}`} className="group block">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={otherPost.imageUrl}
                                            alt={otherPost.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {otherPost.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                            {otherPost.excerpt}
                                        </p>
                                        <span className="text-primary text-sm font-bold uppercase tracking-wider mt-auto">
                                            Read Article
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
