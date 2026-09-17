import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { productPath } from "@/lib/product-slug";

const FEATURED_SLUGS = [
    "regeno-blend-bpc-157-tb-500-cartalax-30mg",
    "thymulin-peptide-10mg",
    "follistatin-flgr242-10mg",
];

const SPECIFICATIONS = [
    { label: "Testing", value: "Third-party COA on every batch" },
    { label: "Origin", value: "Synthesized and fulfilled in the USA" },
    { label: "Documentation", value: "HPLC and mass spectrometry reports" },
    { label: "Use", value: "In vitro research only" },
];

const featured = FEATURED_SLUGS.map((slug) => products.find((product) => product.slug === slug)).filter(
    (product): product is (typeof products)[number] => Boolean(product)
);

function formatPrice(price: number) {
    return price % 1 === 0 ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
}

const Hero = () => {
    return (
        <section aria-labelledby="home-hero-heading" className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center py-16 lg:py-24">
                    <div className="lg:col-span-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Research use only
                        </p>
                        <h1
                            id="home-hero-heading"
                            className="mt-5 max-w-xl text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-slate-950 leading-[1.08]"
                        >
                            Research peptides for laboratory use.
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                            BioLongevity Labs supplies lyophilized peptides and bioregulators for in vitro study.
                            Lots are independently tested, documented, and available to order online with the
                            certificate of analysis included.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0f6fd4]"
                            >
                                Browse catalog
                                <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                            <Link
                                href="/research"
                                className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400"
                            >
                                Research library
                            </Link>
                        </div>
                    </div>

                    <aside className="lg:col-span-5">
                        <div className="rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 px-5 py-4">
                                <p className="text-sm font-semibold text-slate-950">In the catalog</p>
                                <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <ul>
                                {featured.map((product) => (
                                    <li key={product.id} className="border-b border-slate-100 last:border-b-0">
                                        <Link
                                            href={productPath(product)}
                                            className="group flex items-center gap-4 px-5 py-4"
                                        >
                                            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                                                <Image
                                                    src={product.image}
                                                    alt=""
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain p-1"
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold text-slate-950 group-hover:text-primary">
                                                    {product.name}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-500">
                                                    {product.form} · {product.category}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-950">
                                                {formatPrice(product.price)}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>

                <dl className="grid border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                    {SPECIFICATIONS.map((item) => (
                        <div key={item.label} className="border-b border-slate-200 py-5 sm:border-b-0 sm:pr-8 lg:py-6">
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {item.label}
                            </dt>
                            <dd className="mt-2 text-sm font-medium text-slate-950">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default Hero;
