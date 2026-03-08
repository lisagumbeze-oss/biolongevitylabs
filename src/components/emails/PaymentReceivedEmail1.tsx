import React from 'react';

export default function PaymentReceivedEmail1() {
    return (
        <div className="bg-slate-50 font-sans text-slate-900 flex items-center justify-center min-h-screen p-4">
            <div className="relative flex h-auto w-full flex-col bg-white shadow-xl rounded-xl overflow-hidden max-w-[600px] border border-slate-200">
                <div className="flex h-full grow flex-col">
                    <div className="flex flex-1 justify-center py-5">
                        <div className="flex flex-col w-full flex-1">
                            {/* Header */}
                            <header className="flex items-center justify-center whitespace-nowrap border-b border-solid border-slate-100 px-10 py-6">
                                <div className="flex items-center gap-4 text-slate-900">
                                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">BioLongevity Labs</h2>
                                </div>
                            </header>

                            {/* Content */}
                            <div className="flex flex-col px-8 py-10">
                                <div className="flex flex-col items-center gap-8">
                                    {/* Success Icon */}
                                    <div className="w-24 h-24 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>

                                    {/* Main Message */}
                                    <div className="flex w-full flex-col items-center gap-4 text-center">
                                        <h1 className="text-2xl font-bold leading-tight text-slate-900">
                                            Thank you, we&apos;ve received your payment!
                                        </h1>
                                        <p className="text-base font-normal leading-relaxed text-slate-600 max-w-[400px]">
                                            Your order <strong>#1234</strong> is now in the &apos;Preparing for Shipment&apos; stage.
                                        </p>

                                        {/* Order Detail Box */}
                                        <div className="bg-slate-50 rounded-lg p-6 w-full mt-4 border border-slate-100">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Order Status:</span>
                                                    <span className="font-medium text-sky-500">Preparing for Shipment</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Estimated Shipping:</span>
                                                    <span className="font-medium text-slate-900">Oct 15, 2023</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <a href="#" className="flex w-full max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white text-base font-medium leading-normal transition-colors">
                                        Contact Support
                                    </a>
                                </div>
                            </div>

                            {/* Footer */}
                            <footer className="flex flex-col gap-6 px-8 py-8 text-center bg-slate-50 border-t border-slate-100">
                                <div className="flex flex-col gap-2">
                                    <p className="text-slate-500 text-sm">
                                        Have questions? Reply to this email or visit our <a href="#" className="text-sky-500 hover:underline">Help Center</a>.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {/* Social Links placeholders */}
                                </div>
                                <p className="text-slate-400 text-xs font-normal">© 2023 BioLongevity Labs. All rights reserved.</p>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
