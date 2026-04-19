import React from 'react';
import { FileText, Database, Cookie, Shield, Gavel, Mail } from 'lucide-react';

export const metadata = {
    title: 'Legal Policies & Terms | BioLongevity Labs',
    description: 'Terms and Conditions, Privacy Policy, and Data Collection guidelines for BioLongevity Labs.',
};

export default function TermsPage() {
    return (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 mt-16">
            <aside className="w-full md:w-72 shrink-0 relative">
                <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">Table of Contents</h2>
                    <nav className="flex flex-col gap-2 relative">
                        {/* Connecting line for navigation items */}
                        <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800 -z-10" />

                        <a href="#use-of-site" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Use of Site</span>
                        </a>
                        <a href="#data-collection" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors">
                            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Database className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Data Collection</span>
                        </a>
                        <a href="#cookies" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors">
                            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Cookie className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Cookies</span>
                        </a>
                        <a href="#liability" className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors">
                            <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Shield className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">Limitation of Liability</span>
                        </a>
                    </nav>
                </div>
            </aside>

            <article className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                <header className="mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">Legal Policies & Terms</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Last updated: <span className="text-primary">October 2026</span></p>
                </header>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-10 font-medium font-serif">
                        Welcome to BioLongevity Labs. Please read these Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) carefully before using the BioLongevity Labs website (the &quot;Service&quot;) operated by BioLongevity Labs LLC (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
                    </p>

                    <section id="use-of-site" className="mb-16 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-4">
                            <span className="bg-primary/10 text-primary w-10 h-10 rounded-xl inline-flex items-center justify-center font-bold">1</span>
                            Use of Site
                        </h2>
                        <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                            <p>
                                By accessing this website, you agree to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on BioLongevity Labs&apos; website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                                <li>modify or copy the materials;</li>
                                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>attempt to decompile or reverse engineer any software contained on BioLongevity Labs&apos; website;</li>
                                <li>remove any copyright or other proprietary notations from the materials; or</li>
                                <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
                            </ul>
                        </div>
                    </section>

                    <section id="data-collection" className="mb-16 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-4">
                            <span className="bg-primary/10 text-primary w-10 h-10 rounded-xl inline-flex items-center justify-center font-bold">2</span>
                            Data Collection
                        </h2>
                        <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                            <p>
                                We collect information that you provide directly to us. For example, we collect information when you make a purchase, fill out a form, or communicate with us. The types of information we may collect include your name, email address, postal address, credit card information and other contact or identifying information you choose to provide.
                            </p>
                            <p>
                                We use the information we collect primarily to provide, maintain, protect and improve our current products and to develop new ones. We also use this information to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-primary">
                                <li>Process transactions and send you related information, including confirmations and receipts.</li>
                                <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                                <li>Respond to your comments, questions, and requests and provide customer service.</li>
                            </ul>
                        </div>
                    </section>

                    <section id="cookies" className="mb-16 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-4">
                            <span className="bg-primary/10 text-primary w-10 h-10 rounded-xl inline-flex items-center justify-center font-bold">3</span>
                            Cookies
                        </h2>
                        <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                            <p>
                                We use &quot;cookies&quot; on this site. A cookie is a piece of data stored on a site visitor&apos;s hard drive to help us improve your access to our site and identify repeat visitors to our site. Cookies can also enable us to track and target the interests of our users to enhance the experience on our site. Usage of a cookie is in no way linked to any personally identifiable information on our site.
                            </p>
                            <p>
                                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                            </p>
                        </div>
                    </section>

                    <section id="liability" className="mb-8 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-4">
                            <span className="bg-primary/10 text-primary w-10 h-10 rounded-xl inline-flex items-center justify-center font-bold">4</span>
                            Limitation of Liability
                        </h2>
                        <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
                            <p>
                                In no event shall BioLongevity Labs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                            </p>
                        </div>
                    </section>
                </div>
            </article>
        </main>
    );
}
