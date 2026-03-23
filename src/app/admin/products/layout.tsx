import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Products" + " | BioLongevity Labs",
  description: "Admin product management.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
