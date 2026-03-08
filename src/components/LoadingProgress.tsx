"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setLoading(true), 0);
        const timer2 = setTimeout(() => setLoading(false), 500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-50">
            <div className="h-full bg-primary shadow-[0_0_10px_rgba(19,127,236,0.5)] animate-progress-bar"></div>
        </div>
    );
}
