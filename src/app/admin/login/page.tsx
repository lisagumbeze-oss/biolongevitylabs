"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                localStorage.setItem('admin_auth', 'true');
                toast.success('Successfully logged in');
                router.push('/admin');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Invalid credentials');
                setLoading(false);
            }
        } catch (error) {
            toast.error('Server error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 mb-6 shadow-xl shadow-primary/5">
                        <Activity className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Private Laboratory Access Only</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl px-5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium"
                                placeholder="Admin username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-slate-950 border border-slate-800 rounded-2xl px-5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-primary hover:bg-sky-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Secure Login
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 flex items-center justify-center gap-6 text-slate-600">
                        <div className="flex items-center gap-2 border border-slate-800 rounded-xl px-3 py-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 border border-slate-800 rounded-xl px-3 py-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Firewall Active</span>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-500 text-xs">
                    Forgotten credentials? <span className="text-primary hover:underline cursor-pointer font-bold">Request Reset</span>
                </p>
            </div>
        </div>
    );
}
