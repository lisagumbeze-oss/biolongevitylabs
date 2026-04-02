"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/store/useCart";
import { Lock, Truck, CreditCard, ChevronRight, Info, CheckCircle2, ShieldCheck, MapPin, Mail, User, Phone, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaymentMethod {
    id: string;
    name: string;
    instructions: string;
    enabled: boolean;
}

interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed_amount';
    value: number;
    minCartAmount: number;
    usageCount: number;
    active: boolean;
}

interface ShippingZone {
    standardRate: string;
    priorityRate: string;
    freeShippingThreshold: string;
}

interface StoreSettings {
    taxConfig: string;
    shipping: {
        usa: ShippingZone;
        international: ShippingZone;
    };
    paymentMethods: PaymentMethod[];
}

export default function CheckoutPage() {
    const { items, clearCart, _hasHydrated } = useCart();
    const router = useRouter();
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        shippingMethod: "standard"
    });

    // Coupons state
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponError, setCouponError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
                const firstEnabled = data.paymentMethods.find((pm: PaymentMethod) => pm.enabled);
                if (firstEnabled) setSelectedPayment(firstEnabled.id);

                const couponsRes = await fetch('/api/coupons');
                setCoupons(await couponsRes.json());
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingZone = formData.country === "USA" ? settings?.shipping.usa : settings?.shipping.international;
    const standardRate = shippingZone ? parseFloat(shippingZone.standardRate) : 15.0;
    const priorityRate = shippingZone ? parseFloat(shippingZone.priorityRate) : 45.0;
    const freeThreshold = shippingZone ? parseFloat(shippingZone.freeShippingThreshold) : 149.0;

    const isFreeShipping = subtotal >= freeThreshold;

    let shippingPrice = 0.0;
    if (formData.shippingMethod === "express") {
        shippingPrice = priorityRate;
    } else {
        shippingPrice = isFreeShipping ? 0.0 : standardRate;
    }

    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else {
            discount = appliedCoupon.value;
        }
    }

    const total = Math.max(0, subtotal - discount) + shippingPrice;

    const handleApplyCoupon = () => {
        setCouponError("");
        const c = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (!c) {
            setCouponError("Invalid coupon code.");
            return;
        }
        if (!c.active) {
            setCouponError("This coupon is currently inactive.");
            return;
        }
        if (subtotal < c.minCartAmount) {
            setCouponError(`Minimum cart amount for this coupon is $${c.minCartAmount.toFixed(2)}.`);
            return;
        }
        setAppliedCoupon(c);
        setCouponCode("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isPending) return;

        setIsPending(true);
        const orderId = `#ORD-${Math.floor(100000000 + Math.random() * 900000000)}`;

        const orderData = {
            id: orderId,
            customer: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            total: `$${total.toFixed(2)}`,
            status: 'Pending',
            items: items.reduce((acc, item) => acc + item.quantity, 0),
            full_items: items.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                selectedOptions: item.selectedOptions
            })),
            shipping_address: {
                street: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zipCode,
                country: formData.country
            },
            payment_method: settings?.paymentMethods.find(pm => pm.id === selectedPayment)?.name || 'Transfer'
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            // Track coupon usage
            if (appliedCoupon) {
                fetch('/api/coupons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...appliedCoupon, usageCount: (appliedCoupon.usageCount || 0) + 1 })
                }).catch(console.error);
            }

            clearCart();
            // Pass the generated order ID to the confirmation page
            router.push(`/order-confirmation?id=${encodeURIComponent(orderId)}`);
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Checkout Error: ${error.message || 'Something went wrong. Please try again.'}`);
        } finally {
            setIsPending(false);
        }
    };

    if (!_hasHydrated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your cart...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Your cart is empty</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Add some research products to your cart before checking out.</p>
                <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Start Shopping
                </Link>
            </div>
        );
    }

    const availablePayments = settings?.paymentMethods.filter(pm => pm.enabled) || [];

    return (
        <div className="bg-background min-h-screen transition-colors">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="mb-12 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Secure Checkout
                        </h1>
                        <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                            <Lock className="w-4 h-4" />
                            <span>Encrypted Guest Checkout</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 max-w-2xl">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="text-primary">Information</span>
                            <span className="text-primary">Shipping</span>
                            <span>Review</span>
                        </div>
                        <div className="relative w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className="absolute top-0 left-0 h-full rounded-full bg-primary shadow-[0_0_10px_rgba(19,127,236,0.5)] transition-all duration-500" style={{ width: "66%" }}></div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-10">
                        {/* Shipping Section */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="John"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Last Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Doe"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="john.doe@example.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="(555) 000-0000"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-6">
                                <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Street Address</label>
                                <input
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="123 Science Way"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Country</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    >
                                        <option value="USA">United States</option>
                                        <option value="International">International</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">City</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Austin"
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">State</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Texas"
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <label className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">ZIP</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="78701"
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                                <h3 className="text-slate-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Shipping Method
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={formData.shippingMethod === "standard"}
                                                onChange={() => setFormData({ ...formData, shippingMethod: "standard" })}
                                                className="w-5 h-5 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {isFreeShipping ? "Free Standard Shipping" : "Standard Delivery"}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3-5 Business Days</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-primary">{isFreeShipping ? "Free" : `$${standardRate.toFixed(2)}`}</span>
                                    </label>
                                    <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.shippingMethod === "express" ? "border-primary bg-primary/5" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={formData.shippingMethod === "express"}
                                                onChange={() => setFormData({ ...formData, shippingMethod: "express" })}
                                                className="w-5 h-5 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Priority Express</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">1-2 Business Days</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">${priorityRate.toFixed(2)}</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-2 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                Manual Payment Selection
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">Research-compliant payment steps follow order review.</p>

                            <div className="flex flex-col gap-4">
                                {availablePayments.map((pm) => (
                                    <div key={pm.id} className={`border-2 rounded-2xl overflow-hidden transition-all ${selectedPayment === pm.id ? "border-primary" : "border-slate-100 dark:border-slate-800"}`}>
                                        <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors ${selectedPayment === pm.id ? "bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                checked={selectedPayment === pm.id}
                                                onChange={() => setSelectedPayment(pm.id)}
                                                className="w-5 h-5 text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                                            />
                                            <span className="font-bold text-slate-900 dark:text-white">{pm.name}</span>
                                        </label>
                                        {selectedPayment === pm.id && (
                                            <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-primary/10 shadow-inner">
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                                        {pm.instructions}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-amber-500 uppercase tracking-widest border-t border-slate-100 dark:border-slate-700 pt-3">
                                                        <Info className="w-3 h-3" /> Note: Order processes only after manual confirmation.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-800 sticky top-24">
                            <h2 className="text-slate-900 dark:text-white text-2xl font-black mb-10 tracking-tight">Order Summary</h2>

                            <div className="max-h-[400px] overflow-y-auto pr-2 mb-8 space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-5 items-center">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden text-slate-400 flex items-center justify-center relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-1 right-1 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm leading-snug">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs font-black text-primary mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                    <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">${subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-emerald-500">
                                        <span className="text-sm font-bold uppercase tracking-widest">Discount ({appliedCoupon.code})</span>
                                        <span className="font-bold">-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                    <span className="text-sm font-bold uppercase tracking-widest">Shipping</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                                    <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Grand Total</span>
                                    <span className="text-4xl font-black text-primary drop-shadow-sm">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8">
                                <h3 className="text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" />
                                    Promo Code
                                </h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={e => setCouponCode(e.target.value)}
                                        placeholder="Enter discount code"
                                        className="flex-1 px-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase placeholder-normal font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-white transition-colors uppercase tracking-widest text-xs"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && <p className="text-rose-500 text-xs font-bold mt-2">{couponError}</p>}
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-sm font-bold mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                        <span>Coupon '{appliedCoupon.code}' applied!</span>
                                        <button type="button" onClick={() => setAppliedCoupon(null)} className="text-emerald-700 dark:text-emerald-300 hover:opacity-80 transition-opacity">Remove</button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/25 active:scale-[0.98] text-lg uppercase tracking-widest ${isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/95"}`}
                                >
                                    {isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Order
                                            <ChevronRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center justify-center gap-3 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Pure Lab-Grade Compliance</span>
                                </div>
                                <p className="text-center text-[10px] text-slate-400 font-bold px-4 leading-relaxed">
                                    By confirming, you agree that this order is for research laboratory use only.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
