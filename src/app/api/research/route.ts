import { NextResponse } from "next/server";
import { getPublishedResearchPosts } from "@/lib/research-posts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getPublishedResearchPosts();
    return NextResponse.json(posts);
  } catch (error: unknown) {
    console.error("[API research] Failed:", error);
    const { mergeResearchPosts } = await import("@/lib/research-posts");
    return NextResponse.json(mergeResearchPosts([]));
  }
}
