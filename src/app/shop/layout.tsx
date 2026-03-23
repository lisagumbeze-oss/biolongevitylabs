import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Premium Peptides & Bioregulators',
  description: 'Browse our extensive catalog of 99%+ purity research-grade peptides, bioregulators, creams, and capsules crafted under GMP standards in the USA.',
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
