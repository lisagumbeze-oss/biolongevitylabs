"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, MessageSquare, Search, X } from "lucide-react";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import LiveSearch from "./LiveSearch";

type NavItem = {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    onClick?: () => void;
    isCart?: boolean;
    isSearch?: boolean;
};

const BottomNav = () => {
    const pathname = usePathname();
    const { items, setIsCartOpen } = useCart();
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    useEffect(() => {
        if (!isSearchOpen) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSearchOpen]);

    if (isAdminPage) return null;

    const navItems: NavItem[] = [
        { label: "Home", href: "/", icon: Home },
        { label: "Shop", href: "/shop", icon: ShoppingBag },
        {
            label: "Search",
            icon: Search,
            isSearch: true,
            onClick: () => setIsSearchOpen(true),
        },
        { label: "Cart", onClick: () => setIsCartOpen(true), icon: ShoppingCart, isCart: true },
        { label: "Support", href: "/support", icon: MessageSquare },
    ];

    return (
        <>
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.button
                            type="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-label="Close search"
                            onClick={() => setIsSearchOpen(false)}
                            className="md:hidden fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 24 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-x-0 top-0 z-[56] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 pt-4 pb-6"
                            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
                        >
                            <div className="flex items-center gap-3 mb-4 max-w-lg mx-auto">
                                <div className="flex-1 min-w-0">
                                    <LiveSearch
                                        autoFocus
                                        className="max-w-none"
                                        onNavigate={() => setIsSearchOpen(false)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    aria-label="Close search"
                                    className="shrink-0 p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-3 pb-6 pt-3 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    {navItems.map((item) => {
                        const isActive = item.isSearch
                            ? isSearchOpen
                            : Boolean(item.href && item.href === pathname);
                        const Icon = item.icon;

                        const content = (
                            <div className="flex flex-col items-center gap-1 relative px-1.5 py-1">
                                <div
                                    className={`p-2 rounded-2xl transition-all duration-300 ${
                                        isActive
                                            ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
                                            : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span
                                    className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                                        isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"
                                    }`}
                                >
                                    {item.label}
                                </span>

                                {item.isCart && (
                                    <AnimatePresence>
                                        {cartCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-sm"
                                            >
                                                {cartCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                )}

                                {isActive && !item.isSearch && (
                                    <motion.div
                                        layoutId="bottomNavDot"
                                        className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                                    />
                                )}
                            </div>
                        );

                        if (item.onClick) {
                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={item.onClick}
                                    className="flex-1 flex justify-center outline-none"
                                    aria-label={item.label}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link key={item.label} href={item.href || "/"} className="flex-1 flex justify-center">
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default BottomNav;
