import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Calculator',
  description: 'Free peptide reconstitution calculator tool for scientists conducting in vitro studies.',
  alternates: canonicalPath('/resources/peptide-calculator'),
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
