"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ShoppingBag, Menu, X, ChevronDown, Heart, User, Sparkles } from "lucide-react";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";
import CartDrawer from "./CartDrawer";
import LiveSearch from "./LiveSearch";
import { motion, AnimatePresence } from "framer-motion";

import { useSettings } from "@/store/useSettings";

const resourceLinks = [
    { href: "/resources/peptide-calculator", label: "Peptide Calculator" },
    { href: "/peptide-guide", label: "Peptide Guide" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const resourcesRef = useRef<HTMLDivElement>(null);
    const { isCartOpen, setIsCartOpen } = useCart();
    const items = useCart((state) => state.items);
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const settings = useSettings(state => state.settings);

    const wishlistItems = useWishlist((state) => state.items);
    const wishlistCount = wishlistItems.length;

    const storeName = settings?.general?.storeName || "BioLongevity Labs";
    const nameParts = storeName.split(" ");
    const lastPart = nameParts.pop();
    const firstPart = nameParts.join(" ");

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 transition-colors border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 gap-6">
                    <div className="shrink-0 flex items-center">
                        <Link href="/" aria-label={`${storeName} Home`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
                                <Image
                                    src="/favicon.png"
                                    alt="B"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                                {firstPart} <span className="text-primary italic">{lastPart}</span>
                            </span>
                        </Link>
                    </div>

                    {/* Live Search - Desktop */}
                    <div className="flex-1 hidden lg:block">
                        <LiveSearch />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/about" className="text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">About</Link>
                            <Link href="/shop" className="text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">Shop</Link>

                            <Link href="/wholesale" className="text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">Wholesale</Link>
                            <div ref={resourcesRef} className="relative" onMouseEnter={() => setIsResourcesOpen(true)} onMouseLeave={() => setIsResourcesOpen(false)}>
                                <button className="flex items-center gap-1 text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">
                                    Resources <ChevronDown className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isResourcesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[60]"
                                        >
                                            {resourceLinks.map(link => (
                                                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link href="/support" className="text-slate-600 hover:text-primary font-bold transition-colors text-sm uppercase tracking-widest">Support</Link>
                        </nav>

                        <div className="flex items-center gap-1">
                            <Link href="/wishlist">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative p-2.5 text-slate-600 hover:text-primary transition-all rounded-xl hover:bg-primary/5"
                                    aria-label="Wishlist"
                                >
                                    <Heart className="w-6 h-6" />
                                    <AnimatePresence>
                                        {wishlistCount > 0 && (
                                            <motion.span
                                                key="wishlist-badge"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform bg-rose-500 rounded-full min-w-5 h-5 shadow-lg shadow-rose-500/40 ring-2 ring-white"
                                            >
                                                {wishlistCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </Link>

                            <Link href="/dashboard" aria-label="Researcher Dashboard" className="p-2.5 text-slate-600 hover:text-primary transition-all rounded-xl hover:bg-primary/5 hidden sm:flex items-center gap-2">
                                <User className="w-6 h-6" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Dashboard</span>
                            </Link>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2.5 text-slate-600 hover:text-primary transition-all rounded-xl hover:bg-primary/5"
                                aria-label="Shopping Cart"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span
                                            key="badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform bg-primary rounded-full min-w-5 h-5 shadow-lg shadow-primary/40 ring-2 ring-white"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <button
                                className="md:hidden p-2 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle Menu"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-white border-t border-slate-200 shadow-2xl overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-4">
                            <LiveSearch />
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/5 hover:text-primary transition-all">About Us</Link>
                                <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/5 hover:text-primary transition-all">Shop All</Link>

                                <Link href="/resources/peptide-calculator" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/5 hover:text-primary transition-all">Peptide Calculator</Link>
                                <Link href="/peptide-guide" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/5 hover:text-primary transition-all">Peptide Guide</Link>
                                <Link href="/support" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-xl text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/5 hover:text-primary transition-all">Support</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
