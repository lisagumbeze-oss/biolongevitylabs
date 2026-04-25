"use client";

import React, { useState, useEffect } from 'react';
import { 
    Star, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    MessageSquare, 
    User, 
    Calendar,
    Loader2,
    Filter,
    Search,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Review {
    id: string;
    product_id: string;
    author_name: string;
    author_email: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    is_verified: boolean;
    created_at: string;
}

export default function ReviewsAdminPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            if (Array.isArray(data)) {
                setReviews(data);
            }
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            if (res.ok) {
                setReviews(reviews.map(r => r.id === id ? { ...r, status: status as any } : r));
                toast.success(`Review ${status}`);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            toast.error('Could not update review');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this feedback?')) return;

        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                toast.success('Review deleted');
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            toast.error('Could not delete review');
        }
    };

    const filteredReviews = reviews.filter(r => {
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
        const matchesSearch = r.author_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             r.comment.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Feedback Moderation</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor and verify scientific testimonials and compound efficacy reports.</p>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'All Reviews', value: 'all', count: reviews.length },
                    { label: 'Pending', value: 'pending', count: reviews.filter(r => r.status === 'pending').length },
                    { label: 'Approved', value: 'approved', count: reviews.filter(r => r.status === 'approved').length },
                    { label: 'Rejected', value: 'rejected', count: reviews.filter(r => r.status === 'rejected').length },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value as any)}
                        className={`p-4 rounded-2xl border transition-all text-left group ${
                            statusFilter === tab.value 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary'
                        }`}
                    >
                        <p className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === tab.value ? 'text-white/70' : 'text-slate-400'}`}>
                            {tab.label}
                        </p>
                        <h3 className="text-xl font-black mt-1">{tab.count}</h3>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text"
                    placeholder="Search by author or feedback content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                />
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analyzing feedback...</p>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 group hover:border-primary transition-all">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                                {review.author_name}
                                                {review.is_verified && (
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Purchase" />
                                                )}
                                            </h3>
                                            <p className="text-xs text-slate-500">{review.author_email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 text-sm italic font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                    "{review.comment}"
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(review.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> ID: {review.id.slice(0, 8)}</span>
                                    <span className={`px-2 py-0.5 rounded uppercase tracking-tighter text-[10px] font-black ${
                                        review.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                        review.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                                        'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {review.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 justify-end">
                                {review.status !== 'approved' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                                {review.status !== 'rejected' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(review.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <MessageSquare className="w-10 h-10 text-slate-300 mb-4" />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">All clear here</h3>
                        <p className="text-slate-500 mt-2">No reviews match your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
