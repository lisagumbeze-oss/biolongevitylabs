import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Access Denied" + " | BioLongevity Labs",
  description: "You do not have permission to view this page.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
