"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollPageToTop() {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll("main").forEach((node) => {
        node.scrollTop = 0;
    });
}

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        scrollPageToTop();
    }, [pathname]);

    return null;
}
