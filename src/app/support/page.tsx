"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, Mail, MapPin, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message');
            }

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main className="grow flex flex-col items-center py-16 px-4 md:px-10 lg:px-40 w-full mt-10">
            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "How can I track my order?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Once your order ships, you'll receive a confirmation email with a tracking link. Guest users will receive tracking directly to their provided email address."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is your refund policy?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Due to the sensitive nature of research compounds, RUO items are strictly non-refundable once shipped to ensure absolute purity and prevent contamination risks. See our policies page for details."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Do I need an account to buy?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No, you can check out securely as a guest. We respect your privacy. All necessary order details and purity certifications will be sent directly to your email."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Are these products for human use?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No. All BioLongevity Labs products are strictly sold for laboratory Research Use Only (RUO). They are not intended for human or animal consumption."
                                }
                            }
                        ]
                    })
                }}
            />
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
                                "name": "Support",
                                "item": "https://biolongevitylabss.com/support"
                            }
                        ]
                    })
                }}
            />
            <div className="max-w-[1200px] w-full flex flex-col gap-12">

                <div className="flex flex-col gap-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 mb-2">
                        Contact <span className="text-primary">Support</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                        We&apos;re here to help with your research compound order or any scientific inquiries you may have. Need an immediate answer? Check our FAQs below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 pointer-events-none rounded-full" />

                    {/* Contact Form */}
                    <div className="flex flex-col gap-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight tracking-tight mb-2 text-slate-900 dark:text-white">Send us a message</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Please provide your contact details so our team can reach out.</p>
                        </div>

                        {/* Success / Error Banners */}
                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl"
                                >
                                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                                    <div>
                                        <p className="text-emerald-800 dark:text-emerald-300 font-bold text-sm">Message sent successfully!</p>
                                        <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">Our team will get back to you within 24 hours.</p>
                                    </div>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl"
                                >
                                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                                    <div>
                                        <p className="text-red-800 dark:text-red-300 font-bold text-sm">Failed to send message</p>
                                        <p className="text-red-600 dark:text-red-400 text-xs mt-0.5">{errorMessage}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="name">Name</label>
                                <input
                                    className="peer flex w-full min-w-0 flex-1 resize-none rounded-xl text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-14 px-5 shadow-inner transition-shadow"
                                    id="name"
                                    placeholder="Jane Doe"
                                    required
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="email">Email Address</label>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none rounded-xl text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-14 px-5 shadow-inner transition-shadow"
                                    id="email"
                                    placeholder="jane@example.com"
                                    required
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="phone">Phone Number</label>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none rounded-xl text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-14 px-5 shadow-inner transition-shadow"
                                    id="phone"
                                    placeholder="+1 (555) 000-0000"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="message">Message</label>
                                <textarea
                                    className="flex w-full min-w-0 flex-1 resize-y rounded-xl text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 min-h-[180px] p-5 shadow-inner transition-shadow"
                                    id="message"
                                    placeholder="How can we help you regarding your research?"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={status === 'loading'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-sky-500 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 active:scale-[0.98] gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Information & Social */}
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-6">
                            <motion.h2 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold leading-tight tracking-tight text-slate-900 relative inline-block mb-4"
                            >
                                Contact Information
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                            </motion.h2>

                            <div className="flex flex-col gap-6">
                                {/* Address Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-[auto_1fr] gap-x-6 items-start bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-center text-white bg-primary w-10 h-10 rounded-xl shadow-md">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Address</p>
                                        <p className="text-base font-medium text-slate-600 dark:text-slate-400">F2 Nutrition Inc.<br />405 Rothrock Rd #106<br />Akron, OH 44321</p>
                                    </div>
                                </motion.div>

                                {/* Email Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="grid grid-cols-[auto_1fr] gap-x-6 items-start bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-center text-white bg-primary w-10 h-10 rounded-xl shadow-md">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">Email</p>
                                        <a className="text-base font-bold text-primary hover:text-sky-600 transition-colors" href="mailto:support@biolongevitylabss.com">support@biolongevitylabss.com</a>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-10">
                    <div className="text-center md:text-left flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <HelpCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 uppercase">Frequently Asked Questions</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">How can I track my order?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">Once your order ships, you&apos;ll receive a confirmation email with a tracking link. Guest users will receive tracking directly to their provided email address.</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">What is your refund policy?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">Due to the sensitive nature of research compounds, <strong className="text-red-500">RUO items are strictly non-refundable</strong> once shipped to ensure absolute purity and prevent contamination risks. See our policies page for details.</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">Do I need an account to buy?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">No, you can check out securely as a guest. We respect your privacy. All necessary order details and purity certifications will be sent directly to your email.</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">Are these products for human use?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">No. All BioLongevity Labs products are strictly sold for laboratory Research Use Only (RUO). They are not intended for human or animal consumption.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
