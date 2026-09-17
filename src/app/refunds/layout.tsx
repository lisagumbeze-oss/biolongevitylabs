import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Review the BioLongevity Labs refund and returns policy for our research peptides and bioregulators.',
  alternates: canonicalPath('/refunds'),
  openGraph: {
    title: 'Refund Policy | BioLongevity Labs',
    description: 'Refund and returns policy for research peptides and bioregulators.',
    url: `${SITE_URL}/refunds`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function RefundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
