"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Printer, Truck, PackageOpen, MonitorSmartphone, Cable,
    History, PersonStanding, CreditCard, StickyNote, Image as ImageIcon,
    ZoomIn, Download, FileText, Info, CheckCircle, XCircle, MoreVertical,
    Clock, MapPin, Mail, Phone, ExternalLink, Edit
} from 'lucide-react';

interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    variation_id?: string;
}

interface AdminOrder {
    id: string;
    customer: string;
    email: string;
    total: string;
    status: string;
    payment_method: string;
    payment_status?: string;
    full_items?: OrderItem[];
    phone?: string;
    shipping_address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const rawId = params.id as string || '';
    // Handle both formats: #ORD-123 and ORD-123
    const fullOrderId = rawId.startsWith('#') ? rawId : `#ORD-${rawId}`;

    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsVerification, setNeedsVerification] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                // Find order by full ID or partial ID
                const foundOrder = data.find((o: AdminOrder) =>
                    o.id === fullOrderId ||
                    o.id === rawId ||
                    o.id.replace('#', '') === rawId.replace('#', '')
                );

                if (foundOrder) {
                    setOrder(foundOrder);
                    setNeedsVerification(foundOrder.status === 'Pending');
                }
            } catch (error: unknown) {
                console.error('Failed to fetch order details:', error);
            } finally {
                setLoading(false);
            }
        };
        if (rawId) fetchOrder();
    }, [rawId, fullOrderId]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!order) return;
        try {
            // Default mapping
            let paymentStatus = order.payment_status;
            if (newStatus === 'Processing' || newStatus === 'Payment Confirmed' || newStatus === 'Shipped') {
                paymentStatus = 'PAID';
            } else if (newStatus === 'Failed') {
                paymentStatus = 'FAILED';
            } else if (newStatus === 'Pending Payments') {
                paymentStatus = 'PENDING';
            }

            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: order.id,
                    status: newStatus,
                    payment_status: paymentStatus
                })
            });

            if (!res.ok) throw new Error('Failed to update order');

            setOrder({ ...order, status: newStatus, payment_status: paymentStatus });
            if (newStatus !== 'Pending' && newStatus !== 'Pending Payments') {
                setNeedsVerification(false);
            } else {
                setNeedsVerification(true);
            }
            alert(`Order status updated to ${newStatus}. Customer has been notified.`);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update order status.');
        }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-400">Loading Order Details...</div>;
    if (!order) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Order Not Found</h2>
            <p className="text-slate-500 mb-8">We couldn't find an order with ID: {fullOrderId}</p>
            <Link href="/admin/orders" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">
                Back to Orders
            </Link>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <Link href="/admin/orders" className="hover:text-primary transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Orders
                        </Link>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">{order.id}</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                        Order {order.id}
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${needsVerification ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 border-primary/20 dark:border-primary/50'}`}>
                            {order.status}
                        </span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${isEditing ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                    >
                        <Edit className="w-4 h-4" />
                        {isEditing ? 'Cancel Editing' : 'Edit Order'}
                    </button>
                    <button
                        onClick={() => handleUpdateStatus('Failed')}
                        className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-rose-500/10 hover:bg-rose-200 dark:hover:bg-rose-900/50"
                    >
                        <XCircle className="w-4 h-4" />
                        Mark as Failed
                    </button>
                    {!needsVerification && order.status !== 'Shipped' && (
                        <button
                            onClick={() => handleUpdateStatus('Shipped')}
                            className="flex items-center gap-2 bg-primary hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-primary/20"
                        >
                            <Truck className="w-4 h-4" />
                            Ship Order
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* ORDER STATUS MODULE */}
                    <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-2 overflow-hidden ${needsVerification ? 'border-amber-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className={`px-8 py-6 flex items-center justify-between border-b ${needsVerification ? 'bg-amber-500/10 border-amber-500/10' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${needsVerification ? 'bg-amber-500/20 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                                    <Info className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`font-black text-xl tracking-tight ${needsVerification ? 'text-amber-900 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                        {needsVerification ? 'Review Payment Status' : 'Manage Order Status'}
                                    </h2>
                                    <p className={`text-xs font-bold uppercase tracking-wider ${needsVerification ? 'text-amber-700/70 dark:text-amber-500/50' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {needsVerification ? 'Action required to process order' : 'Update the current stage of this order'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 w-full md:w-auto">
                                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Expected Amount</p>
                                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{order.total}</p>
                                <p className="text-xs font-bold text-primary mt-2">{order.payment_method}</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update Status</label>
                                    <select
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Pending Payments">Pending Payments</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Payment Confirmed">Payment Confirmed</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <PackageOpen className="w-5 h-5 text-slate-400" />
                                Items List
                            </h3>
                            <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">{order.full_items?.length || 0} Items Ordered</span>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-8 py-4">Product Details</th>
                                        <th className="px-8 py-4 text-center">Qty</th>
                                        <th className="px-8 py-4 text-right">Price</th>
                                        <th className="px-8 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {(order.full_items || []).map((item: OrderItem, i: number) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                                        <ImageIcon className="w-6 h-6 opacity-30" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white text-sm">{item.product_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {item.product_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center font-black text-slate-900 dark:text-white">x{item.quantity}</td>
                                            <td className="px-8 py-6 text-right font-bold text-slate-500 dark:text-slate-400">${item.price?.toFixed(2)}</td>
                                            <td className="px-8 py-6 text-right font-black text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Financials Summary */}
                        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <div className="w-full max-w-xs space-y-4">
                                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 dark:text-white">${(parseFloat(order.total.replace('$', '')) - (order.status === 'Express' ? 15 : 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-slate-900 dark:text-white">{parseFloat(order.total.replace('$', '')) > 200 ? 'FREE' : '$15.00'}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <span className="font-black text-slate-900 dark:text-white text-lg">Order Total</span>
                                    <span className="font-black text-4xl text-primary tracking-tighter">{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <History className="w-5 h-5 text-slate-400" />
                            Activity Log
                        </h3>
                        <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                            <div className="relative flex gap-6">
                                <div className={`absolute -left-10 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${needsVerification ? 'bg-amber-500' : 'bg-primary shadow-[0_0_10px_rgba(19,127,236,0.3)]'}`}>
                                    {needsVerification ? <Clock className="w-2.5 h-2.5 text-white" /> : <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <div>
                                    <p className="font-black text-sm text-slate-900 dark:text-white">{order.status}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold italic">Latest update via Admin Panel</p>
                                </div>
                            </div>
                            <div className="relative flex gap-6 opacity-50">
                                <div className="absolute -left-10 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center">
                                    <CheckCircle className="w-2.5 h-2.5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-black text-sm text-slate-600 dark:text-slate-400">Order Received</p>
                                    <p className="text-xs text-slate-400 font-bold mt-1">Confirmed by Customer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <PersonStanding className="w-5 h-5 text-slate-400" />
                                Customer
                            </h3>
                            <button className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl uppercase">
                                    {order.customer?.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">{order.customer}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guest Account</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 group cursor-pointer hover:text-primary transition-colors">
                                    <Mail className="w-4 h-4" />
                                    {order.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400 group cursor-pointer hover:text-primary transition-colors">
                                    <Phone className="w-4 h-4" />
                                    {order.phone || 'No phone provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                Shipping
                            </h3>
                            <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">Edit</button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-black text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight">
                                {order.shipping_address?.street}<br />
                                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}<br />
                                United States
                            </p>
                        </div>
                    </div>

                    {/* Billing Method Card */}
                    <div className="bg-slate-900 dark:bg-white rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center text-white dark:text-slate-900">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-white dark:text-slate-900">Billing</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/60 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Payment Method</p>
                                <p className="text-xl font-black text-white dark:text-slate-900">{order.payment_method}</p>
                            </div>
                            <div className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${needsVerification ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                                {needsVerification ? 'Transaction Pending' : 'Paid & Confirmed'}
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200 dark:border-amber-900/30 p-8">
                        <h3 className="text-lg font-black text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-3">
                            <StickyNote className="w-5 h-5" />
                            Admin Notes
                        </h3>
                        <textarea
                            className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-xs font-bold text-slate-800 dark:text-slate-200 placeholder:text-amber-900/30 min-h-[120px] focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            placeholder="Add internal notes for this order..."
                        />
                        <button className="w-full mt-4 bg-amber-900 dark:bg-amber-800 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all font-black">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
