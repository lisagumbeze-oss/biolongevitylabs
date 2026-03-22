# Support Page SEO Optimization Report (With Skill)

### Proposed Metadata for `src/app/support/page.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Research Support | BioLongevity Labs',
  description: 'Need help with your research compound order? Contact BioLongevity Labs for dedicated peptide research support, FAQs, and scientific inquiries.',
  keywords: ['peptide research support', 'BLL support', 'research compound help', 'peptide customer service'],
  openGraph: {
    title: 'Peptide Research Support | BioLongevity Labs',
    description: 'Expert support for your peptide research and bioregulator needs. Contact us for order help or scientific inquiries.',
    url: 'https://biolongevitylabss.com/support',
    siteName: 'BioLongevity Labs',
    images: [
      {
        url: 'https://biolongevitylabss.com/logo.webp',
        width: 1200,
        height: 630,
        alt: 'BioLongevity Labs Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Peptide Research Support | BioLongevity Labs',
    description: 'Need help with your research? Contact our dedicated support team.',
    images: ['https://biolongevitylabss.com/logo.webp'],
  },
};
```

### Rationale:
- Optimized title with primary keyword front-loaded.
- Complete OG and Twitter metadata for social trust.
- Strategic keyword integration.
