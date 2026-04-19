"use client";

import React, { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Props {
    productId: string;
    onSuccess: () => void;
}

const ReviewForm: React.FC<Props> = ({ productId, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                    authorName: name,
                    authorEmail: email,
                }),
            });

            if (res.ok) {
                setShowSuccess(true);
                setComment("");
                setName("");
                setEmail("");
                setRating(5);
                setTimeout(() => {
                    setShowSuccess(false);
                    onSuccess();
                }, 3000);
            } else {
                toast.error("Failed to post review. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 rounded-[3rem] p-8 sm:p-12 border border-slate-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center text-center py-10"
                    >
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Review Submitted</h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Thank you for contributing to our research data.</p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Submit Research Findings</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Your feedback helps standardizing peptide research protocols globally.</p>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="focus:outline-none transition-transform hover:scale-125"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= (hover || rating) ? "text-amber-500 fill-current" : "text-slate-200"
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-4 text-xs font-black text-slate-900 uppercase tracking-widest">
                                    {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Standard" : rating === 2 ? "Below Average" : "Poor"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Researcher Name</label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Dr. John Doe"
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Verification Email</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Used for purchase verification"
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Research Observations</label>
                            <textarea
                                required
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder="Describe your findings or experience with this compound..."
                                className="w-full px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-fit px-12 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                            Post Review
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReviewForm;
