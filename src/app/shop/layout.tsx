import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How to Buy Research Peptides in USA — Shop Catalog',
  description:
    'Where can I buy research peptides in USA? How much for vials, capsules, and bioregulators? HPLC-verified COA, California to Florida shipping. Research use only.',
  alternates: canonicalPath('/shop'),
  openGraph: {
    title: 'How to Buy Research Peptides in USA | BioLongevity Labs',
    description: 'Where can I buy research peptides in California, Texas, or New York? Browse COA-verified vials, capsules, and bioregulators with USA fulfillment.',
    url: `${SITE_URL}/shop`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Buy Research Peptides in USA | BioLongevity Labs',
    description: 'Where can I buy research peptides in USA? How much for catalog SKUs? Batch COA, USA fulfillment. Research use only.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
