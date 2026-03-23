import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research & Knowledge Base',
  description: 'Explore research-backed articles on peptide mechanisms, bioregulator applications, and laboratory protocols for scientists conducting in vitro studies.',
  openGraph: {
    title: 'Research & Knowledge Base | BioLongevity Labs',
    description: 'Explore research-backed articles on peptide mechanisms, bioregulator applications, and laboratory protocols for scientists conducting in vitro studies.',
    url: 'https://biolongevitylabss.com/research',
    siteName: 'BioLongevity Labs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Knowledge Base | BioLongevity Labs',
    description: 'Explore research-backed articles on peptide mechanisms and laboratory protocols.',
  },
};

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
