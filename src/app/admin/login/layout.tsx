import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Login" + " | BioLongevity Labs",
  description: "Login to the BioLongevity Labs admin dashboard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
