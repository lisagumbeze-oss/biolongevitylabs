"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, MessageSquare } from "lucide-react";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";

const BottomNav = () => {
    const pathname = usePathname();
    const { items, setIsCartOpen } = useCart();
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Shop", href: "/shop", icon: ShoppingBag },
        { label: "Cart", onClick: () => setIsCartOpen(true), icon: ShoppingCart, isCart: true },
        { label: "Support", href: "/support", icon: MessageSquare },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-3 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.href === pathname;
                    const Icon = item.icon;

                    const content = (
                        <div className="flex flex-col items-center gap-1 relative px-2 py-1">
                            <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'text-slate-500 dark:text-slate-400'}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
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

                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNavDot"
                                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
                                />
                            )}
                        </div>
                    );

                    if (item.onClick) {
                        return (
                            <button key={item.label} onClick={item.onClick} className="flex-1 flex justify-center outline-none">
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
    );
};

export default BottomNav;
