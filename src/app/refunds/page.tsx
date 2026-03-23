import React from 'react';
import { RefreshCcw, PackageCheck, CreditCard, AlertTriangle, FlaskConical, Scale } from 'lucide-react';

export const metadata = {
    title: 'Refunds & RUO Compliance | BioLongevity Labs',
    description: 'Learn about our refund policies and Research Use Only (RUO) compliance requirements.',
};

export default function RefundsAndRUOPage() {
    return (
        <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-16 mt-10">
            <div className="flex flex-col max-w-[1000px] flex-1 w-full gap-10">

                {/* Header Section */}
                <section className="flex flex-col gap-4 p-8 md:p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="flex flex-col gap-4 relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                            Refunds & <span className="text-primary">RUO Policy</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
                            Please carefully review our policies regarding refunds and restricted use items. By purchasing, you legally agree to these stringent terms.
                        </p>
                    </div>
                </section>

                {/* Refund Policy Grid */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold leading-tight px-2 text-slate-900 dark:text-white">Refund Policy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-primary/50 hover:shadow-lg transition-all group">
                            <div className="text-primary bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <RefreshCcw className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">30-Day Returns</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    You have 30 days from the date of delivery to return most standard non-chemical items.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-primary/50 hover:shadow-lg transition-all group">
                            <div className="text-primary bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PackageCheck className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Condition Requirements</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Items must be unused, sealed, and in original packaging with intact seals to qualify.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-primary/50 hover:shadow-lg transition-all group">
                            <div className="text-primary bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Refund Processing</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Approved refunds are processed to the original payment method in 5-7 business days.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 rounded-2xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-900 p-6 hover:border-red-500/50 hover:shadow-lg transition-all group">
                            <div className="text-red-500 bg-red-500/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Strict Exceptions</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Research compounds and perishable goods are <strong className="text-red-500">strictly non-refundable</strong> due to degradation risks.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* RUO Compliance Section */}
                <section className="flex flex-col gap-8 bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-inner border border-slate-200 dark:border-slate-800 p-8 md:p-12 mb-10 text-slate-900 dark:text-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-blue-600" />

                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-200 dark:border-slate-700 text-primary">
                            <FlaskConical className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">RUO (Research Use Only) Compliance</h2>
                    </div>

                    <div className="flex flex-col gap-6 relative z-10">
                        <p className="leading-relaxed text-lg">
                            Certain products sold on our platform are designated as <strong>Restricted Use Only (RUO)</strong>. These items are strictly intended for research, laboratory, or industrial use by qualified professionals and institutions.
                        </p>

                        <div className="bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                                <Scale className="w-5 h-5 text-primary" />
                                Buyer Legal Responsibilities
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">Buyers must thoroughly verify their eligibility to purchase and safely handle RUO items before completing checkout.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">RUO products are <strong>not</strong> for human consumption, animal consumption, therapeutic use, or direct diagnostic use under any circumstances.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">The buyer assumes full liability and responsibility for compliance with all local, state, and federal regulations regarding the purchase, handling, administration, and disposal of these items.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                                Note: We reserve the absolute right to cancel and refund any order if we suspect the purchase violates RUO compliance terms, or if the buyer cannot provide necessary credentials or intent upon request.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
