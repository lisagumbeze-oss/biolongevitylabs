import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Orders" + " | BioLongevity Labs",
  description: "Admin order management.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
