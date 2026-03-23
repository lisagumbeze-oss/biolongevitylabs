import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Review the BioLongevity Labs refund and returns policy for our research peptides and bioregulators.',
};

export default function RefundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
