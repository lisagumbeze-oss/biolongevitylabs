import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Shipping" + " | BioLongevity Labs",
  description: "Admin order shipping details.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
