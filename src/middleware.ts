import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_HOST } from "@/lib/site";

const APEX_HOST = "biolongevitylabss.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";

  // Always serve the canonical www host (Facebook and other crawlers scrape apex and can fail on redirects).
  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = SITE_HOST;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
