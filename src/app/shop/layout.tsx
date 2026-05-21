import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Buy Research Peptides Online — Shop Catalog',
  description:
    'Buy peptides online for laboratory research: vials, capsules, and bioregulators with HPLC-verified COA. USA fulfillment, 99%+ purity. Research use only.',
  alternates: canonicalPath('/shop'),
  openGraph: {
    title: 'Shop Premium Peptides & Bioregulators | BioLongevity Labs',
    description: 'Browse our extensive catalog of 99%+ purity research-grade peptides, bioregulators, creams, and capsules crafted under GMP standards in the USA.',
    url: 'https://biolongevitylabss.com/shop',
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Premium Peptides & Bioregulators | BioLongevity Labs',
    description: 'Browse our extensive catalog of 99%+ purity research-grade peptides, bioregulators, creams, and capsules.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
