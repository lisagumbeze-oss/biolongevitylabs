"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { Package, Loader2 } from "lucide-react";
import Link from "next/link";

const BIOREGULATOR_CATEGORIES = [
  "Bioregulator Vials",
  "Bioregulator Capsules",
  "Bioregulator Creams",
];

function isBioregulator(product: Product): boolean {
  return BIOREGULATOR_CATEGORIES.some((c) => product.category === c);
}

export default function BioregulatorsShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) => setProducts(Array.isArray(data) ? data.filter(isBioregulator) : []))
      .catch(console.error)
      .finally(() => setTimeout(() => setIsLoading(false), 400));
  }, []);

  const byCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    for (const cat of BIOREGULATOR_CATEGORIES) {
      groups[cat] = products.filter((p) => p.category === cat);
    }
    return groups;
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {BIOREGULATOR_CATEGORIES.map((cat) => {
        const items = byCategory[cat] || [];
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        );
      })}
      <p className="text-sm text-slate-500 flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" />
        {products.length} bioregulator SKUs ·{" "}
        <Link href="/shop" className="text-primary font-semibold hover:underline">
          View full catalog
        </Link>
      </p>
    </div>
  );
}
