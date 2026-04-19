"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, MapPin } from "lucide-react";

// European countries with representative cities for social proof
const EUROPEAN_LOCATIONS = [
    { country: "Germany", cities: ["Berlin", "Munich", "Frankfurt", "Hamburg"] },
    { country: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse"] },
    { country: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh"] },
    { country: "Netherlands", cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"] },
    { country: "Spain", cities: ["Madrid", "Barcelona", "Valencia", "Seville"] },
    { country: "Italy", cities: ["Rome", "Milan", "Florence", "Naples"] },
    { country: "Sweden", cities: ["Stockholm", "Gothenburg", "Malmo"] },
    { country: "Switzerland", cities: ["Zurich", "Geneva", "Basel", "Bern"] },
    { country: "Austria", cities: ["Vienna", "Salzburg", "Graz"] },
    { country: "Belgium", cities: ["Brussels", "Antwerp", "Ghent"] },
    { country: "Denmark", cities: ["Copenhagen", "Aarhus", "Odense"] },
    { country: "Norway", cities: ["Oslo", "Bergen", "Trondheim"] },
    { country: "Finland", cities: ["Helsinki", "Tampere", "Espoo"] },
    { country: "Ireland", cities: ["Dublin", "Cork", "Galway"] },
    { country: "Portugal", cities: ["Lisbon", "Porto", "Faro"] },
    { country: "Poland", cities: ["Warsaw", "Krakow", "Gdansk"] },
    { country: "Czech Republic", cities: ["Prague", "Brno", "Ostrava"] },
    { country: "Greece", cities: ["Athens", "Thessaloniki", "Patras"] },
    { country: "Romania", cities: ["Bucharest", "Cluj-Napoca", "Timisoara"] },
    { country: "Hungary", cities: ["Budapest", "Debrecen", "Szeged"] },
    { country: "Croatia", cities: ["Zagreb", "Split", "Dubrovnik"] },
    { country: "Luxembourg", cities: ["Luxembourg City"] },
    { country: "Slovenia", cities: ["Ljubljana", "Maribor"] },
    { country: "Estonia", cities: ["Tallinn", "Tartu"] },
    { country: "Latvia", cities: ["Riga", "Jurmala"] },
];

// Time labels for recency
const TIME_LABELS = [
    "just now",
    "a few seconds ago",
    "1 minute ago",
    "2 minutes ago",
    "3 minutes ago",
    "5 minutes ago",
    "8 minutes ago",
    "12 minutes ago",
];

const MAX_NOTIFICATIONS_PER_SESSION = 5;
const SESSION_KEY = "bio_sales_notif_count";

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInterval(): number {
    // 15–45 seconds in ms
    return (15 + Math.random() * 30) * 1000;
}

interface NotificationData {
    productName: string;
    city: string;
    country: string;
    timeLabel: string;
}

export default function SalesNotification() {
    const pathname = usePathname();
    const [notification, setNotification] = useState<NotificationData | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [productNames, setProductNames] = useState<string[]>([]);

    // Don't render on admin pages
    const isAdminPage = pathname?.startsWith("/admin");

    // Fetch product names for realistic notifications
    useEffect(() => {
        if (isAdminPage) return;
        
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const names = data
                        .filter((p: { stockStatus?: string; name: string }) => p.stockStatus === "In Stock")
                        .map((p: { name: string }) => p.name)
                        .filter((name: string) => name.length < 50); // Keep names reasonable length
                    setProductNames(names.length > 0 ? names : ["BPC-157 (5mg)", "TB-500 (2mg)", "Ipamorelin (5mg)"]);
                }
            })
            .catch(() => {
                // Fallback product names if API fails
                setProductNames(["BPC-157 (5mg)", "TB-500 (2mg)", "Ipamorelin (5mg)", "Follistatin (FLGR242)"]);
            });
    }, [isAdminPage]);

    const showNotification = useCallback(() => {
        // Check session limit
        const count = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
        if (count >= MAX_NOTIFICATIONS_PER_SESSION) return;

        if (productNames.length === 0) return;

        const location = getRandomItem(EUROPEAN_LOCATIONS);
        const data: NotificationData = {
            productName: getRandomItem(productNames),
            city: getRandomItem(location.cities),
            country: location.country,
            timeLabel: getRandomItem(TIME_LABELS),
        };

        setNotification(data);
        setIsVisible(true);

        // Increment session count
        sessionStorage.setItem(SESSION_KEY, (count + 1).toString());

        // Auto-dismiss after 4.5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 4500);
    }, [productNames]);

    // Schedule notifications at random intervals
    useEffect(() => {
        if (isAdminPage || productNames.length === 0) return;

        // Initial delay — wait 8–15 seconds before first notification
        const initialDelay = (8 + Math.random() * 7) * 1000;

        let timeoutId = setTimeout(function tick() {
            showNotification();
            // Schedule next one
            timeoutId = setTimeout(tick, getRandomInterval());
        }, initialDelay);

        return () => clearTimeout(timeoutId);
    }, [isAdminPage, productNames, showNotification]);

    if (isAdminPage) return null;

    return (
        <AnimatePresence>
            {isVisible && notification && (
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed z-[60] 
                        bottom-28 left-4 right-4 md:bottom-6 md:left-6 md:right-auto
                        max-w-sm w-full md:w-auto"
                >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
                        rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30
                        p-4 flex items-start gap-3.5 backdrop-blur-xl
                        hover:shadow-xl transition-shadow duration-300">
                        
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 
                            flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                Someone in {notification.city}, {notification.country}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                                just purchased{" "}
                                <span className="font-bold text-primary">{notification.productName}</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                    {notification.timeLabel}
                                </span>
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse ml-1" />
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="flex-shrink-0 p-1 -mt-1 -mr-1 text-slate-400 hover:text-slate-600 
                                dark:hover:text-slate-300 transition-colors rounded-lg 
                                hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Dismiss notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
