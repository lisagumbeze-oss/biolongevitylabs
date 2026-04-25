"use client";

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

interface ScientificTooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

const ScientificTooltip: React.FC<ScientificTooltipProps> = ({ term, definition, children }) => {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <span className="cursor-help border-b border-dotted border-primary/40 hover:border-primary transition-colors text-primary font-bold">
                        {children}
                    </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="z-[200] max-w-xs bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
                        sideOffset={10}
                    >
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Info className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{term}</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                {definition}
                            </p>
                            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Source: BioLongevity Labs Wiki</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Learn More →</span>
                            </div>
                        </div>
                        <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default ScientificTooltip;
