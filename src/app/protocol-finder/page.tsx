import React from "react";
import ProtocolFinder from "@/components/ProtocolFinder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Peptide Protocol Finder | Personalized Bio-Optimization",
  description: "Use our AI-powered tool to find the highest purity research compounds matching your specific study goals in recovery, longevity, and brain health.",
};

export default function ProtocolFinderPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary dark:text-blue-400 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest">Intelligent Research Assistant</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight">
            Find Your Optimal <br /><span className="text-primary italic">Research Protocol</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Answer a few questions about your research objectives, and our AI will recommend the specific compounds and bioregulators optimized for your study.
          </p>
        </div>

        <ProtocolFinder />

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-loose">
            Disclaimer: The results provided by this tool are for research classification purposes only. BioLongevity Labs is a research chemical supplier; all compounds are intended for laboratory in vitro research only.
          </p>
        </div>
      </div>
    </div>
  );
}
