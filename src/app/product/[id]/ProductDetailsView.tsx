"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useCart } from "@/store/useCart";
import {
    ShoppingCart, Truck, ShieldCheck, RotateCcw, ChevronLeft,
    Minus, Plus, Star, ChevronRight, Zap, Heart, Share2,
    CheckCircle2, Info, Package, Beaker, Layers, Lock, ArrowRight, Loader2
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Props {
    id: string;
}

export default function ProductDetailsView({ id }: Props) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const { addItem, setIsCartOpen } = useCart((state) => ({ addItem: state.addItem, setIsCartOpen: state.setIsCartOpen }));
    const [quantity, setQuantity] = useState(1);
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Product Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">The product you are looking for does not exist or has been removed.</p>
                <Link href="/shop" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Back to Shop
                </Link>
            </div>
        );
    }

    const normalizeString = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const selectedVariation = product.variations?.find(v => {
        return Object.entries(selectedOptions).every(([key, value]) => {
            const varValue = v.attributes[key] || v.attributes[key.toLowerCase()] || '';
            const normVar = normalizeString(varValue);
            const normVal = normalizeString(value);
            return normVar === normVal || normVal.includes(normVar) || normVar.includes(normVal);
        });
    });

    const displayPrice = selectedVariation?.price ?? product.price ?? 0;
    const originalPrice = selectedVariation?.originalPrice ?? product.originalPrice;

    const handleAddToCart = () => {
        const cartItemId = selectedVariation ? selectedVariation.id.toString() : (Object.keys(selectedOptions).length > 0
            ? `${product.id}-${Object.values(selectedOptions).sort().join('-')}`
            : product.id);

        addItem({
            id: cartItemId,
            name: product.name,
            price: displayPrice,
            image: product.image,
            selectedOptions: { ...selectedOptions }
        }, quantity);
        setIsCartOpen(true);
        toast.success("Added to cart!");
    };

    const handleBuyNow = () => {
        const cartItemId = selectedVariation ? selectedVariation.id.toString() : (Object.keys(selectedOptions).length > 0
            ? `${product.id}-${Object.values(selectedOptions).sort().join('-')}`
            : product.id);

        addItem({
            id: cartItemId,
            name: product.name,
            price: displayPrice,
            image: product.image,
            selectedOptions: { ...selectedOptions }
        }, quantity);
        router.push('/checkout');
    };

    const displayImages = [product.image, ...(product.gallery || [])].filter((val, i, arr) => val && arr.indexOf(val) === i);

    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span className="text-slate-900 dark:text-white truncate max-w-[150px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Sticky Image Section */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="relative aspect-square rounded-4xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner group">
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
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 mb-8 py-6 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center text-amber-500">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 fill-current last:opacity-30" />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-900 dark:text-white font-black uppercase tracking-widest">4.88 (34 Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs text-primary dark:text-blue-400 font-bold uppercase tracking-widest">Ships worldwide</span>
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
                        </div>

                        {/* Selection Controls */}
                        <div className="space-y-8 mb-12 p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                            {product.variables && product.variables.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    {product.variables.map((variable) => (
                                        <div key={variable.name} className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 px-1">
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
                                <label className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest px-1">Quantity</label>
                                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-3xl h-14 bg-white dark:bg-slate-950 w-full sm:w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-full flex items-center justify-center hover:text-primary transition-colors border-r border-slate-200 dark:border-slate-800"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-10 font-black text-lg min-w-16 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-14 h-full flex items-center justify-center hover:text-primary transition-colors border-l border-slate-200 dark:border-slate-800"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
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

                {/* Product Description Full Width */}
                <div className="mt-20 lg:mt-32 pt-20 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-10 duration-1000">
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
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Verified Origin</p>
                                        <p className="text-[9px] font-bold uppercase text-slate-500">GMP Manufactured</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div
                                className="prose prose-slate dark:prose-invert max-w-none 
                                prose-h2:text-xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-widest prose-h2:mb-6 prose-h2:text-slate-900 dark:prose-h2:text-white
                                prose-h3:text-sm prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-widest prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary dark:prose-h3:text-blue-400
                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
                                prose-table:border-collapse prose-table:my-10 prose-table:shadow-sm prose-table:rounded-2xl prose-table:overflow-hidden 
                                prose-th:bg-slate-50 dark:prose-th:bg-slate-900 prose-th:p-4 prose-th:text-xs prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-slate-900 dark:prose-th:text-white
                                prose-td:p-4 prose-td:border prose-td:border-slate-100 dark:prose-td:border-slate-800 prose-td:text-sm prose-td:text-slate-600 dark:prose-td:text-slate-400 font-medium"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />

                            <div className="mt-16 p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl">
                                <div className="flex items-start gap-4">
                                    <Info className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest mb-2">Research Chemical Disclaimer</h3>
                                        <p className="text-xs text-amber-800/70 dark:text-amber-500/70 leading-relaxed font-bold uppercase tracking-tight">
                                            This product is intended for laboratory research use only. It is not for human consumption,
                                            diagnostic, or therapeutic purposes. Handling should only be performed by qualified professionals.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-40 pt-20 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                            <div className="text-left">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Complete Your Research</h2>
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

                {/* Tabs / Info Sections */}
                <div className="mt-32 border-t border-slate-100 dark:border-slate-800 pt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                        <div className="lg:col-span-1 text-left">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">Research Specification</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">Comprehensive documentation for laboratory application and compound verification.</p>
                        </div>
                        <div className="lg:col-span-2 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "HPLC Verification", content: "Purity levels exceeding 99.2% guaranteed via third-party high-performance liquid chromatography testing.", icon: ShieldCheck },
                                    { title: "Storage Compliance", content: "Stored at -20°C in oxygen-free environment. Shipped with cold-chain monitoring protocols.", icon: Package },
                                    { title: "CAS Registry", content: "Uniquely identified compound with full structural validation and mass spectrometry reports.", icon: Info },
                                    { title: "Usage Policy", content: "Strictly for lab research. Not for human or therapeutic use. Waiver required for bulk orders.", icon: Lock }
                                ].map((spec, i) => (
                                    <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-4xl border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-colors text-left">
                                        <spec.icon className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors mb-6" />
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">{spec.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{spec.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
