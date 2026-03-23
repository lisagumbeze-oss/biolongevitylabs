import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support',
  description: 'Contact BioLongevity Labs support team. We are here to help with your research compound order or scientific inquiries.',
  openGraph: {
    title: 'Contact Support | BioLongevity Labs',
    description: 'Contact BioLongevity Labs support team for assistance with your research orders.',
    url: 'https://biolongevitylabss.com/support',
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
