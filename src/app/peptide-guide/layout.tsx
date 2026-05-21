import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Guide',
  description: 'A comprehensive guide on peptide reconstitution, handling, and storage for laboratory research.',
  alternates: canonicalPath('/peptide-guide'),
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
