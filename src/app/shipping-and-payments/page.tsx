import React from 'react';
import { Truck, ShieldCheck, RefreshCcw, CreditCard, UserCheck, HeartHandshake } from 'lucide-react';

export const metadata = {
    title: 'Shipping and Payments | BioLongevity Labs',
    description: 'Information regarding shipping options, privacy, secure payments, and returns policy for BioLongevity Labs.',
};

export default function ShippingAndPaymentsPage() {
    return (
        <main className="grow flex flex-col items-center py-16 px-4 md:px-10 lg:px-40 w-full mt-10">
            <div className="max-w-[1000px] w-full flex flex-col gap-16">

                {/* Header */}
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
                        Shipping & <span className="text-primary">Payments</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        Everything you need to know about our fast, secure shipping protocols and payment options. Let us handle the logistics so you can focus on the research.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-12">

                    {/* Shipping & Delivery */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Shipping & Delivery</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p>
                                We offer multiple shipping options. <strong>FREE shipping with orders over $400.00</strong> (Grand Total before tax and shipping).
                            </p>
                            <p>
                                Options include: USPS Priority, FedEx 2 Day (2 business days), FedEx Overnight, FedEx Overnight – Signature Required, and FedEx Saturday Delivery for orders placed on Fridays before noon PST that need next day delivery.
                            </p>
                            <p>
                                Orders placed, paid, and processed before <strong>12 noon PST</strong> typically ship out the same business day. Orders placed, paid, and processed after 12 noon PST and on weekends and holidays ship out the following business day.
                            </p>
                        </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Privacy & Security</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p>
                                When your order is submitted online, you are protected by 256 Bit SSL (Secure Socket Layer) encryption technology on our secure server. We take your privacy very seriously and follow all federal and state privacy laws to ensure your information is completely secure and confidential.
                            </p>
                            <p>
                                We will not release your personal or order information to anyone and will not use your information for any purpose other than filling your order(s).
                            </p>
                        </div>
                    </div>

                    {/* Returns & Replacements */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                <RefreshCcw className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Returns & Replacements</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p>
                                Due to regulations regarding the sale of our products, <strong>returns are prohibited</strong> for all Research Use Only (RUO) compounds to prevent contamination risks.
                            </p>
                            <p>
                                However, in the event that the order is shipped incorrectly or the items received are not the items ordered, please contact us by email immediately. We will issue a replacement of your original order.
                            </p>
                            <p>
                                We accept returns on unopened supplements within 10 days of delivery; all returns are subject to a 15% restocking fee and will be refunded minus the cost of the return shipping label.
                            </p>
                        </div>
                    </div>

                    {/* Payment, Pricing & Promotions */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payment, Pricing & Promotions</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p>
                                We currently accept secure manual payments including Bank Transfer, Zelle, Venmo, CashApp, and Bitcoin.
                            </p>
                            <p>
                                We offer individual pricing. Please see our products pages for quantity discounts via product variations. Please contact us by email for large bulk discounts.
                            </p>
                        </div>
                    </div>

                    {/* Viewing Orders & Registration */}
                    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Viewing Orders</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p>
                                During checkout, you will have the option to check out as a guest. All relevant tracking information, order status updates, and documentation will be sent securely to the email address provided during checkout.
                            </p>
                            <p>
                                If you have questions about the status of your order or need access to historical invoices, please email our support team with your associated Order ID.
                            </p>
                        </div>
                    </div>

                    {/* Satisfaction Guaranteed */}
                    <div className="flex flex-col gap-4 bg-primary/5 p-8 md:p-10 rounded-3xl border border-primary/20 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(19,127,236,0.3)]">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Satisfaction Guaranteed</h2>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                We are committed to offering outstanding quality and service and we are here to serve you.
                            </p>
                            <p>
                                If you have any question or issue regarding our service, please contact us to let us know the problem. We respond to ALL questions and inquiries promptly.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
