import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping and Payments',
  description: 'Information regarding BioLongevity Labs shipping policies, international delivery, and accepted payment methods.',
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
