"use client";

import React, { useEffect } from "react";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Bolt } from "lucide-react";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { items, removeItem, updateQuantity } = useCart();

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white dark:bg-slate-800 z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Your Cart</h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 px-6 py-4 overflow-y-auto">
                            {items.length > 0 ? (
                                <div className="flex flex-col gap-5">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.25 }}
                                            layout
                                            className="flex gap-4 pb-5 border-b border-slate-100 dark:border-slate-700 last:border-0"
                                        >
                                            <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between py-0.5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                                                            {item.name}
                                                        </h3>
                                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                                    <span key={key} className="block">{key}: {value}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>

                                                <div className="flex justify-between items-end mt-2">
                                                    <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 p-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-slate-100">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-300"
                                    >
                                        <ShoppingBag className="w-10 h-10" />
                                    </motion.div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your cart is currently empty.</p>
                                    <button onClick={onClose} className="text-primary hover:underline font-bold">
                                        Continue Shopping
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-6 space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                        <p className="text-sm font-medium">Subtotal</p>
                                        <p className="text-slate-900 dark:text-slate-100 font-bold">${subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-500">
                                        <p className="text-xs">Shipping</p>
                                        <p className="text-xs italic">Calculated at checkout</p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</p>
                                        <p className="text-2xl font-black text-primary">${subtotal.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            href="/checkout"
                                            onClick={onClose}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25"
                                        >
                                            Check Out
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </motion.div>
                                </div>

                                <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                                    <Bolt className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    No Account Required
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;




