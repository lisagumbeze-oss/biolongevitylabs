"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface HPLCGraphProps {
    purity: number;
    substanceName: string;
}

const HPLCGraph: React.FC<HPLCGraphProps> = ({ purity, substanceName }) => {
    // Generate random points for the HPLC graph
    const points = useMemo(() => {
        const p = [];
        const peakPos = 65; // Percentage through the graph where the main peak is
        
        for (let i = 0; i <= 100; i++) {
            let y = 5; // Baseline noise
            
            // Random noise
            y += Math.random() * 2;
            
            // Small impurities (random peaks)
            if (i === 20 || i === 45 || i === 85) {
                y += Math.random() * 15;
            }
            
            // The Main Peak (Purity)
            const distFromPeak = Math.abs(i - peakPos);
            if (distFromPeak < 10) {
                // Bell curve (Gaussian-ish)
                const height = purity * 0.9;
                y += height * Math.exp(-(distFromPeak * distFromPeak) / 8);
            }
            
            p.push({ x: i, y: 100 - y });
        }
        return p;
    }, [purity]);

    const pathData = `M ${points[0].x},${points[0].y} ` + points.map(p => `L ${p.x},${p.y}`).join(' ');

    return (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(19,127,236,0.1),transparent)]" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase mb-1">HPLC Chromatogram</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spectral Analysis • {substanceName}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-primary tracking-tighter leading-none">{purity}%</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Verified Purity</p>
                </div>
            </div>

            <div className="relative h-48 w-full border-l-2 border-b-2 border-slate-800 mb-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[25, 50, 75].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                    ))}
                    
                    {/* The Graph Path */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    
                    {/* Area under the graph */}
                    <motion.path
                        d={`${pathData} L 100,100 L 0,100 Z`}
                        fill="url(#areaGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    />

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#137fec" stopOpacity="0.5" />
                            <stop offset="65%" stopColor="#137fec" />
                            <stop offset="100%" stopColor="#137fec" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#137fec" />
                            <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Main Peak Indicator */}
                    <motion.circle
                        cx="65"
                        cy={points[65].y}
                        r="3"
                        fill="#137fec"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 2, type: "spring" }}
                        className="filter drop-shadow-[0_0_8px_#137fec]"
                    />
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                    <span>0.00 Retention Time (min)</span>
                    <span>15.00</span>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 relative z-10">
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Signal Response</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Detect (UV-Vis)</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Solvent System</p>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Acetonitrile Gradient</p>
                </div>
            </div>
        </div>
    );
};

export default HPLCGraph;
