import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Guide',
  description: 'A comprehensive guide on peptide reconstitution, handling, and storage for laboratory research.',
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
