import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Order Confirmation" + " | BioLongevity Labs",
  description: "Thank you for your order.",
  robots: { index: false, follow: false },
  openGraph: {
    url: `${SITE_URL}/order-confirmation`,
    siteName: 'BioLongevity Labs',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
