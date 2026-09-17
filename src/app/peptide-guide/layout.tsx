import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Guide',
  description: 'A comprehensive guide on peptide reconstitution, handling, and storage for laboratory research.',
  alternates: canonicalPath('/peptide-guide'),
  openGraph: {
    title: 'Peptide Reconstitution Guide | BioLongevity Labs',
    description: 'Laboratory guidance on peptide reconstitution, handling, and storage. Research use only.',
    url: `${SITE_URL}/peptide-guide`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
