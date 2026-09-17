/**
 * Production crawl + section 0/1 evidence writer.
 * Usage: node scripts/seo-inventory.mjs [origin]
 * Writes uncommitted artifacts to .tmp/seo-geo/. Does not invent metrics.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, ".tmp", "seo-geo");
const ORIGIN = (process.argv[2] || "https://www.biolongevitylabss.com").replace(/\/$/, "");
const CANONICAL_HOST = "www.biolongevitylabss.com";
const APEX_HOST = "biolongevitylabss.com";

const PRIVATE_PATHS = [
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/admin",
  "/admin/login",
  "/search",
  "/access-denied",
  "/emails-preview",
];

const NOINDEX_EXPECTED = new Set([
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/admin",
  "/admin/login",
  "/search",
  "/access-denied",
  "/emails-preview",
  "/payment",
]);

function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ").trim();
}

function attr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  const m = tag.match(re);
  return m ? decode(m[1]) : "";
}

function pageType(pathname) {
  if (pathname === "/") return "Homepage";
  if (pathname.startsWith("/product/")) return "Product Page";
  if (pathname.startsWith("/research/")) return "Blog/Article";
  if (pathname.startsWith("/shop")) return "Service Page";
  if (pathname === "/support/faq") return "FAQ";
  if (pathname === "/about") return "Landing Page";
  if (pathname.startsWith("/admin")) return "Admin";
  if (["/cart", "/checkout", "/order-confirmation"].includes(pathname)) return "Checkout";
  return "Landing Page";
}

function csvCell(value) {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function fetchFollow(startUrl, maxHops = 8) {
  const chain = [];
  let current = startUrl;
  let res;
  for (let hop = 0; hop < maxHops; hop += 1) {
    res = await fetch(current, {
      redirect: "manual",
      headers: { "User-Agent": "BioLongevity-SEO-Inventory/1.0" },
    });
    chain.push({ url: current, status: res.status });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) break;
      current = new URL(loc, current).href;
      continue;
    }
    break;
  }
  const html = res && res.status < 300 ? await res.text() : "";
  return { chain, finalUrl: chain.at(-1)?.url || startUrl, status: chain.at(-1)?.status || 0, html, headers: res?.headers };
}

function parseHtml(html, finalUrl) {
  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).replace(/\s+/g, " ").trim();
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  let description = "";
  let robots = "";
  for (const tag of metas) {
    const name = (attr(tag, "name") || attr(tag, "property")).toLowerCase();
    if (name === "description" && !description) description = attr(tag, "content");
    if (name === "robots" && !robots) robots = attr(tag, "content");
  }
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => /rel\s*=\s*["']canonical["']/i.test(tag));
  const canonical = canonicalTag ? attr(canonicalTag, "href") : "";
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || [, ""])[1];
  const wordCount = stripTags(body).split(/\s+/).filter(Boolean).length;
  const ldTypes = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((m) => {
      try {
        const data = JSON.parse(m[1].trim());
        const types = [];
        const walk = (node) => {
          if (!node || typeof node !== "object") return;
          if (node["@type"]) types.push(Array.isArray(node["@type"]) ? node["@type"].join("+") : node["@type"]);
          if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
        };
        walk(data);
        return types;
      } catch {
        return ["INVALID_JSONLD"];
      }
    });
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((href) => href.startsWith("/") || href.startsWith(ORIGIN) || href.includes(APEX_HOST) || href.includes(CANONICAL_HOST));
  let absoluteCanonical = canonical;
  if (canonical && canonical.startsWith("/")) {
    absoluteCanonical = new URL(canonical, finalUrl).href;
  }
  return {
    title,
    description,
    robots,
    canonical: absoluteCanonical,
    h1: h1s[0] || "",
    h1Count: h1s.length,
    wordCount,
    ldTypes,
    links,
  };
}

function pathnameOf(url) {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url;
  }
}

async function mapPool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i;
      i += 1;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`, {
    headers: { "User-Agent": "BioLongevity-SEO-Inventory/1.0" },
  });
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => decode(m[1].trim()));
  const nested = locs.filter((u) => u.endsWith(".xml"));
  const pages = locs.filter((u) => !u.endsWith(".xml"));
  for (const child of nested) {
    const childRes = await fetch(child, { headers: { "User-Agent": "BioLongevity-SEO-Inventory/1.0" } });
    const childXml = await childRes.text();
    pages.push(...[...childXml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => decode(m[1].trim())));
  }
  return [...new Set(pages)];
}

function loadKeywordSeeds() {
  const productsPath = path.join(ROOT, "src", "data", "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
  const researchDir = path.join(ROOT, "src", "data");
  const researchText = fs
    .readdirSync(researchDir)
    .filter((f) => f.startsWith("researchPosts") && f.endsWith(".ts"))
    .map((f) => fs.readFileSync(path.join(researchDir, f), "utf8"))
    .join("\n");
  const posts = [];
  const titleRe = /title:\s*"([^"]+)"/g;
  const slugRe = /slug:\s*"([^"]+)"/g;
  const titles = [...researchText.matchAll(titleRe)].map((m) => m[1]);
  const slugs = [...researchText.matchAll(slugRe)].map((m) => m[1]);
  for (let i = 0; i < Math.min(titles.length, slugs.length); i += 1) {
    posts.push({ title: titles[i], slug: slugs[i] });
  }
  return { products, posts };
}

function inferIntent(pageTypeName, keyword) {
  const k = keyword.toLowerCase();
  if (pageTypeName === "Product Page" || /\b(buy|shop|for sale)\b/.test(k)) return "Transactional";
  if (pageTypeName === "Blog/Article" || /^(what|how|why)\b/.test(k)) return "Informational";
  if (pageTypeName === "FAQ") return "Informational";
  return "Commercial";
}

function writeKeywordMap(products, posts) {
  const rows = [
    ["Keyword", "Volume", "Difficulty", "CPC", "Intent", "Assigned Page URL", "Page Type", "Gap", "Priority", "Evidence"],
  ];
  const seen = new Set();
  const add = (keyword, url, type, gap, priority) => {
    const key = `${keyword}|${url}`;
    if (!keyword || seen.has(key)) return;
    seen.add(key);
    rows.push([
      keyword,
      "",
      "",
      "",
      inferIntent(type, keyword),
      url,
      type,
      gap,
      priority,
      "inferred-from-onsite-copy",
    ]);
  };

  add("research grade peptides", `${ORIGIN}/`, "Homepage", "N", "High");
  add("buy research peptides", `${ORIGIN}/shop`, "Service Page", "N", "High");
  add("bioregulator peptides", `${ORIGIN}/shop/bioregulators`, "Service Page", "N", "High");
  add("peptide reconstitution guide", `${ORIGIN}/peptide-guide`, "Landing Page", "N", "Medium");
  add("research peptide FAQ", `${ORIGIN}/support/faq`, "FAQ", "N", "Medium");

  for (const product of products) {
    const slug = product.slug || product.id;
    add(product.name, `${ORIGIN}/product/${slug}`, "Product Page", "N", product.isBestseller ? "High" : "Medium");
  }
  for (const post of posts) {
    add(post.title, `${ORIGIN}/research/${post.slug}`, "Blog/Article", "N", "Medium");
  }

  const covered = new Set(rows.slice(1).map((r) => r[0].toLowerCase()));
  const gapTopics = [
    ["research peptide COA checklist", `${ORIGIN}/research/how-to-read-peptide-coa`, "Blog/Article"],
    ["BPC-157 vs TB-500 research comparison", `${ORIGIN}/research/bpc-157-vs-tb-500`, "Blog/Article"],
  ];
  for (const [topic, url, type] of gapTopics) {
    if (![...covered].some((k) => k.includes(topic.toLowerCase().slice(0, 18)))) {
      add(topic, url, type, "Y", "Low");
    }
  }

  fs.writeFileSync(path.join(OUT, "keyword_map.csv"), rows.map((r) => r.map(csvCell).join(",")).join("\n"));
  return rows.length - 1;
}

function writeBriefs(posts, products) {
  const dir = path.join(OUT, "content_briefs");
  fs.mkdirSync(dir, { recursive: true });
  const missingCapsule = posts.filter((p) => p && p.slug);
  const samples = [
    {
      file: "peptide-glossary.md",
      title: "Research peptide glossary",
      note: "Not published. Inferred gap only. Requires approval and RUO-safe definitions. Volume unknown.",
    },
    {
      file: "statistics-page.md",
      title: "Industry statistics page",
      note: "Not published. No first-party statistics were collected. Do not invent figures.",
    },
  ];
  for (const sample of samples) {
    fs.writeFileSync(
      path.join(dir, sample.file),
      [
        `TITLE: ${sample.title}`,
        "PRIMARY KEYWORD: null | volume null | difficulty null",
        "SECONDARY KEYWORDS: not assigned",
        "CONTENT TYPE: not approved",
        "INTENT: Informational",
        "TARGET WORD COUNT: not set",
        "ANSWER CAPSULE: Do not draft until a human approves the topic.",
        "SCHEMA TO IMPLEMENT: none until published",
        "CTA: none",
        "",
        sample.note,
        "",
        `Catalog size observed locally: ${products.length} products. Research slugs observed locally: ${missingCapsule.length}.`,
      ].join("\n")
    );
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const collectedAt = new Date().toISOString();
  console.log(`Crawling ${ORIGIN}`);
  const sitemap = await sitemapUrls();
  const seeds = [...sitemap, ...PRIVATE_PATHS.map((p) => `${ORIGIN}${p}`)];
  const uniqueSeeds = [...new Set(seeds)];
  console.log(`Sitemap URLs: ${sitemap.length}. Fetching ${uniqueSeeds.length} seeds.`);

  const crawled = await mapPool(uniqueSeeds, 6, async (url) => {
    try {
      const result = await fetchFollow(url);
      const parsed = result.html ? parseHtml(result.html, result.finalUrl) : {
        title: "", description: "", robots: "", canonical: "", h1: "", h1Count: 0, wordCount: 0, ldTypes: [], links: [],
      };
      const xRobots = result.headers?.get("x-robots-tag") || "";
      return { requested: url, ...result, ...parsed, xRobots, error: "" };
    } catch (err) {
      return {
        requested: url,
        chain: [],
        finalUrl: url,
        status: 0,
        html: "",
        title: "",
        description: "",
        robots: "",
        canonical: "",
        h1: "",
        h1Count: 0,
        wordCount: 0,
        ldTypes: [],
        links: [],
        xRobots: "",
        error: err.message || String(err),
      };
    }
  });

  const sitemapSet = new Set(sitemap.map(pathnameOf));
  const linked = new Set();
  for (const row of crawled) {
    for (const href of row.links || []) {
      try {
        const u = new URL(href, ORIGIN);
        if (u.hostname === CANONICAL_HOST || u.hostname === APEX_HOST) {
          linked.add(u.pathname.replace(/\/$/, "") || "/");
        }
      } catch {
        /* ignore */
      }
    }
  }

  const inventory = crawled.map((row) => {
    const pathName = pathnameOf(row.finalUrl || row.requested);
    const robotsBlob = `${row.robots} ${row.xRobots}`.toLowerCase();
    const noindex = robotsBlob.includes("noindex");
    const canonicalHost = row.canonical ? (() => { try { return new URL(row.canonical).host; } catch { return ""; } })() : "";
    const indexable = row.status === 200 && !noindex;
    return {
      url: row.requested,
      finalUrl: row.finalUrl,
      status: row.status,
      title: row.title,
      description: row.description,
      h1: row.h1,
      h1Count: row.h1Count,
      wordCount: row.wordCount,
      canonical: row.canonical,
      canonicalHost,
      indexability: indexable ? "indexable" : noindex ? "noindex" : `http-${row.status || "error"}`,
      pageType: pageType(pathName),
      robots: row.robots,
      xRobots: row.xRobots,
      ldTypes: row.ldTypes,
      redirectHops: Math.max(0, (row.chain?.length || 1) - 1),
      redirectChain: (row.chain || []).map((c) => `${c.status} ${c.url}`),
      inSitemap: sitemapSet.has(pathnameOf(row.requested)),
      linkedFromCrawl: linked.has(pathName),
      error: row.error,
    };
  });

  const header = ["URL", "Final URL", "HTTP Status", "Title", "Meta Description", "H1", "Word Count", "Canonical", "Indexability", "Page Type"];
  const csv = [header, ...inventory.map((r) => [
    r.url, r.finalUrl, r.status, r.title, r.description, r.h1, r.wordCount, r.canonical, r.indexability, r.pageType,
  ])].map((line) => line.map(csvCell).join(",")).join("\n");
  fs.writeFileSync(path.join(OUT, "crawl_inventory.csv"), csv);

  const errors4xx = inventory.filter((r) => r.status >= 400 && r.status < 500);
  const errors5xx = inventory.filter((r) => r.status >= 500);
  const chains = inventory.filter((r) => r.redirectHops >= 3);
  const loops = inventory.filter((r) => {
    const urls = r.redirectChain.map((c) => c.split(" ").slice(1).join(" "));
    return new Set(urls).size < urls.length;
  });
  const indexableDupes = [];
  const byCanonical = new Map();
  for (const row of inventory.filter((r) => r.indexability === "indexable" && r.canonical)) {
    const list = byCanonical.get(row.canonical) || [];
    list.push(row.url);
    byCanonical.set(row.canonical, list);
  }
  for (const [canonical, urls] of byCanonical) {
    if (urls.length > 1) indexableDupes.push({ canonical, urls });
  }
  const orphans = inventory.filter((r) => r.inSitemap && r.status === 200 && !r.linkedFromCrawl && pathnameOf(r.url) !== "/");
  const missingTitle = inventory.filter((r) => r.status === 200 && r.indexability === "indexable" && !r.title);
  const missingDesc = inventory.filter((r) => r.status === 200 && r.indexability === "indexable" && !r.description);
  const missingH1 = inventory.filter((r) => r.status === 200 && r.indexability === "indexable" && r.h1Count === 0);
  const multiH1 = inventory.filter((r) => r.status === 200 && r.h1Count > 1);
  const apexCanonical = inventory.filter((r) => r.canonicalHost === APEX_HOST);
  const missingBreadcrumb = inventory.filter((r) => {
    const p = pathnameOf(r.finalUrl || r.url);
    const needs = p.startsWith("/product/") || p.startsWith("/research/") || p === "/shop";
    return needs && r.status === 200 && !(r.ldTypes || []).includes("BreadcrumbList");
  });
  const noindexGaps = inventory.filter((r) => NOINDEX_EXPECTED.has(pathnameOf(r.finalUrl || r.url)) && r.indexability === "indexable");
  const sitemapPrivate = sitemap.filter((u) => NOINDEX_EXPECTED.has(pathnameOf(u)));

  const audit = {
    schema_version: "0.1",
    collected_at: collectedAt,
    origin: ORIGIN,
    evidence_type: "observed",
    source: "live-http-crawl",
    counts: {
      fetched: inventory.length,
      sitemap: sitemap.length,
      indexable: inventory.filter((r) => r.indexability === "indexable").length,
      http_4xx: errors4xx.length,
      http_5xx: errors5xx.length,
      redirect_chains_3plus: chains.length,
      redirect_loops: loops.length,
      apex_canonicals: apexCanonical.length,
      missing_title: missingTitle.length,
      missing_description: missingDesc.length,
      missing_h1: missingH1.length,
      multiple_h1: multiH1.length,
      missing_breadcrumb: missingBreadcrumb.length,
      noindex_gaps: noindexGaps.length,
    },
    findings: {
      http_4xx: errors4xx.map((r) => ({ url: r.url, status: r.status, error: r.error })),
      http_5xx: errors5xx.map((r) => ({ url: r.url, status: r.status, error: r.error })),
      redirect_chains: chains.map((r) => ({ url: r.url, hops: r.redirectHops, chain: r.redirectChain })),
      redirect_loops: loops.map((r) => ({ url: r.url, chain: r.redirectChain })),
      indexable_canonical_duplicates: indexableDupes.slice(0, 50),
      orphans_note: "Orphan means a sitemap URL whose path was not found in <a href> on fetched HTML. Shop and research indexes are client-rendered, so product/article links may be absent from the initial HTML even when the catalog is reachable.",
      orphan_sample: orphans.slice(0, 40).map((r) => r.url),
      orphan_count: orphans.length,
      apex_canonical_sample: apexCanonical.slice(0, 30).map((r) => ({ url: r.url, canonical: r.canonical })),
      missing_title: missingTitle.map((r) => r.url),
      missing_description: missingDesc.map((r) => r.url),
      missing_h1: missingH1.map((r) => r.url),
      multiple_h1: multiH1.map((r) => ({ url: r.url, h1Count: r.h1Count })),
      missing_breadcrumb: missingBreadcrumb.map((r) => r.url),
      noindex_gaps: noindexGaps.map((r) => ({ url: r.url, robots: r.robots, indexability: r.indexability })),
      private_urls_in_sitemap: sitemapPrivate,
    },
  };
  fs.writeFileSync(path.join(OUT, "audit_report.json"), JSON.stringify(audit, null, 2));

  const baseline = {
    collected_at: collectedAt,
    origin: ORIGIN,
    evidence_type: "observed",
    google_search_console: { connected: null, sitemap_submitted: null, indexed_pages: null, organic_keyword_count: null, note: "GSC access was not available during this run." },
    ga4: { installed: true, measurement_id: "G-0SF8MTQP01", method: "gtag in src/components/GoogleAnalytics.tsx", sessions: null, conversions: null, note: "Tag presence is observed in source. Traffic metrics were not pulled." },
    bing_webmaster: { connected: null, sitemap_submitted: null },
    domain_authority: null,
    crawled_indexable_pages: inventory.filter((r) => r.indexability === "indexable").length,
    limitations: ["No Search Console, Bing, Ahrefs, or Semrush credentials were used. Missing metrics stay null."],
  };
  fs.writeFileSync(path.join(OUT, "seo_baseline.json"), JSON.stringify(baseline, null, 2));

  const competitor = [
    ["Domain", "Estimated Traffic", "Top Keywords", "Domain Authority", "Evidence"],
    ["www.biolongevitylabss.com", "", "research peptides; BPC-157; TB-500", "", "self-onsite-inferred"],
    ["", "", "", "", "No authorized SERP provider was available. Competitor domains, traffic, and authority were not collected. Names mentioned in on-site research copy (Peptide Sciences, Core Peptides, Limitless Biotech) are not treated as verified SERP competitors and are not assigned domains."],
  ];
  fs.writeFileSync(path.join(OUT, "competitor_report.csv"), competitor.map((r) => r.map(csvCell).join(",")).join("\n"));

  const { products, posts } = loadKeywordSeeds();
  const keywordCount = writeKeywordMap(products, posts);
  writeBriefs(posts, products);

  fs.writeFileSync(path.join(OUT, "crawl_summary.json"), JSON.stringify({
    collected_at: collectedAt,
    origin: ORIGIN,
    sitemap: sitemap.length,
    fetched: inventory.length,
    keyword_rows: keywordCount,
    counts: audit.counts,
  }, null, 2));

  console.log(JSON.stringify(audit.counts, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
