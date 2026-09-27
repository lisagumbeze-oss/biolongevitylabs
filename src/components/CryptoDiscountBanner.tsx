"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CRYPTO_DISCOUNT_PERCENT } from "@/config/payments";

export default function CryptoDiscountBanner() {
    const pathname = usePathname();
    const hidden =
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/dashboard") ||
        pathname?.startsWith("/emails-preview");

    if (hidden) return null;

    return (
        <div className="bg-slate-950 text-white">
            <p className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm leading-snug">
                <Link href="/shop" className="font-semibold text-white underline-offset-2 hover:underline">
                    Save {CRYPTO_DISCOUNT_PERCENT}% when you pay with cryptocurrency.
                </Link>
                <span className="text-slate-300"> The discount applies to the product total at checkout.</span>
            </p>
        </div>
    );
}
