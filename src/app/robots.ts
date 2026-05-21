import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const sharedDisallow = ['/admin/', '/api/', '/cart', '/checkout', '/payment/', '/search', '/emails-preview', '/access-denied'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: sharedDisallow,
      },
      { userAgent: 'GPTBot', allow: '/', disallow: sharedDisallow },
      { userAgent: 'ClaudeBot', allow: '/', disallow: sharedDisallow },
      { userAgent: 'PerplexityBot', allow: '/', disallow: sharedDisallow },
      { userAgent: 'Google-Extended', allow: '/', disallow: sharedDisallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
