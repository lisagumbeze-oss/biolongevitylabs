import { Metadata } from 'next';
import { researchPosts } from '@/data/researchPosts';
import { canonicalPath } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = researchPosts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | BioLongevity Labs',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: canonicalPath(`/research/${slug}`),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://biolongevitylabss.com/research/${post.slug}`,
      siteName: 'BioLongevity Labs',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
