import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Research & Knowledge Base',
  description: 'Explore research-backed articles on peptide mechanisms, bioregulator applications, and laboratory protocols for scientists conducting in vitro studies.',
  alternates: canonicalPath('/research'),
  openGraph: {
    title: 'Research & Knowledge Base | BioLongevity Labs',
    description: 'Explore research-backed articles on peptide mechanisms, bioregulator applications, and laboratory protocols for scientists conducting in vitro studies.',
    url: `${SITE_URL}/research`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Knowledge Base | BioLongevity Labs',
    description: 'Explore research-backed articles on peptide mechanisms and laboratory protocols.',
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
