import React from 'react';
import Link from 'next/link';
import { HelpCircle, Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

export const metadata = {
    title: 'Contact Support & FAQ | BioLongevity Labs',
    description: 'Get help with your order or browse our frequently asked questions.',
};

export default function ContactPage() {
    return (
        <main className="flex-grow flex flex-col items-center py-16 px-4 md:px-10 lg:px-40 w-full mt-10">
            <div className="max-w-[1200px] w-full flex flex-col gap-12">

                <div className="flex flex-col gap-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        Contact <span className="text-primary">Support</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                        We're here to help with your research compound order or any scientific inquiries you may have. Need an immediate answer? Check our FAQs below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 pointer-events-none rounded-full" />

                    {/* Contact Form */}
                    <div className="flex flex-col gap-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight tracking-tight mb-2 text-slate-900 dark:text-white">Send us a message</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Please provide your Order ID if inquiring about a specific purchase.</p>
                        </div>

                        <form className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="name">Name</label>
                                <input
                                    className="peer flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 px-4 shadow-inner transition-shadow"
                                    id="name"
                                    placeholder="Jane Doe"
                                    required
                                    type="text"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="email">Email Address</label>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 px-4 shadow-inner transition-shadow"
                                    id="email"
                                    placeholder="jane@example.com"
                                    required
                                    type="email"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="orderId">Order ID (Optional)</label>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 h-12 px-4 shadow-inner transition-shadow"
                                    id="orderId"
                                    placeholder="e.g. #ORD-12345"
                                    type="text"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-white" htmlFor="message">Message</label>
                                <textarea
                                    className="flex w-full min-w-0 flex-1 resize-y rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 min-h-[140px] p-4 shadow-inner transition-shadow"
                                    id="message"
                                    placeholder="How can we help you regarding your research?"
                                    required
                                ></textarea>
                            </div>

                            <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-sky-500 text-white text-base font-bold transition-all shadow-lg shadow-primary/25 active:scale-[0.98] gap-2 mt-4">
                                <MessageSquare className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Information & Social */}
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-8">
                            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white relative inline-block">
                                Contact Information
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                            </h2>

                            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">

                                <div className="flex items-start justify-center text-white bg-primary w-10 h-10 rounded-xl shadow-md">
                                    <MapPin className="w-5 h-5 m-auto" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Address</p>
                                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">BioLongevity Labs Headquarters<br />100 Research Parkway<br />San Diego, CA 92121</p>
                                </div>

                                <div className="flex items-start justify-center text-white bg-primary w-10 h-10 rounded-xl shadow-md">
                                    <Phone className="w-5 h-5 m-auto" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Phone</p>
                                    <p className="text-base font-medium text-slate-600 dark:text-slate-400">1-800-BIO-LABS</p>
                                    <p className="text-xs font-bold text-primary mt-2 bg-primary/10 inline-block px-2 py-1 rounded w-max">Mon-Fri 9am-5pm PST</p>
                                </div>

                                <div className="flex items-start justify-center text-white bg-primary w-10 h-10 rounded-xl shadow-md">
                                    <Mail className="w-5 h-5 m-auto" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Email</p>
                                    <a className="text-base font-semibold text-primary hover:text-sky-400 transition-colors" href="mailto:support@biolongevitylabs.com">support@biolongevitylabs.com</a>
                                </div>

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
                            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">How can I track my order?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">Once your order ships, you'll receive a confirmation email with a tracking link. Guest users will receive tracking directly to their provided email address.</p>
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
