"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye, 
    Calendar,
    User,
    ArrowUpRight,
    Loader2,
    FileText,
    Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    imageUrl: string;
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
            }
        } catch (error) {
            toast.error('Failed to load research articles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
        
        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
                toast.success('Article deleted successfully');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            toast.error('Could not delete article');
        }
    };

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Research CMS</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage scientific articles, protocols, and laboratory updates.</p>
                </div>
                <Link 
                    href="/admin/blog/new"
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Publish New Article
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search by title, excerpt or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 font-bold hover:text-primary transition-all shadow-sm">
                    <Filter className="w-5 h-5" />
                    Filter
                </button>
            </div>

            {/* Posts Grid/Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning archives...</p>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Article</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date Published</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-100 dark:border-slate-800">
                                                    <img 
                                                        src={post.imageUrl || 'https://images.unsplash.com/photo-1532187875605-2fe358a71e48?w=800&auto=format&fit=crop&q=60'} 
                                                        alt={post.title}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.date).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tighter">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                Published
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/research/${post.slug}`} 
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="View on site"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link 
                                                    href={`/admin/blog/edit/${post.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/5 rounded-lg transition-all"
                                                    title="Edit article"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
                                                    title="Delete article"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">No scientific findings yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm">Start building your laboratory's knowledge base by publishing your first research article.</p>
                        <Link 
                            href="/admin/blog/new"
                            className="mt-8 flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" />
                            Write First Article
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
