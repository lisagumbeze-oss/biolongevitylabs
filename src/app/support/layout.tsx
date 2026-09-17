import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Contact BioLongevity Labs support team. We are here to help with your research compound order or scientific inquiries.',
  alternates: canonicalPath('/support'),
  openGraph: {
    title: 'Contact Support | BioLongevity Labs',
    description: 'Contact BioLongevity Labs support team for assistance with your research orders.',
    url: `${SITE_URL}/support`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
