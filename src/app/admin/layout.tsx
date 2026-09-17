import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AuthGuard from './AuthGuard';
import { SITE_URL } from '@/lib/site';

export const metadata = {
    title: 'Admin Dashboard | BioLongevity Labs',
    description: 'Manage products, orders, and store settings.',
    robots: { index: false, follow: false },
    openGraph: {
        url: `${SITE_URL}/admin`,
        siteName: 'BioLongevity Labs',
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <AdminShell>{children}</AdminShell>
        </AuthGuard>
    );
}

