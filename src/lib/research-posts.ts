import { researchPosts } from "@/data/researchPosts";
import type { BlogPost } from "@/data/researchPostTypes";

/** Merge static research articles with dynamic posts; static wins on slug collision. */
export function mergeResearchPosts(dynamicPosts: BlogPost[]): BlogPost[] {
  const dynamic = Array.isArray(dynamicPosts) ? dynamicPosts : [];
  const staticSlugs = new Set(researchPosts.map((p) => p.slug));
  const filtered = dynamic.filter((p) => p?.slug && !staticSlugs.has(p.slug));
  return [...filtered, ...researchPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getResearchPostBySlug(slug: string, dynamicPosts: BlogPost[] = []): BlogPost | undefined {
  return mergeResearchPosts(dynamicPosts).find((p) => p.slug === slug);
}
