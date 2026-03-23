import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about BioLongevity Labs and our mission to provide the highest-purity, research-grade peptides and bioregulators manufactured in US facilities.',
  openGraph: {
    title: 'About Us | BioLongevity Labs',
    description: 'Learn about BioLongevity Labs and our mission to provide the highest-purity, research-grade peptides and bioregulators manufactured in US facilities.',
    url: 'https://biolongevitylabss.com/about',
    siteName: 'BioLongevity Labs',
    images: [
      {
        url: 'https://biolongevitylabss.com/wp-content/uploads/2024/12/Bg1-ABOUT-US.jpg',
        width: 1200,
        height: 630,
        alt: 'BioLongevity Labs Research Facilities',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | BioLongevity Labs',
    description: 'Learn about BioLongevity Labs and our mission to provide the highest-purity, research-grade peptides.',
    images: ['https://biolongevitylabss.com/wp-content/uploads/2024/12/Bg1-ABOUT-US.jpg'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
