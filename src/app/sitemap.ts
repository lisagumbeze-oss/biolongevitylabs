import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { researchPosts } from '@/data/researchPosts';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/research`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/peptide-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/protocol-finder`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${SITE_URL}/resources/peptide-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/wholesale`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/shipping-and-payments`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/refunds`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: new Date(), // Ideally this would be the product's last modified date
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const researchRoutes: MetadataRoute.Sitemap = researchPosts.map((post) => ({
    url: `${SITE_URL}/research/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...researchRoutes];
}
