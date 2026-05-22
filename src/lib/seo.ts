import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export { SITE_URL };

/** Build alternates.canonical for a public path (e.g. "/shop"). */
export function canonicalPath(path: string): Metadata["alternates"] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return { canonical: `${SITE_URL}${normalized}` };
}
