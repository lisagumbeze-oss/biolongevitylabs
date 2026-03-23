import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Settings" + " | BioLongevity Labs",
  description: "Admin settings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
