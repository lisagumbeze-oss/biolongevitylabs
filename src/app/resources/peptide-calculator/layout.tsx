import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Peptide Calculator for Laboratory Reconstitution',
  description: 'Free peptide calculator for laboratory reconstitution: mass, diluent volume, and concentration. Research use only, not a dosing tool.',
  alternates: canonicalPath('/resources/peptide-calculator'),
  openGraph: {
    title: 'Peptide Calculator | BioLongevity Labs',
    description: 'Peptide calculator for laboratory reconstitution and concentration. Research use only.',
    url: `${SITE_URL}/resources/peptide-calculator`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
