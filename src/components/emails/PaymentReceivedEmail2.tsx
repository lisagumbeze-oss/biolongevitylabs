import React from 'react';

export default function PaymentReceivedEmail2() {
    return (
        <div className="bg-slate-50 font-sans text-slate-900 flex items-center justify-center min-h-screen p-4">
            <div className="relative flex h-auto w-full flex-col bg-white shadow-xl rounded-xl overflow-hidden max-w-[600px] border border-slate-200">
                <div className="flex h-full grow flex-col">
                    <div className="flex flex-1 justify-center py-5">
                        <div className="flex flex-col w-full flex-1">
                            <header className="flex items-center justify-center whitespace-nowrap border-b border-solid border-slate-100 px-10 py-6">
                                <div className="flex items-center gap-4 text-slate-900">
                                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Streamlined E-commerce</h2>
                                </div>
                            </header>

                            <div className="flex flex-col px-8 py-10">
                                <div className="flex flex-col items-center gap-8">
                                    <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    </div>

                                    <div className="flex w-full flex-col items-center gap-4 text-center">
                                        <h1 className="text-2xl font-bold leading-tight text-slate-900">
                                            Friendly Reminder: Payment Pending for Order #1234
                                        </h1>
                                        <p className="text-base font-normal leading-relaxed text-slate-600 max-w-[400px]">
                                            Your order is currently reserved, but requires payment to proceed to shipping. Please follow the manual payment instructions below.
                                        </p>

                                        <div className="bg-amber-50 rounded-lg p-6 w-full mt-4 border border-amber-200 text-left">
                                            <h3 className="text-sm font-semibold text-amber-900 mb-3 uppercase tracking-wider">Manual Payment Instructions</h3>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm border-b border-amber-200/50 pb-2 gap-1 sm:gap-0">
                                                    <span className="text-amber-700">Zelle:</span>
                                                    <span className="font-medium text-amber-900">payments@streamlined.com</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-0">
                                                    <span className="text-amber-700">Wire Transfer:</span>
                                                    <span className="font-medium text-amber-900">Routing: 123456789 | Acct: 987654321</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center w-full gap-4 mt-2">
                                        <a href="#" className="flex w-full max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-sky-500 hover:bg-sky-600 text-white text-base font-medium leading-normal transition-colors">
                                            Contact Support to Confirm
                                        </a>
                                        <a href="#" className="text-sm font-medium text-sky-500 hover:text-sky-600 hover:underline transition-colors">View Order Details</a>
                                    </div>
                                </div>
                            </div>

                            <footer className="flex flex-col gap-6 px-8 py-8 text-center bg-slate-50 border-t border-slate-100">
                                <div className="flex flex-col gap-2">
                                    <p className="text-slate-500 text-sm">
                                        Have questions? Reply to this email or visit our <a href="#" className="text-sky-500 hover:underline">Help Center</a>.
                                    </p>
                                </div>
                                <p className="text-slate-400 text-xs font-normal">© 2023 Streamlined E-commerce. All rights reserved.</p>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
