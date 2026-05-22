/** Canonical production host (www). Apex redirects here for crawlers and users. */
export const SITE_HOST = "www.biolongevitylabss.com";
export const SITE_URL = `https://${SITE_HOST}`;

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "BioLongevity Labs - Premium Research Compounds",
} as const;

/** User-agents that fetch link previews (Facebook, X, LinkedIn, etc.). */
export const SOCIAL_CRAWLER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "facebookcatalog",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "WhatsApp",
  "TelegramBot",
  "Pinterest",
  "Googlebot",
] as const;

export function isSocialCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}
