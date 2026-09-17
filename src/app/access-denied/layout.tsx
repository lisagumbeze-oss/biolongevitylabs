import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: "Access Denied" + " | BioLongevity Labs",
  description: "You do not have permission to view this page.",
  robots: { index: false, follow: false },
  openGraph: {
    url: `${SITE_URL}/access-denied`,
    siteName: "BioLongevity Labs",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
