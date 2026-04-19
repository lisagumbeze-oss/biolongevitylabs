"use client";

import React from "react";
import { Star, CheckCircle2, User } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
    id: string;
    rating: number;
    comment: string;
    author_name: string;
    is_verified: boolean;
    created_at: string;
}

interface Props {
    reviews: Review[];
    isLoading: boolean;
}

const ReviewList: React.FC<Props> = ({ reviews, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex flex-col gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="h-4 w-full bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-2/3 bg-slate-200 rounded-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Star className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">No Reviews Yet</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Be the first to share your research findings.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review, i) => (
                <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col gap-5 p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-primary/20 transition-colors shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    {review.author_name}
                                    {review.is_verified && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                            Verified Buyer
                                        </div>
                                    )}
                                </h4>
                                <div className="flex items-center gap-1 text-amber-500 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                        &quot;{review.comment}&quot;
                    </p>

                    <div className="pt-4 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        Research Application Confirmed
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ReviewList;
