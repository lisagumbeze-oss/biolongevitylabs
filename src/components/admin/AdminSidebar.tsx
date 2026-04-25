"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Settings,
    LogOut,
    Package,
    Archive,
    Activity,
    Tag,
    FileText,
    Users,
    Image as ImageIcon,
    MessageSquare
} from 'lucide-react';

const AdminSidebar = () => {
    const pathname = usePathname();

    const navigation = [
        {
            group: 'Intelligence',
            items: [
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                { name: 'Analytics', href: '/admin/analytics', icon: Activity },
            ]
        },
        {
            group: 'Store Management',
            items: [
                { name: 'Products', href: '/admin/products', icon: Package },
                { name: 'Inventory', href: '/admin/inventory', icon: Archive },
                { name: 'Customers', href: '/admin/customers', icon: Users },
                { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
                { name: 'Coupons', href: '/admin/coupons', icon: Tag },
                { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
            ]
        },
        {
            group: 'Content Management',
            items: [
                { name: 'Blog', href: '/admin/blog', icon: FileText },
                { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
            ]
        },
        {
            group: 'System',
            items: [
                { name: 'Settings', href: '/admin/settings', icon: Settings },
            ]
        }
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        window.location.href = '/admin/login';
    };

    return (
        <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen sticky top-0">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2 text-white font-black tracking-tighter">
                    <Activity className="w-6 h-6 text-primary" />
                    <span className="text-xl">Bio<span className="text-primary">Admin</span></span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                {navigation.map((group) => (
                    <div key={group.group} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {group.group}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${active
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <Package className="w-5 h-5" />
                    View Storefront
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout Account
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
