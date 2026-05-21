import fs from "fs";
import path from "path";
import { researchPosts } from "@/data/researchPosts";
import type { BlogPost } from "@/data/researchPostTypes";
import { supabase } from "@/lib/supabase";

const POSTS_JSON = path.join(process.cwd(), "src/data/posts.json");

function readPostsLocal(): BlogPost[] {
  if (!fs.existsSync(POSTS_JSON)) return [];
  try {
    return JSON.parse(fs.readFileSync(POSTS_JSON, "utf-8")) as BlogPost[];
  } catch {
    return [];
  }
}

function isMissingPostsTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}

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

/** All published research articles (static catalog + DB/JSON when available). */
export async function getPublishedResearchPosts(): Promise<BlogPost[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      return mergeResearchPosts(Array.isArray(data) ? data : []);
    }

    if (!isMissingPostsTable(error)) {
      console.warn("[research-posts] Supabase posts query failed:", error?.message);
    }
  }

  return mergeResearchPosts(readPostsLocal());
}
