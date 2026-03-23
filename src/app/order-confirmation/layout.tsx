import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Confirmation" + " | BioLongevity Labs",
  description: "Thank you for your order.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
