import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dynamic Research Post" + " | BioLongevity Labs",
  description: "Research article from BioLongevity Labs",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
