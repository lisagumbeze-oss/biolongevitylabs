"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight, Layers, Star } from "lucide-react";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    minPrice?: number | null;
    maxPrice?: number | null;
    image: string;
    description?: string;
    color?: string;
    originalPrice?: number;
    isSale?: boolean;
    isVariable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    minPrice,
    maxPrice,
    image,
    description,
    color,
    originalPrice,
    isSale,
    isVariable,
}) => {
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isVariable) {
            return;
        }

        addItem({ id, name, price, image });
        toast.success(`${name} added to cart!`, {
            icon: "🛒",
            style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: '900',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            },
        });
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group bg-white dark:bg-slate-900 rounded-4xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500"
        >
            <Link href={`/product/${id}`} className="flex flex-col flex-1">
                <div className="relative aspect-square bg-slate-50 dark:bg-slate-950 overflow-hidden m-4 rounded-3xl">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-800">
                            <ShoppingCart className="w-16 h-16 opacity-10" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {isSale && (
                            <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-rose-500/20">
                                Sale
                            </span>
                        )}
                        {isVariable && (
                            <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-1.5">
                                <Layers className="w-3 h-3" />
                                Options
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-6 pt-2 grow flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
                        {name}
                    </h3>

                    {description && (
                        <div
                            className="text-[10px] font-bold text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed uppercase tracking-tighter"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    <div className="flex items-center gap-3 mt-auto">
                        <div className="flex flex-col">
                            {isVariable && minPrice ? (
                                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {maxPrice && maxPrice > minPrice
                                        ? `$${minPrice.toFixed(0)} – $${maxPrice.toFixed(0)}`
                                        : `From $${minPrice.toFixed(0)}`}
                                </p>
                            ) : (
                                <p className="text-2xl font-black text-primary tracking-tighter">
                                    ${price.toFixed(2)}
                                </p>
                            )}
                            {!isVariable && originalPrice && (
                                <p className="text-xs text-slate-300 line-through font-bold">
                                    ${originalPrice.toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-6 pb-6">
                {isVariable ? (
                    <Link
                        href={`/product/${id}`}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary hover:text-white py-4 rounded-2xl font-black transition-all duration-300 flex justify-center items-center gap-2 active:scale-[0.98] text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:border-transparent"
                    >
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-slate-900 dark:bg-slate-700 text-white hover:bg-primary py-4 rounded-2xl font-black transition-all duration-300 flex justify-center items-center gap-2 active:scale-[0.98] text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/5 hover:shadow-primary/20"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Quick Add
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
