"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Truck, Store, User, MapPin, Package, Settings, Printer, Eye, ArrowLeft, Ruler } from 'lucide-react';

export default function AdminShippingLabelPage() {
    const params = useParams();
    const orderId = params.id as string || 'ORD-2023-8942';

    const [carrier, setCarrier] = useState('usps');
    const [weight, setWeight] = useState('2.5');
    const [weightUnit, setWeightUnit] = useState('lbs');
    const [length, setLength] = useState('10');
    const [width, setWidth] = useState('8');
    const [height, setHeight] = useState('4');

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2 text-sm text-slate-500 dark:text-slate-400">
                <Link href={`/admin/orders/${orderId}`} className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Order Details
                </Link>
            </div>

            <div className="mb-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Generate Shipping Label</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Order #{orderId}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Configuration */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Addresses Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                            <div className="pr-6">
                                <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400">
                                    <Store className="w-5 h-5" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shipping From</h2>
                                </div>
                                <div className="text-sm space-y-1.5 font-medium">
                                    <p className="font-bold text-slate-900 dark:text-white text-base">BioLongevity Labs</p>
                                    <p className="text-slate-600 dark:text-slate-400">123 Research Way</p>
                                    <p className="text-slate-600 dark:text-slate-400">Suite 400</p>
                                    <p className="text-slate-600 dark:text-slate-400">Austin, TX 78701</p>
                                    <p className="text-slate-600 dark:text-slate-400">United States</p>
                                </div>
                            </div>
                            <div className="pt-6 md:pt-0 md:pl-6">
                                <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400">
                                    <User className="w-5 h-5" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shipping To</h2>
                                </div>
                                <div className="text-sm space-y-1.5 font-medium">
                                    <p className="font-bold text-slate-900 dark:text-white text-base">Sarah Jenkins</p>
                                    <p className="text-slate-600 dark:text-slate-400">1234 Commerce Blvd</p>
                                    <p className="text-slate-600 dark:text-slate-400">Suite 400</p>
                                    <p className="text-slate-600 dark:text-slate-400">Austin, TX 78701</p>
                                    <p className="text-slate-600 dark:text-slate-400">United States</p>
                                </div>
                                <button className="mt-4 text-sm text-primary font-bold hover:underline">
                                    Edit Address
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Package Details Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 text-slate-900 dark:text-white">
                            <Package className="w-6 h-6 text-slate-400" />
                            Package Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Weight</label>
                                <div className="flex shadow-sm rounded-xl overflow-hidden font-medium">
                                    <input
                                        className="block w-full border-r-0 rounded-l-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 shadow-inner"
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                    <select
                                        className="rounded-none rounded-r-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 px-4 font-bold border-l"
                                        value={weightUnit}
                                        onChange={(e) => setWeightUnit(e.target.value)}
                                    >
                                        <option>lbs</option>
                                        <option>oz</option>
                                        <option>kg</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1">
                                    Dimensions (L × W × H) <Ruler className="w-3 h-3" />
                                </label>
                                <div className="flex gap-2 text-slate-500 items-center font-bold">
                                    <input
                                        className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 text-center shadow-inner"
                                        placeholder="L"
                                        type="number"
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                    />
                                    <span>×</span>
                                    <input
                                        className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 text-center shadow-inner"
                                        placeholder="W"
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(e.target.value)}
                                    />
                                    <span>×</span>
                                    <input
                                        className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary h-12 text-center shadow-inner"
                                        placeholder="H"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    />
                                    <span className="text-sm ml-1 text-slate-600 dark:text-slate-400">in</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Select Carrier</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <label className="cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="carrier"
                                    type="radio"
                                    checked={carrier === 'usps'}
                                    onChange={() => setCarrier('usps')}
                                />
                                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 transition-all text-center relative overflow-hidden">
                                    <Truck className="w-8 h-8 text-primary/20 absolute -right-2 -bottom-2" />
                                    <div className="font-black text-xl mb-1 text-slate-900 dark:text-white">USPS</div>
                                    <div className="text-sm font-medium text-slate-500">Priority Mail</div>
                                </div>
                            </label>
                            <label className="cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="carrier"
                                    type="radio"
                                    checked={carrier === 'ups'}
                                    onChange={() => setCarrier('ups')}
                                />
                                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 transition-all text-center relative overflow-hidden">
                                    <Truck className="w-8 h-8 text-primary/20 absolute -right-2 -bottom-2" />
                                    <div className="font-black text-xl mb-1 text-slate-900 dark:text-white">UPS</div>
                                    <div className="text-sm font-medium text-slate-500">Ground</div>
                                </div>
                            </label>
                            <label className="cursor-pointer group">
                                <input
                                    className="peer sr-only"
                                    name="carrier"
                                    type="radio"
                                    checked={carrier === 'fedex'}
                                    onChange={() => setCarrier('fedex')}
                                />
                                <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 transition-all text-center relative overflow-hidden">
                                    <Truck className="w-8 h-8 text-primary/20 absolute -right-2 -bottom-2" />
                                    <div className="font-black text-xl mb-1 text-slate-900 dark:text-white">FedEx</div>
                                    <div className="text-sm font-medium text-slate-500">Home Delivery</div>
                                </div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors">
                                Calculate Rate
                            </button>
                            <div className="text-right">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1">Estimated Cost</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white">$8.45</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-2 mb-10">
                        <Link href={`/admin/orders/${orderId}`} className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                            Cancel
                        </Link>
                        <button className="px-6 py-3 bg-primary hover:bg-sky-500 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center gap-2 active:scale-[0.98]">
                            <Printer className="w-5 h-5" />
                            Generate & Print Label
                        </button>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="w-full lg:w-80 xl:w-[400px] flex flex-col pt-2 shrink-0">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Label Preview
                    </h3>
                    <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden text-black font-sans min-h-[500px]">
                        {/* Faux Label Content (strictly light mode styling inside) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-start">
                            <div className="text-[10px] leading-tight font-black">
                                <div>P</div>
                                <div className="mt-1">{carrier.toUpperCase()} {carrier === 'usps' ? 'PRIORITY MAIL' : carrier === 'ups' ? 'GROUND' : 'HOME'}</div>
                            </div>
                            <div className="text-5xl font-black tracking-tighter">P</div>
                        </div>

                        <div className="flex justify-between text-xs mb-8 uppercase font-bold">
                            <div>
                                <p>BioLongevity Labs</p>
                                <p>123 Research Way</p>
                                <p>Austin, TX 78701</p>
                            </div>
                        </div>

                        <div className="mb-12 pl-8 space-y-1">
                            <p className="text-sm font-black uppercase mb-2">Ship To:</p>
                            <p className="text-xl font-black leading-tight uppercase relative">
                                <MapPin className="w-5 h-5 absolute -left-8 top-0.5" />
                                Sarah Jenkins
                            </p>
                            <p className="text-xl font-bold leading-tight uppercase">1234 Commerce Blvd</p>
                            <p className="text-xl font-bold leading-tight uppercase">Suite 400</p>
                            <p className="text-xl font-bold leading-tight uppercase">Austin TX 78701</p>
                        </div>

                        <div className="mt-auto pt-6 border-t-[3px] border-black text-center">
                            <p className="text-xs font-black mb-3">{carrier.toUpperCase()} TRACKING #</p>
                            {/* Fake Barcode */}
                            <div className="h-20 w-full flex justify-between items-stretch px-4 mb-3 opacity-90">
                                <div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-1.5 bg-black"></div><div className="w-3 bg-black"></div><div className="w-0.5 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2.5 bg-black"></div><div className="w-1 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-0.5 bg-black"></div><div className="w-3 bg-black"></div><div className="w-1 bg-black"></div><div className="w-1.5 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-0.5 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-1.5 bg-black"></div><div className="w-3 bg-black"></div><div className="w-1 bg-black"></div>
                            </div>
                            <p className="text-base font-mono tracking-widest font-black">9405 5036 9930 0000 0000 00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
