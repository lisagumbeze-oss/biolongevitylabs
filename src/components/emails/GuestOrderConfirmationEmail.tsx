import React from 'react';

export default function GuestOrderConfirmationEmail() {
    return (
        <div className="bg-slate-50 text-slate-900 font-sans min-h-screen pt-8 pb-12">
            <div className="max-w-[800px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <header className="flex items-center justify-center border-b border-slate-100 px-10 py-6 bg-slate-50">
                    <div className="flex items-center gap-3 text-sky-500">
                        {/* Using standard text or an SVG instead of material symbols for email compatibility */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                        <h2 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight">Streamlined Store</h2>
                    </div>
                </header>
                <div className="flex flex-col gap-6 p-8 md:p-12">
                    <div className="flex flex-col gap-4 text-center">
                        <p className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Thank You for Your Order!</p>
                        <p className="text-slate-500 text-lg font-normal leading-relaxed max-w-lg mx-auto">We appreciate your business. Your order has been placed successfully. Please find your order details and payment instructions below.</p>
                    </div>

                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-6 text-center mt-4">
                        <h3 className="text-slate-900 tracking-tight text-xl font-medium leading-tight">Order ID</h3>
                        <p className="text-sky-500 font-bold text-3xl mt-2">#ORD-987654321</p>
                    </div>

                    <h2 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight mt-6 pb-2 border-b border-slate-100">Order Summary</h2>

                    <div className="mt-2">
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-slate-600 text-sm font-semibold uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-slate-600 text-sm font-semibold uppercase tracking-wider text-center">Quantity</th>
                                        <th className="px-6 py-4 text-slate-600 text-sm font-semibold uppercase tracking-wider text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    <tr>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium">Premium Wireless Headphones</td>
                                        <td className="px-6 py-5 text-slate-600 text-base text-center">1</td>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium text-right">$199.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium">Ergonomic Mouse</td>
                                        <td className="px-6 py-5 text-slate-600 text-base text-center">2</td>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium text-right">$89.98</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium">Standard Shipping</td>
                                        <td className="px-6 py-5 text-slate-600 text-base text-center">-</td>
                                        <td className="px-6 py-5 text-slate-900 text-base font-medium text-right">$15.00</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-6 py-5 text-slate-900 text-lg font-bold text-right" colSpan={2}>Total</td>
                                        <td className="px-6 py-5 text-sky-500 text-xl font-bold text-right">$303.98</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h2 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight mt-8 pb-2 border-b border-slate-100">Payment Instructions</h2>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-2">
                        <div className="flex items-start gap-4">
                            <div>
                                <h4 className="text-slate-900 font-bold text-lg mb-2">Manual Bank Transfer / Zelle</h4>
                                <p className="text-slate-600 mb-4 leading-relaxed">Please transfer the total amount of <strong>$303.98</strong> to the following account to complete your order. Your order will be shipped once payment is confirmed.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200">
                                    <div>
                                        <span className="block text-sm text-slate-500 mb-1">Zelle Email:</span>
                                        <span className="font-medium text-slate-900">payments@streamlinedstore.com</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-slate-500 mb-1">Account Name:</span>
                                        <span className="font-medium text-slate-900">Streamlined LLC</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="block text-sm text-slate-500 mb-1">Important Note:</span>
                                        <span className="font-medium text-slate-900">Please include your Order ID (#ORD-987654321) in the transfer memo.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                        <h3 className="text-slate-900 font-bold text-lg mb-2">Need Help?</h3>
                        <p className="text-slate-600 mb-6">If you have any questions about your order, please contact our support team.</p>

                        <a href="#" className="inline-flex items-center justify-center bg-sky-500 text-white px-6 py-3 rounded-lg font-medium tracking-wide">
                            Contact Support
                        </a>

                        <p className="text-slate-400 text-sm mt-8">© 2024 Streamlined Store. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
