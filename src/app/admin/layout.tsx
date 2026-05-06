import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import AuthGuard from './AuthGuard';

export const metadata = {
    title: 'Admin Dashboard | BioLongevity Labs',
    description: 'Manage products, orders, and store settings.',
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

