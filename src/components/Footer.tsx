"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Beaker, ShieldCheck, Truck, Award, Lock } from "lucide-react";
import PolicyModal from "./PolicyModal";
import { privacyPolicy, ruoPolicy } from "@/data/policies";

const Footer = () => {
    const [activeModal, setActiveModal] = useState<"privacy" | "ruo" | null>(null);

    const trustItems = [
        { icon: Lock, label: "SECURE PAYMENTS", sub: "AES-256 Encryption" },
        { icon: Beaker, label: "LAB TESTED", sub: "Third-party Verified" },
        { icon: Truck, label: "DISCREET SHIPPING", sub: "Fast & Tracked" },
        { icon: Award, label: "SATISFACTION", sub: "60-Day Guarantee" },
    ];

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors">
            {/* Trust Bar */}
            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {trustItems.map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center gap-4 group">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-primary transition-transform group-hover:scale-110">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase">{item.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="https://biolongevitylabs.com/wp-content/uploads/2025/01/BLL-logo-full-HR.webp"
                                alt="BioLongevity Labs Logo"
                                width={200}
                                height={34}
                                className="object-contain dark:brightness-150 transition-all opacity-90 hover:opacity-100"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <Link href="/about" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors">About Us</Link>
                        <Link href="/support" className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors">Customer Service</Link>
                        <Link
                            href="/terms"
                            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
                        >
                            Terms and Conditions
                        </Link>
                        <button
                            onClick={() => setActiveModal("privacy")}
                            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setActiveModal("ruo")}
                            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
                        >
                            RUO Policy
                        </button>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-400 text-center md:text-left font-medium">
                        © {new Date().getFullYear()} BioLongevity Labs. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex space-x-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                        <span>Research Use Only</span>
                        <span>Not for Human Consumption</span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PolicyModal
                isOpen={activeModal === "privacy"}
                onClose={() => setActiveModal(null)}
                title="Privacy Policy"
                content={privacyPolicy}
            />
            <PolicyModal
                isOpen={activeModal === "ruo"}
                onClose={() => setActiveModal(null)}
                title="Research Use Only Policy"
                content={ruoPolicy}
            />
        </footer>
    );
};

export default Footer;
