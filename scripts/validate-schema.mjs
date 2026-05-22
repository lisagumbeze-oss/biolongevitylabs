/**
 * Fetches public routes and validates all application/ld+json blocks parse as JSON.
 * Usage: node scripts/validate-schema.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/shop",
  "/about",
  "/research",
  "/support/faq",
  "/shop/bioregulators",
  "/protocol-finder",
];

const LD_JSON_RE =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

async function validateRoute(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "BioLongevity-SEO-Validator/1.0" },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`${path}: HTTP ${res.status}`);
  }

  const html = await res.text();
  const blocks = [...html.matchAll(LD_JSON_RE)];

  if (blocks.length === 0) {
    console.warn(`  ${path}: no JSON-LD blocks found (warn only)`);
    return { path, count: 0 };
  }

  blocks.forEach((match, i) => {
    const raw = match[1].trim();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error(`${path}: JSON-LD block ${i + 1} invalid — ${e.message}`);
    }
    if (!data["@context"] && !data["@graph"]) {
      throw new Error(`${path}: JSON-LD block ${i + 1} missing @context`);
    }
  });

  return { path, count: blocks.length };
}

async function main() {
  console.log(`Validating JSON-LD at ${base}\n`);
  let total = 0;
  for (const route of ROUTES) {
    const result = await validateRoute(route);
    total += result.count;
    console.log(`  ✓ ${route} (${result.count} block(s))`);
  }
  console.log(`\nOK — ${ROUTES.length} routes, ${total} JSON-LD block(s) parsed.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
