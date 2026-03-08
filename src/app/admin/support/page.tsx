"use client";

import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Paperclip,
    Send,
    CheckCircle,
    FileText,
    Download,
    Image as ImageIcon,
    User,
    Package,
    History,
    Edit
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const ACTIVE_CHATS = [
    { id: '1', user: 'guest_492@email.com', initial: 'G', time: '10:30 AM', subject: 'Payment Proof Attached', message: "I've attached the screenshot of my transfer. Can you confirm?", status: 'online', isUnread: true },
    { id: '2', user: 'guest_881@email.com', initial: 'G', time: '10:15 AM', subject: 'Order Status', message: "Where is my order? It's been 3 days.", status: 'offline', isUnread: false },
    { id: '3', user: 'guest_102@email.com', initial: 'G', time: '09:45 AM', subject: 'Shipping Info', message: "Do you ship to Alaska?", status: 'offline', isUnread: false },
];

const MESSAGES = [
    { type: 'system', text: 'Chat started at 10:25 AM', time: '10:25 AM' },
    { type: 'guest', text: "Hello, I just placed an order but chose offline bank transfer. I've completed the transfer.", time: '10:26 AM' },
    { type: 'admin', text: "Hi there! Thank you for your purchase. Please upload a screenshot or photo of the transfer receipt so I can verify and process your order immediately.", time: '10:27 AM' },
    { type: 'guest', text: "I've attached the screenshot of my transfer. Can you confirm?", time: '10:30 AM', attachment: true },
];

export default function AdminSupportPage() {
    const [currentTab, setCurrentTab] = useState<'active' | 'closed'>('active');
    const [activeChatId, setActiveChatId] = useState('1');
    const [messageInput, setMessageInput] = useState('');

    const activeChat = ACTIVE_CHATS.find(c => c.id === activeChatId) || ACTIVE_CHATS[0];

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] -m-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {/* Header - visible only on mobile/tablet if needed, but we rely on AdminHeader mostly. Let's keep it clean. */}

            <div className="flex flex-1 overflow-hidden h-full">
                {/* Left Pane: Conversation List */}
                <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <button
                                onClick={() => setCurrentTab('active')}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-bold transition-all ${currentTab === 'active' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setCurrentTab('closed')}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-bold transition-all ${currentTab === 'closed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Closed
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {ACTIVE_CHATS.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/50 ${activeChatId === chat.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                            >
                                <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full h-10 w-10 flex items-center justify-center shrink-0 font-bold">
                                    {chat.initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className={`text-sm truncate ${chat.isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                                            {chat.user}
                                        </p>
                                        <p className="text-slate-500 text-xs shrink-0 ml-2 font-medium">{chat.time}</p>
                                    </div>
                                    <p className={`text-xs truncate mb-1 ${chat.isUnread ? 'font-bold text-slate-800 dark:text-slate-200' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                                        {chat.subject}
                                    </p>
                                    <p className="text-slate-500 text-xs line-clamp-1 font-medium">{chat.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Middle Pane: Chat Thread */}
                <section className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 min-w-0 border-r border-slate-200 dark:border-slate-800">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full h-10 w-10 flex items-center justify-center font-bold">
                                {activeChat.initial}
                            </div>
                            <div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{activeChat.user}</h3>
                                <p className="text-slate-500 text-xs flex items-center gap-1.5 font-medium mt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-primary shadow-[0_0_8px_rgba(19,127,236,0.5)]' : 'bg-slate-400'}`}></span>
                                    {activeChat.status === 'online' ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Resolve">
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="More options">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {MESSAGES.map((msg, idx) => (
                            msg.type === 'system' ? (
                                <div key={idx} className="flex justify-center">
                                    <span className="text-xs font-bold text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">{msg.text}</span>
                                </div>
                            ) : msg.type === 'guest' ? (
                                <div key={idx} className="flex gap-3 max-w-[85%]">
                                    <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full h-8 w-8 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                                        G
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700/50 text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                            {msg.text}

                                            {msg.attachment && (
                                                <div className="mt-3 relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 cursor-pointer w-64 h-40">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {/* Fake document look */}
                                                        <div className="w-16 h-20 bg-white dark:bg-slate-800 shadow-sm rounded flex flex-col items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                                                            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                                                            <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded mb-1"></div>
                                                            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-2.5 text-xs flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                                        <span className="truncate">transfer_receipt.jpg</span>
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 ml-1">{msg.time}</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={idx} className="flex gap-3 max-w-[85%] self-end ml-auto flex-row-reverse">
                                    <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-1 font-bold text-xs shadow-sm">
                                        AD
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-sm shadow-sm text-sm font-medium leading-relaxed">
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 mr-1">{msg.time}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                        {/* Canned Responses */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                            {['Payment Confirmed', 'Need clearer photo', 'Send bank details'].map((canned, i) => (
                                <button key={i} className="whitespace-nowrap px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full transition-colors flex shrink-0">
                                    {canned}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                            <button className="p-2.5 text-slate-400 hover:text-primary transition-colors shrink-0 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <textarea
                                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 py-3"
                                placeholder="Type your message..."
                                rows={1}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            ></textarea>
                            <button className="p-2.5 bg-primary text-white rounded-lg hover:bg-sky-500 transition-colors shrink-0 flex items-center justify-center h-11 w-11 shadow-sm active:scale-95">
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Pane: Order Details Context */}
                <aside className="w-80 bg-white dark:bg-slate-900 flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Guest Order Context</h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Order ID</p>
                                    <Link href="/admin/orders/ORD-89432" className="font-mono text-sm font-black text-primary hover:underline">
                                        #ORD-89432
                                    </Link>
                                </div>
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black uppercase rounded">Awaiting Payment</span>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Date</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Today, 10:20 AM</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Payment Method</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Manual Bank Transfer</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Total Amount</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">$124.96</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Items (2)</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-400">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">BPC-157 (5mg)</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Qty: 2 × $49.99</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-400">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">Bacteriostatic Water</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Qty: 1 × $14.99</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <Link href="/admin/orders/ORD-89432" className="w-full py-2.5 px-4 bg-primary hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Verify Payment Proof
                            </Link>
                            <Link href="/admin/orders/ORD-89432" className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <FileText className="w-4 h-4" />
                                View Full Order
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
