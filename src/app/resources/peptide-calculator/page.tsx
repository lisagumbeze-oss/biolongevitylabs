"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Info, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PeptideCalculatorPage() {
    const [peptideMass, setPeptideMass] = useState<string>("5");
    const [customPeptideMass, setCustomPeptideMass] = useState<string>("");

    const [diluentVolume, setDiluentVolume] = useState<string>("2");
    const [customDiluentVolume, setCustomDiluentVolume] = useState<string>("");

    const [targetDose, setTargetDose] = useState<string>("0.25");
    const [customTargetDose, setCustomTargetDose] = useState<string>("");
    const [customTargetDoseUnit, setCustomTargetDoseUnit] = useState<"mcg" | "mg">("mcg");

    const [syringeSize, setSyringeSize] = useState<string>("1");

    const result = React.useMemo(() => {
        const mass = peptideMass === "Other" ? parseFloat(customPeptideMass) : parseFloat(peptideMass);
        const volume = diluentVolume === "Other" ? parseFloat(customDiluentVolume) : parseFloat(diluentVolume);

        let dose = 0;
        if (targetDose === "Other") {
            const parsedCustom = parseFloat(customTargetDose);
            dose = customTargetDoseUnit === "mcg" ? parsedCustom / 1000 : parsedCustom;
        } else {
            dose = parseFloat(targetDose);
        }

        const syringe = parseFloat(syringeSize);

        if (isNaN(mass) || isNaN(volume) || isNaN(dose) || isNaN(syringe) || mass <= 0 || volume <= 0 || dose <= 0) {
            return { volumeToInject: 0, syringeUnits: 0, error: "Please enter valid, positive numbers." };
        }

        const concentration = mass / volume; // mg / mL
        const volumeToInject = dose / concentration; // mL

        if (volumeToInject > syringe) {
            return { volumeToInject: 0, syringeUnits: 0, error: `Volume to inject (${volumeToInject.toFixed(3)} mL) exceeds your ${syringe} mL syringe capacity.` };
        }

        const syringeUnits = Math.round(volumeToInject * 100);

        return { volumeToInject, syringeUnits, error: null };
    }, [peptideMass, customPeptideMass, diluentVolume, customDiluentVolume, targetDose, customTargetDose, customTargetDoseUnit, syringeSize]);

    return (
        <div className="bg-background min-h-screen pt-12 pb-24">
            {/* Header */}
            <div className="bg-slate-900 dark:bg-slate-950 py-20 px-4 relative overflow-hidden mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary font-bold tracking-widest uppercase text-xs mb-6 border border-primary/20">
                        Research Tool
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Peptide Reconstitution <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Calculator</span>
                    </h1>
                    <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">
                        Accurately calculate your peptide concentrations and required injection volumes for laboratory research.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Calculator Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Measurement Inputs</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Enter your experiment variables</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Peptide Mass */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    Peptide Mass (Vial Size)
                                </label>
                                <select
                                    value={peptideMass}
                                    onChange={(e) => setPeptideMass(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="2">2 mg</option>
                                    <option value="3">3 mg</option>
                                    <option value="5">5 mg</option>
                                    <option value="10">10 mg</option>
                                    <option value="15">15 mg</option>
                                    <option value="Other">Custom Amount</option>
                                </select>
                                {peptideMass === "Other" && (
                                    <div className="mt-2 relative">
                                        <input
                                            type="number"
                                            placeholder="Enter in mg"
                                            value={customPeptideMass}
                                            onChange={(e) => setCustomPeptideMass(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">mg</span>
                                    </div>
                                )}
                            </div>

                            {/* Diluent Volume */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    Diluent Volume (Bac Water)
                                </label>
                                <select
                                    value={diluentVolume}
                                    onChange={(e) => setDiluentVolume(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="1">1 mL</option>
                                    <option value="2">2 mL</option>
                                    <option value="3">3 mL</option>
                                    <option value="5">5 mL</option>
                                    <option value="Other">Custom Volume</option>
                                </select>
                                {diluentVolume === "Other" && (
                                    <div className="mt-2 relative">
                                        <input
                                            type="number"
                                            placeholder="Enter in mL"
                                            value={customDiluentVolume}
                                            onChange={(e) => setCustomDiluentVolume(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">mL</span>
                                    </div>
                                )}
                            </div>

                            {/* Target Dose */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    Target Dose (Per Administration)
                                </label>
                                <select
                                    value={targetDose}
                                    onChange={(e) => setTargetDose(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="0.05">50 mcg (0.05 mg)</option>
                                    <option value="0.1">100 mcg (0.10 mg)</option>
                                    <option value="0.25">250 mcg (0.25 mg)</option>
                                    <option value="0.5">500 mcg (0.50 mg)</option>
                                    <option value="1">1 mg</option>
                                    <option value="2.5">2.5 mg</option>
                                    <option value="5">5 mg</option>
                                    <option value="10">10 mg</option>
                                    <option value="Other">Custom Dose</option>
                                </select>
                                {targetDose === "Other" && (
                                    <div className="mt-2 flex gap-3">
                                        <input
                                            type="number"
                                            placeholder="Enter dose"
                                            value={customTargetDose}
                                            onChange={(e) => setCustomTargetDose(e.target.value)}
                                            className="flex-1 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors"
                                        />
                                        <select
                                            value={customTargetDoseUnit}
                                            onChange={(e) => setCustomTargetDoseUnit(e.target.value as "mcg" | "mg")}
                                            className="w-28 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors appearance-none text-center"
                                        >
                                            <option value="mcg">mcg</option>
                                            <option value="mg">mg</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Syringe Size */}
                            <div>
                                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    Syringe Size
                                </label>
                                <select
                                    value={syringeSize}
                                    onChange={(e) => setSyringeSize(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-0 focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="0.3">0.3 mL (30 Units)</option>
                                    <option value="0.5">0.5 mL (50 Units)</option>
                                    <option value="1">1.0 mL (100 Units)</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center border border-slate-800 dark:border-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">Required Volume</h3>

                                {result ? (
                                    result.error ? (
                                        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 font-medium flex items-start gap-3 text-left">
                                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                            <span>{result.error}</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter">
                                                    {result.volumeToInject.toFixed(3)}<span className="text-2xl text-slate-500 ml-1">mL</span>
                                                </div>
                                                <div className="inline-block px-4 py-2 rounded-xl bg-primary/20 text-primary font-bold tracking-widest text-lg border border-primary/20">
                                                    {result.syringeUnits} UNITS
                                                </div>
                                            </div>

                                            {/* Visual representation of syringe */}
                                            <div className="pt-8 mt-8 border-t border-slate-800">
                                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                                    <span>0</span>
                                                    <span>{parseFloat(syringeSize) * 100}</span>
                                                </div>
                                                <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden relative border flex items-center p-1 border-slate-700 shadow-inner">
                                                    {/* Ruler marks */}
                                                    <div className="absolute inset-0 w-full h-full flex justify-between z-10 opacity-20 pointer-events-none px-2">
                                                        {[...Array(11)].map((_, i) => (
                                                            <div key={i} className="h-full w-0.5 bg-white"></div>
                                                        ))}
                                                    </div>
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full relative z-0 shadow-lg shadow-primary/30 transition-all duration-500 ease-out"
                                                        style={{ width: `${Math.min(100, (result.volumeToInject / parseFloat(syringeSize)) * 100)}%` }}
                                                    >
                                                        {result.syringeUnits > 5 && (
                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/90">
                                                                {result.syringeUnits}U
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 text-sm mt-4 font-medium">Draw <strong className="text-white">{result.volumeToInject.toFixed(3)} mL</strong> into a <strong className="text-white">{syringeSize} mL</strong> syringe.</p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-3xl font-black text-slate-600">--</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-500/10 rounded-3xl p-6 border border-amber-200 dark:border-amber-500/20">
                            <div className="flex items-start gap-4">
                                <Info className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-amber-900 dark:text-amber-500 mb-2">Research Use Only</h4>
                                    <p className="text-amber-800/80 dark:text-amber-200/70 text-sm font-medium leading-relaxed">
                                        This calculator is provided strictly for educational and laboratory research purposes.
                                        BioLongevity Labs products are not intended for human consumption or therapeutic use.
                                        Ensure all measurements are verified independently.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Embedded Guide Section */}
                <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Need reconstitution instructions?</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto mb-8">
                            Read our comprehensive guide on handling, diluting, and storing research peptides properly for maximum stability.
                        </p>
                        <Link href="/peptide-guide" className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-colors group">
                            Read the Peptide Guide
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
