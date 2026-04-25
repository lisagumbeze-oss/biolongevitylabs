"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
    Upload, 
    Trash2, 
    Copy, 
    ExternalLink, 
    FileText, 
    ImageIcon, 
    Loader2, 
    Plus,
    X,
    Check,
    Search,
    Grid,
    List as ListIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MediaFile {
    name: string;
    url: string;
    size: number;
    createdAt: string;
    type: string;
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/media');
            const data = await res.json();
            if (Array.isArray(data)) {
                setFiles(data);
            }
        } catch (error) {
            toast.error('Failed to load media assets');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const newFile = await res.json();
                setFiles([newFile, ...files]);
                toast.success('File uploaded successfully');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (name: string) => {
        if (!confirm('Permanently delete this scientific asset?')) return;

        try {
            const res = await fetch(`/api/admin/media?name=${name}`, { method: 'DELETE' });
            if (res.ok) {
                setFiles(files.filter(f => f.name !== name));
                toast.success('Asset removed');
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            toast.error('Could not delete file');
        }
    };

    const copyUrl = (url: string) => {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl);
        toast.success('Public URL copied to clipboard');
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredFiles = files.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isImage = (type: string) => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(type?.toLowerCase());

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Scientific Media</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Centralized management for laboratory microscopy, charts, and diagrams.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        Upload Asset
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search assets by filename..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                    />
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-4">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Media Display */}
            {loading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing storage...</p>
                </div>
            ) : filteredFiles.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredFiles.map((file, i) => (
                            <div key={i} className="group relative aspect-square bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-primary transition-all">
                                {isImage(file.type) ? (
                                    <img 
                                        src={file.url} 
                                        alt={file.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
                                        <FileText className="w-10 h-10 text-slate-300 mb-2" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.type}</span>
                                    </div>
                                )}
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 text-center">
                                    <p className="text-white text-[10px] font-bold line-clamp-2 mb-2">{file.name}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => copyUrl(file.url)}
                                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-all"
                                            title="Copy URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(file.name)}
                                            className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-500 rounded-lg backdrop-blur-md transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-slate-400 text-[10px] font-bold mt-2">{formatSize(file.size)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Size</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {filteredFiles.map((file, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {isImage(file.type) ? (
                                                        <img src={file.url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FileText className="w-5 h-5 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest">
                                                {file.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500">{formatSize(file.size)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => copyUrl(file.url)} className="p-2 text-slate-400 hover:text-primary transition-all"><Copy className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(file.name)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Archive is empty</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">You haven't uploaded any research assets yet. Start by uploading your first laboratory file.</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-8 flex items-center gap-2 px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        First Upload
                    </button>
                </div>
            )}
        </div>
    );
}
