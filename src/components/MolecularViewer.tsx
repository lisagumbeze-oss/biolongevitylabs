"use client";

import React from "react";
import { motion } from "framer-motion";

const MolecularViewer = () => {
    // Generate random atoms
    const atoms = [
        { x: 50, y: 50, r: 12, color: "bg-primary", blur: "shadow-[0_0_30px_#137fec]" },
        { x: 30, y: 30, r: 8, color: "bg-slate-400", blur: "shadow-[0_0_20px_rgba(148,163,184,0.3)]" },
        { x: 70, y: 35, r: 10, color: "bg-primary/60", blur: "shadow-[0_0_20px_#137fec80]" },
        { x: 25, y: 70, r: 9, color: "bg-slate-800", blur: "" },
        { x: 75, y: 75, r: 7, color: "bg-primary/40", blur: "" },
    ];

    const bonds = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 0, to: 3 },
    ];

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
            <motion.div
                animate={{ 
                    rotateY: [0, 360],
                    rotateX: [0, 45, 0],
                    y: [0, -20, 0]
                }}
                transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                className="relative w-64 h-64 preserve-3d"
            >
                {/* Bonds (Lines) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                    {bonds.map((bond, i) => (
                        <motion.line
                            key={i}
                            x1={`${atoms[bond.from].x}%`}
                            y1={`${atoms[bond.from].y}%`}
                            x2={`${atoms[bond.to].x}%`}
                            y2={`${atoms[bond.to].y}%`}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-slate-200 dark:text-slate-800"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.5 }}
                            transition={{ delay: i * 0.2, duration: 1 }}
                        />
                    ))}
                </svg>

                {/* Atoms (Circles) */}
                {atoms.map((atom, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${atom.color} ${atom.blur} border border-white/20`}
                        style={{
                            width: atom.r * 4,
                            height: atom.r * 4,
                            left: `${atom.x}%`,
                            top: `${atom.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                    />
                ))}

                {/* Orbiting particles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={`orbit-${i}`}
                        className="absolute w-2 h-2 rounded-full bg-primary/40"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: '200%',
                            height: '200%',
                            left: '-50%',
                            top: '-50%',
                            border: '1px solid rgba(19,127,236,0.1)',
                            borderRadius: '50%',
                        }}
                    />
                ))}
            </motion.div>

            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(19,127,236,0.05),transparent)] pointer-events-none" />
        </div>
    );
};

export default MolecularViewer;
