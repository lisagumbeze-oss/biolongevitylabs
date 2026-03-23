import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Reconstitution Calculator',
  description: 'Free peptide reconstitution calculator tool for scientists conducting in vitro studies.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
