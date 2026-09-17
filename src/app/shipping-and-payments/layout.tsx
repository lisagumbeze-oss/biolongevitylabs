import { Metadata } from 'next';
import { canonicalPath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shipping and Payments',
  description: 'Information regarding BioLongevity Labs shipping policies, international delivery, and accepted payment methods.',
  alternates: canonicalPath('/shipping-and-payments'),
  openGraph: {
    title: 'Shipping and Payments | BioLongevity Labs',
    description: 'Shipping policies and accepted payment methods for research-compound orders.',
    url: `${SITE_URL}/shipping-and-payments`,
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
