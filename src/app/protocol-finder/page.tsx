import React from 'react';
import ProtocolFinder from '@/components/ProtocolFinder';
import ProtocolFinderSeoContent, {
    getProtocolFinderFaqSchema,
} from '@/components/ProtocolFinderSeoContent';
import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Research Protocol Finder for Peptide Studies',
    description:
        'Match laboratory research goals to COA-verified peptides and bioregulators. Interactive protocol finder for USA research labs—RUO only.',
    alternates: canonicalPath('/protocol-finder'),
    openGraph: {
        title: 'Research Protocol Finder | BioLongevity Labs',
        description: 'Match laboratory research goals to catalog peptides. Research use only.',
        url: `${SITE_URL}/protocol-finder`,
        siteName: 'BioLongevity Labs',
        type: 'website',
    },
};

export default function ProtocolFinderPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(getProtocolFinderFaqSchema()),
                }}
            />
            <ProtocolFinderSeoContent />
            <ProtocolFinder />
        </main>
    );
}
