import type { Metadata } from "next";

export const SITE_URL = "https://biolongevitylabss.com";

/** Build alternates.canonical for a public path (e.g. "/shop"). */
export function canonicalPath(path: string): Metadata["alternates"] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return { canonical: normalized };
}
