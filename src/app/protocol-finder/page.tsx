import React from 'react';
import ProtocolFinder from '@/components/ProtocolFinder';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Research Protocol Finder | BioLongevity Labs',
    description: 'Use our intelligent AI-driven tool to find the perfect peptide stack for your laboratory research objectives.',
};

export default function ProtocolFinderPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
            <ProtocolFinder />
        </main>
    );
}
