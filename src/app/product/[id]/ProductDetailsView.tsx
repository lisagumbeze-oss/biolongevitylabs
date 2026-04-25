"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { researchPosts } from "@/data/researchPosts";
import { useCart } from "@/store/useCart";
import { useRecentlyViewed } from "@/store/useRecentlyViewed";
import {
    ShoppingCart, Truck, ShieldCheck, RotateCcw, ChevronLeft,
    Minus, Plus, Star, ChevronRight, Zap, Heart, Share2,
    CheckCircle2, Info, Package, Beaker, Layers, Lock, ArrowRight, Loader2
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import HPLCGraph from "@/components/HPLCGraph";
import ScientificTooltip from "@/components/ScientificTooltip";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    id: string;
}

export default function ProductDetailsView({ id }: Props) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const addItem = useCart((state) => state.addItem);
    const setIsCartOpen = useCart((state) => state.setIsCartOpen);
    const addRecentlyViewed = useRecentlyViewed((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    const [frequency, setFrequency] = useState<'one-time' | '30-days' | '60-days'>('one-time');
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const fetchReviews = async () => {
        if (!product) return;
        setLoadingReviews(true);
        try {
            const res = await fetch(`/api/reviews?productId=${product.id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (product) {
            fetchReviews();
        }
    }, [product]);
    const [selectedImage, setSelectedImage] = useState("");

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch('/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setAllProducts(data);
                    const found = data.find((p: Product) => p.id === id);
                    if (found) {
                        setProduct(found);
                        setSelectedImage(found.image || "");
                        addRecentlyViewed(found);

                        // Set default options
                        const defaultOptions: Record<string, string> = {};
                        if (found.variables) {
                            found.variables.forEach((v: any) => {
                                if (v.options && v.options.length > 0) {
                                    defaultOptions[v.name] = v.options[0];
                                }
                            });
                        }
                        setSelectedOptions(defaultOptions);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const selectedVariation = React.useMemo(() => {
        if (!product || !product.variations || !product.isVariable) return null;

        return product.variations.find(v => {
            return Object.entries(selectedOptions).every(([name, value]) => {
                return v.attributes[name] === value;
            });
        });
    }, [product, selectedOptions]);

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            id: product.id,
            name: product.name,
            price: frequency === 'one-time' ? displayPrice : displayPrice * 0.85,
            image: selectedImage || product.image,
            selectedOptions: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
            frequency: frequency
        }, quantity);

        toast.success(`${product.name} added to cart`);
        setIsCartOpen(true);
    };

    const handleBuyNow = () => {
        if (!product) return;

        addItem({
            id: product.id,
            name: product.name,
            price: frequency === 'one-time' ? displayPrice : displayPrice * 0.85,
            image: selectedImage || product.image,
            selectedOptions: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
            frequency: frequency
        }, quantity);

        router.push('/checkout');
    };

    const displayImages = React.useMemo(() => {
        if (!product) return [];
        return [product.image, ...(product.gallery || [])].filter((val, i, arr) => val && arr.indexOf(val) === i);
    }, [product]);

    const displayPrice = React.useMemo(() => {
        if (!product) return 0;
        return selectedVariation?.price ?? product.price ?? 0;
    }, [selectedVariation, product]);

    const originalPrice = React.useMemo(() => {
        if (!product) return undefined;
        return selectedVariation?.originalPrice ?? product.originalPrice;
    }, [selectedVariation, product]);

    const relatedProducts = React.useMemo(() => {
        if (!product) return [];
        return allProducts
            .filter(p => (p.category === product.category && p.id !== product.id) || p.category.includes("Peptide"))
            .slice(0, 4);
    }, [allProducts, product]);

    const relatedResearch = React.useMemo(() => {
        if (!product) return [];
        return researchPosts
            .filter(p =>
                p.category.toLowerCase().includes(product.category.toLowerCase()) ||
                p.title.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]) ||
                product.description.toLowerCase().includes(p.title.toLowerCase().split(' ')[0])
            )
            .slice(0, 2);
    }, [product]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Product Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h2>
                <p className="text-slate-600 mb-8">The product you are looking for does not exist or has been removed.</p>
                <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen transition-colors pb-20 overflow-x-hidden">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Sticky Image Section */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="relative aspect-square rounded-4xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={selectedImage || "/placeholder-product.png"}
                                alt={product.name}
                                className="w-full h-full object-contain p-8 md:p-12"
                            />
                            <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:scale-110 transition-transform text-slate-900 dark:text-white">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg hover:scale-110 transition-transform text-slate-900 dark:text-white">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {displayImages.map((imgUrl, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 cursor-pointer transition-all ${selectedImage === imgUrl ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/10' : 'border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
                                        onClick={() => setSelectedImage(imgUrl)}
                                    >
                                        <img src={imgUrl} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-contain p-2" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/10 bg-primary/5 text-primary dark:text-blue-400 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Quality</span>
                                </div>
                                {product.coa?.purityPercentage && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-full">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{product.coa.purityPercentage}% Purity Tested</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 mb-8 py-6 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-amber-500">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i <= (product.rating || 5) ? 'fill-current' : 'text-slate-200'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-900 font-black uppercase tracking-widest">
                                        {product.rating || "5.00"} ({product.reviewCount || 0} Reviews)
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                                        product.stockStatus === 'In Stock' ? 'bg-emerald-500' : 
                                        product.stockStatus === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}></span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${
                                        product.stockStatus === 'In Stock' ? 'text-emerald-600' : 
                                        product.stockStatus === 'Low Stock' ? 'text-amber-600' : 'text-rose-600'
                                    }`}>
                                        {product.stockStatus || 'In Stock'}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ships worldwide</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mb-10 text-left">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl sm:text-4xl font-black text-primary tracking-tighter">${displayPrice.toFixed(2)}</span>
                                    {(!product.isVariable || selectedVariation) && (selectedVariation?.originalPrice ?? product.originalPrice) && (
                                        <span className="text-2xl sm:text-2xl text-slate-300 line-through font-bold">${(selectedVariation?.originalPrice ?? product.originalPrice)?.toFixed(2)}</span>
                                    )}
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sales Tax included at checkout</p>
                            </div>

                            {/* Sub-description hint */}
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-xs uppercase tracking-widest font-black">Laboratory Research Chemical • Scroll down for full specifications</span>
                            </p>

                            {product.coa && (
                                <div className="mb-8 flex items-center gap-4 p-5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-3xl animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <Beaker className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">HPLC Laboratory Report Available</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                            Verified by {product.coa.labName} 
                                            {product.coa.batchNumber ? ` • Batch #${product.coa.batchNumber}` : ''}
                                            {product.coa.testDate ? ` • Tested ${new Date(product.coa.testDate).toLocaleDateString()}` : ''}
                                        </p>
                                    </div>
                                    <a 
                                        href={product.coa.reportUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="h-10 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                                    >
                                        View PDF
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Selection Controls */}
                        <div className="space-y-8 mb-12 p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                            {product.variables && product.variables.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    {product.variables.map((variable) => (
                                        <div key={variable.name} className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                                                <Layers className="w-3.5 h-3.5 text-primary" />
                                                {variable.name}
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                {variable.options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [variable.name]: opt }))}
                                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedOptions[variable.name] === opt
                                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                                <div className="flex flex-col gap-4">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest px-1">Quantity</label>
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="flex items-center border border-slate-200 rounded-3xl h-14 bg-white w-full sm:w-fit">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-14 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors border-r border-slate-200"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-10 font-black text-lg min-w-16 text-center text-slate-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-14 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors border-l border-slate-200"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Wholesale Info Badge */}
                                        <AnimatePresence>
                                            {quantity >= 3 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-2xl border border-primary/20"
                                                >
                                                    <Zap className="w-4 h-4 fill-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {quantity >= 25 ? "Wholesale: 40% Off Applied" : 
                                                         quantity >= 10 ? "Bulk: 25% Off Applied" : 
                                                         "Bundle: 10% Off Applied"}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Wholesale Price Table */}
                                <div className="bg-white rounded-3xl border border-slate-100 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="w-4 h-4 text-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Research Wholesale Pricing</h4>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { qty: '3+', discount: '10%', label: 'Bundle' },
                                            { qty: '10+', discount: '25%', label: 'Professional' },
                                            { qty: '25+', discount: '40%', label: 'Wholesale' }
                                        ].map((tier, i) => (
                                            <div key={i} className={`p-4 rounded-2xl border transition-all ${
                                                (tier.qty === '3+' && quantity >= 3 && quantity < 10) ||
                                                (tier.qty === '10+' && quantity >= 10 && quantity < 25) ||
                                                (tier.qty === '25+' && quantity >= 25)
                                                ? 'border-primary bg-primary/[0.02] ring-1 ring-primary/20' 
                                                : 'border-slate-50 bg-slate-50/50'
                                            }`}>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">{tier.label}</p>
                                                <p className="text-sm font-black text-slate-900 leading-none mb-1">{tier.qty} Units</p>
                                                <p className="text-[10px] font-black text-primary uppercase">{tier.discount} SAVINGS</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                    {/* Subscribe & Save Option */}
                    <div className="space-y-3 mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Purchase Options</h3>
                        
                        <button 
                            onClick={() => setFrequency('one-time')}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${frequency === 'one-time' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${frequency === 'one-time' ? 'border-primary' : 'border-slate-300'}`}>
                                    {frequency === 'one-time' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900 uppercase">One-time purchase</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Standard laboratory delivery</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-slate-900">${(displayPrice).toFixed(2)}</span>
                        </button>

                        <button 
                            onClick={() => setFrequency('30-days')}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${frequency !== 'one-time' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${frequency !== 'one-time' ? 'border-primary' : 'border-slate-300'}`}>
                                    {frequency !== 'one-time' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-black text-slate-900 uppercase">Subscribe & Save</p>
                                        <span className="bg-emerald-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">Save 15%</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Recurring research supply • Cancel anytime</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-slate-900">${(displayPrice * 0.85).toFixed(2)}</span>
                        </button>

                        {frequency !== 'one-time' && (
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-300">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Frequency</span>
                                <select 
                                    value={frequency} 
                                    onChange={(e) => setFrequency(e.target.value as any)}
                                    className="bg-transparent text-xs font-black uppercase text-primary outline-none cursor-pointer"
                                >
                                    <option value="30-days">Every 30 Days</option>
                                    <option value="60-days">Every 60 Days</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="h-16 rounded-3xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 font-black flex items-center justify-center gap-3 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all active:scale-[0.98] uppercase tracking-widest text-[10px]"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="h-16 rounded-3xl bg-primary text-white font-black flex items-center justify-center gap-3 hover:bg-sky-500 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]"
                                >
                                    <Zap className="w-4 h-4" />
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Trust Bar Premium */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-10 border-t border-slate-100 dark:border-slate-800">
                            {[
                                { icon: Truck, text: "Priority Shipping", sub: "Fast & Discreet" },
                                { icon: ShieldCheck, text: "99% Purity", sub: "HPLC Verified" },
                                { icon: RotateCcw, text: "Full Refund", sub: "60-Day Promise" },
                                { icon: Beaker, text: "Lab Synthesis", sub: "GMP Certified" }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary mb-1">
                                        <badge.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase leading-tight">{badge.text}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{badge.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Internal Linking: Related Research */}
                {relatedResearch.length > 0 && (
                    <div className="mt-20 lg:mt-32 pt-20 border-t border-slate-100 dark:border-slate-800">
                        <div className="max-w-4xl text-left">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 uppercase">Scientific Validation & Research</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose mb-10">
                                Explore the data. Our research compounds are backed by peer-reviewed literature and comprehensive scientific analysis.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedResearch.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/research/${post.slug}`}
                                    aria-label={`Read research article about ${post.title}`}
                                    className="group flex flex-col sm:flex-row gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-4xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-xl"
                                >
                                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                                        <img src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex flex-col justify-center text-left">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">{post.category}</span>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h3>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                                            Read Full Study
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Scientific Visualization: HPLC Data */}
                {product.coa?.purityPercentage && (
                    <div className="mt-20 lg:mt-32 pt-20 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-5 text-left">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6 uppercase">Batch Spectral Analysis</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose mb-8">
                                    Our commitment to 99%+ purity is verified through High-Performance Liquid Chromatography (HPLC). Each batch is analyzed to ensure zero contaminants and precise concentration.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { label: "Detected Purity", value: `${product.coa.purityPercentage}%` },
                                        { label: "Batch Variance", value: "< 0.02%" },
                                        { label: "Lab Verification", value: "Verified by HPLC/MS" }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-7">
                                <HPLCGraph purity={product.coa.purityPercentage} substanceName={product.name} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Description Full Width */}
                <div className="mt-20 lg:mt-32 pt-20 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-10 duration-1000 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                        <div className="lg:col-span-1">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none uppercase">Product Information</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-xs">Detailed laboratory specifications, compound structure, and research applications.</p>

                            <div className="mt-10 space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Beaker className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Research Grade</p>
                                        <p className="text-[9px] font-bold uppercase text-slate-500">HPLC 99%+ Purity</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-900">Verified Origin</p>
                                        <p className="text-[9px] font-bold uppercase text-slate-500">GMP Manufactured</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                            <div className="prose prose-slate max-w-none 
                                prose-h2:text-xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-widest prose-h2:mb-6 prose-h2:text-slate-900
                                prose-h3:text-sm prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-widest prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary
                                prose-p:text-slate-800 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                                prose-strong:text-slate-900 prose-strong:font-black"
                            >
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                
                                <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2 text-left">Research Glossary</h4>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed text-left">
                                            This compound is verified to induce <ScientificTooltip term="Angiogenesis" definition="The physiological process through which new blood vessels form from pre-existing vessels.">angiogenesis</ScientificTooltip> and accelerate <ScientificTooltip term="Myogenesis" definition="The formation of muscular tissue, particularly during embryonic development.">myogenesis</ScientificTooltip> in in-vitro research environments.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl">
                                <div className="flex items-start gap-4">
                                    <Info className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-2">Research Chemical Disclaimer</h3>
                                        <p className="text-xs text-amber-800/70 dark:text-amber-500/70 leading-relaxed font-bold uppercase tracking-tight text-left">
                                            This product is intended for laboratory research use only. It is not for human consumption,
                                            diagnostic, or therapeutic purposes. Handling should only be performed by qualified professionals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40 pt-20 border-t border-slate-100 dark:border-slate-800 text-left">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                            <div className="text-left">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Complete Your Research</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-primary" />
                                    Synergistic compounds from the <span className="text-primary font-black">{product.category}</span> lineup
                                </p>
                            </div>
                            <Link href="/shop" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:text-slate-900 dark:hover:text-white transition-all">
                                View Full Collection
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed Products */}
                <RecentlyViewedSection currentProductId={product.id} />

                {/* Reviews Section */}
                <div className="mt-32 max-w-4xl">
                    <div className="flex flex-col gap-6 mb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Star className="w-6 h-6 fill-primary" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified Research Feedback</h2>
                        </div>
                        <p className="text-slate-500 font-medium max-w-2xl">
                            Clinical observations and feedback from certified researchers across our global network.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-16">
                        <div className="order-2 lg:order-1">
                            <ReviewList reviews={reviews} isLoading={loadingReviews} />
                        </div>
                        
                        <div className="order-1 lg:order-2">
                            <ReviewForm productId={product.id} onSuccess={fetchReviews} />
                        </div>
                    </div>
                </div>
            </main>
            <Toaster position="bottom-right" />
        </div>
    );
}
