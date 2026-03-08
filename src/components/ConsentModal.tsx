"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

const ConsentModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [agreedToRUO, setAgreedToRUO] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const consent = localStorage.getItem('biolongevity_consent');
        const sessionConsent = sessionStorage.getItem('biolongevity_consent');

        if (!consent && !sessionConsent) {
            setIsVisible(true);
        }
    }, []);

    const handleYes = () => {
        if (!agreedToRUO) {
            setError('You must agree to the Research Use Only policy to proceed.');
            return;
        }

        if (rememberMe) {
            localStorage.setItem('biolongevity_consent', 'true');
        } else {
            sessionStorage.setItem('biolongevity_consent', 'true');
        }

        setIsVisible(false);
    };

    const handleNo = () => {
        router.push('/access-denied');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-blue-500" />

                <div className="p-8 sm:p-10 flex flex-col items-center text-center">

                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            BioLongevity <span className="text-primary">Labs</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 tracking-wide uppercase">
                            Age & Policy Verification
                        </p>
                    </div>

                    <div className="space-y-6 w-full mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Are you 21 years of age or older?
                        </h3>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={handleNo}
                                className="w-full sm:w-32 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                            >
                                No
                            </button>
                            <button
                                onClick={handleYes}
                                className="w-full sm:w-32 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                            >
                                Yes
                            </button>
                        </div>
                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 text-left">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="shrink-0 mt-0.5 relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={agreedToRUO}
                                    onChange={(e) => {
                                        setAgreedToRUO(e.target.checked);
                                        if (error) setError('');
                                    }}
                                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="leading-relaxed font-medium">
                                I agree and understand that certain products on this site are intended for research use only, as defined by the FDA. I also agree to the <a href="/refunds" className="text-primary hover:text-primary/80 transition-colors">Research Use Only Policy</a> of this site.
                            </span>
                        </label>

                        <div className="flex justify-center pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer appearance-none w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all cursor-pointer"
                                    />
                                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-medium text-slate-500 dark:text-slate-400">Remember me</span>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
