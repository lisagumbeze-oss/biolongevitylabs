"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const auth = localStorage.getItem('admin_auth');
            if (auth === 'true') {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.push('/admin');
                }
            } else {
                setIsAuthenticated(false);
                // Redirect to login if not authenticated and not already on the login page
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            }
        };

        checkAuth();

        // Listen for storage changes in case of logout in another tab
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [router, pathname]);

    // Show nothing or a loader while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If on login page, just show it
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // If not authenticated, we've already triggered a redirect, so show nothing
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
