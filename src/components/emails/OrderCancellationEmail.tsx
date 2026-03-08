import React from 'react';

export default function OrderCancellationEmail() {
    return (
        <div className="bg-slate-50 font-sans text-slate-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[600px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <header className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold tracking-tight">Streamlined Store</h2>
                    </div>
                    <a href="#" className="text-sm font-medium text-slate-600">Shop Now</a>
                </header>

                <main className="px-8 py-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Order Canceled</h1>
                    <p className="text-lg font-medium text-slate-600 mb-6">Your Order #1234 has been canceled</p>

                    <div className="bg-slate-50 rounded-lg p-5 w-full mb-8 text-left border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Reason for Cancellation</h3>
                        <p className="text-slate-600">Payment was not received within the required 24-hour timeframe. As a guest checkout, unpaid orders are automatically released.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <a href="#" className="bg-sky-500 text-white font-bold py-3 px-6 rounded-lg text-center w-full sm:w-auto">
                            Shop Again
                        </a>
                        <a href="#" className="bg-slate-200 text-slate-900 font-bold py-3 px-6 rounded-lg text-center w-full sm:w-auto">
                            Contact Support
                        </a>
                    </div>

                    <div className="mt-8 text-sm text-slate-500">
                        <p>Need help? <a href="#" className="text-sky-500 hover:underline">Reach out to our support team</a>.</p>
                    </div>
                </main>

                <footer className="px-8 py-6 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                    <p className="mb-2">This is an automated message, please do not reply directly to this email.</p>
                    <p>© 2024 Streamlined E-commerce. All rights reserved.</p>
                    <div className="mt-3 flex justify-center gap-4">
                        <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-900">Terms of Service</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
