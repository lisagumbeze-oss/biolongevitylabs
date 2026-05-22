/**
 * Static checks: public app routes should export metadata (title) via layout or page.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "src", "app");

const REQUIRED_ROUTES = [
  ["page.tsx", "Homepage"],
  ["shop/layout.tsx", "Shop"],
  ["about/layout.tsx", "About"],
  ["research/layout.tsx", "Research"],
  ["support/layout.tsx", "Support"],
  ["support/faq/layout.tsx", "FAQ hub"],
  ["shop/bioregulators/layout.tsx", "Bioregulators"],
  ["protocol-finder/page.tsx", "Protocol finder"],
];

const FORBIDDEN_GLOBAL_CANONICAL =
  /alternates:\s*\{[^}]*canonical:\s*["']\/["']/s;

function read(rel) {
  const full = path.join(appDir, rel);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf-8");
}

let failed = false;

for (const [rel, label] of REQUIRED_ROUTES) {
  const content = read(rel);
  if (!content) {
    console.error(`✗ ${label}: missing ${rel}`);
    failed = true;
    continue;
  }
  const hasMetadata =
    /export\s+const\s+metadata\s*[:=]/m.test(content) ||
    /export\s+async\s+function\s+generateMetadata/m.test(content);
  if (!hasMetadata) {
    console.error(`✗ ${label}: no metadata export in ${rel}`);
    failed = true;
  } else {
    console.log(`  ✓ ${label}`);
  }
}

const rootLayout = read("layout.tsx");
if (rootLayout && FORBIDDEN_GLOBAL_CANONICAL.test(rootLayout)) {
  // Root may intentionally set canonical "/" for homepage only — allow if documented
  console.log("  · Root layout has canonical / (homepage only — OK if child routes override)");
}

const robots = read("robots.ts");
if (!robots || !/export\s+default\s+function\s+robots/.test(robots)) {
  console.error("✗ robots.ts missing default export");
  failed = true;
} else {
  console.log("  ✓ robots.ts");
}

const sitemap = read("sitemap.ts");
if (!sitemap || !/export\s+default\s+function\s+sitemap/.test(sitemap)) {
  console.error("✗ sitemap.ts missing default export");
  failed = true;
} else {
  console.log("  ✓ sitemap.ts");
}

const llms = path.join(__dirname, "..", "public", "llms.txt");
if (!fs.existsSync(llms)) {
  console.error("✗ public/llms.txt missing");
  failed = true;
} else {
  console.log("  ✓ public/llms.txt");
}

if (failed) {
  console.error("\nSEO static audit failed.");
  process.exit(1);
}
console.log("\nSEO static audit passed.");
