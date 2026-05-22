import { MetadataRoute } from "next";
import { SITE_URL, SOCIAL_CRAWLER_AGENTS } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const sharedDisallow = [
    "/admin/",
    "/api/",
    "/cart",
    "/checkout",
    "/payment/",
    "/search",
    "/emails-preview",
    "/access-denied",
  ];

  const defaultRule = {
    allow: "/" as const,
    disallow: sharedDisallow,
  };

  return {
    rules: [
      { userAgent: "*", ...defaultRule },
      ...SOCIAL_CRAWLER_AGENTS.map((userAgent) => ({
        userAgent,
        ...defaultRule,
      })),
      { userAgent: "GPTBot", ...defaultRule },
      { userAgent: "ClaudeBot", ...defaultRule },
      { userAgent: "PerplexityBot", ...defaultRule },
      { userAgent: "Google-Extended", ...defaultRule },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
