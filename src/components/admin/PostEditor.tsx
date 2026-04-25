"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Save, 
    X, 
    Image as ImageIcon, 
    Type, 
    Link as LinkIcon, 
    Eye, 
    Code,
    Loader2,
    ArrowLeft,
    Check,
    FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PostEditorProps {
    postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(postId ? true : false);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        date: new Date().toISOString()
    });

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/admin/blog?id=${postId}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setFormData(data);
        } catch (error) {
            toast.error('Failed to load article');
            router.push('/admin/blog');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        
        setFormData(prev => ({ 
            ...prev, 
            title, 
            slug: postId ? prev.slug : slug // Only auto-generate slug for new posts
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = postId ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/blog', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(postId ? 'Article updated' : 'Article published');
                router.push('/admin/blog');
                router.refresh();
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast.error('Could not save article');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing manuscript...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="p-2 text-slate-500 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[300px]">
                        {postId ? 'Edit Publication' : 'New Scientific Record'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            previewMode 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        {previewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {previewMode ? 'Edit Content' : 'Preview Article'}
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {postId ? 'Save Changes' : 'Publish Article'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Type className="w-3 h-3" />
                                Publication Title
                            </label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Enter article title..."
                                required
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800 p-0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                Scientific Excerpt
                            </label>
                            <textarea 
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Write a brief summary of the research findings..."
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                {previewMode ? <Eye className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                                {previewMode ? 'Article Preview' : 'Scientific Content (HTML/Markdown)'}
                            </label>
                            {previewMode ? (
                                <div className="prose prose-slate dark:prose-invert max-w-none p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 min-h-[500px]">
                                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                                </div>
                            ) : (
                                <textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter article content in HTML or plain text..."
                                    rows={25}
                                    className="w-full font-mono bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-sm focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Meta */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-4">Metadata</h3>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" />
                                URL Slug
                            </label>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-mono">/research/</span>
                                <input 
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 bg-transparent border-none p-0 text-xs font-bold focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" />
                                Featured Image URL
                            </label>
                            <input 
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            {formData.imageUrl && (
                                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video group relative">
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532187875605-2fe358a71e48?w=800&auto=format&fit=crop&q=60';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Created Date</span>
                                <span className="text-slate-900 dark:text-white font-black">
                                    {new Date(formData.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Status</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-black">PUBLISHED</span>
                            </div>
                        </div>
                    </div>

                    {/* SEO Quick Tips */}
                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Scientific Writing Tips</h4>
                        <ul className="space-y-2">
                            {[
                                'Include target compounds in title',
                                'Link to peer-reviewed studies',
                                'Use clear <h3> for sub-headings',
                                'Highlight key research takeaways'
                            ].map((tip, i) => (
                                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    );
}
