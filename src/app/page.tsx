"use client";

import React, { useState, useEffect, useCallback } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import AboutSection from "@/components/AboutSection";
import Link from "next/link";
import { Truck, ShieldCheck, Award, Droplets, ChevronLeft, ChevronRight, Loader2, Beaker } from "lucide-react";
import { Product } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselProducts = products.slice(0, 10);
  const totalProducts = carouselProducts.length;
  const visibleCount = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalProducts);
  }, [totalProducts]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalProducts) % totalProducts);
  }, [totalProducts]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (isPaused || totalProducts === 0) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalProducts]);

  // Get the visible products (wrapping around)
  const getVisibleProducts = () => {
    if (totalProducts === 0) return [];
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(carouselProducts[(currentIndex + i) % totalProducts]);
    }
    return visible;
  };

  return (
    <div className="flex flex-col">
      <Hero />

      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="flex items-center justify-between mb-10">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-slate-900 border-l-4 border-primary pl-4"
            >
              Featured Research Products
            </motion.h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { prevSlide(); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { nextSlide(); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden min-h-[400px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Featured Products...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                initial={{ x: 80, opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {getVisibleProducts().map((product) => (
                  <div key={product.id}>
                    <ProductCard {...product} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: totalProducts }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 5000); }}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex
                ? "w-8 bg-primary shadow-lg shadow-primary/40"
                : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-primary/50"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        </motion.div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.4),transparent_70%)]"></div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-8 sm:p-16 flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full mb-6 ring-1 ring-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">Interactive Lab Assistant</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
                Not sure where to <br /><span className="text-primary italic">start your research?</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
                Our AI-driven protocol finder helps you navigate our catalog by matching our 99%+ purity compounds to your specific study objectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/protocol-finder"
                  className="px-10 py-5 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/25 text-center"
                >
                  Start Assessment
                </Link>
                <Link 
                  href="/research"
                  className="px-10 py-5 bg-white/5 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-center"
                >
                  View Science
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="relative aspect-square lg:aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-violet-600/30 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center animate-pulse">
                     <Beaker className="w-10 h-10 sm:w-14 sm:h-14 text-white opacity-40" />
                  </div>
                </div>
                <img 
                  src="https://mlavgymrtxzc.i.optimole.com/cb:572_.56b/w:auto/h:auto/q:mauto/f:best/https://biolongevitylabs.com/wp-content/uploads/2026/01/Thymulin.jpg" 
                  alt="Protocol Finder" 
                  className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white dark:bg-slate-900/50 border-t border-b border-slate-100 dark:border-slate-800 py-24 transition-colors overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <motion.div variants={fadeInUp} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary border-2 border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">99%+ Purity Guarantee</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Research-grade peptides with verified potency. Each product includes certificates of analysis.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary border-2 border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">GMP Manufacturing Standards</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Synthesized in USA-registered facilities following Good Manufacturing Practices. Full chain of custody documentation.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary border-2 border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Best In Class Fulfillment</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Same-day shipping on orders before 12 PM PT. Free standard domestic shipping on orders over $400.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary border-2 border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 shadow-sm">
                <Droplets className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Zero Fillers or Additives</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Pure active compounds only. Independently verified composition for reliable in vitro studies.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <AboutSection />
    </div>
  );
}
