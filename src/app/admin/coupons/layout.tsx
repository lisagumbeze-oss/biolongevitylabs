import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Coupons" + " | BioLongevity Labs",
  description: "Admin coupon management.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
