import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Details" + " | BioLongevity Labs",
  description: "Admin order details.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
