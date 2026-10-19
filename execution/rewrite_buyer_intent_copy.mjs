/**
 * Rewrite product names + descriptions with rotating USA/state buyer-intent phrases.
 * Updates src/data/products.json and Supabase products table.
 *
 * Usage: node execution/rewrite_buyer_intent_copy.mjs [--dry-run]
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const PRODUCTS_JSON = resolve("src/data/products.json");

const LOCATIONS = [
  "USA",
  "California",
  "Texas",
  "Florida",
  "New York",
  "Illinois",
  "Arizona",
  "Ohio",
  "Georgia",
  "Pennsylvania",
  "Washington",
  "Colorado",
  "Michigan",
  "North Carolina",
  "Massachusetts",
];

const NAME_SUFFIXES = [
  (loc) => `How to Buy in ${loc}`,
  (loc) => `Where to Buy in ${loc}`,
  (loc) => `How Much in ${loc}`,
];

const STATE_TRIPLES = [
  ["California", "Texas", "Florida"],
  ["New York", "Illinois", "Arizona"],
  ["Ohio", "Georgia", "Pennsylvania"],
  ["Washington", "Colorado", "Michigan"],
  ["North Carolina", "Massachusetts", "Texas"],
  ["California", "Florida", "New York"],
  ["Illinois", "Arizona", "Ohio"],
  ["Georgia", "Washington", "Colorado"],
];

const EXTRA_STATES = [
  ["New York", "Illinois", "Arizona"],
  ["California", "Texas", "Florida"],
  ["Pennsylvania", "Michigan", "Ohio"],
  ["Colorado", "Washington", "Georgia"],
  ["Massachusetts", "North Carolina", "Arizona"],
];

const BUYER_SUFFIX_RE =
  /\s*[—–-]\s*(How to Buy|Where to Buy|How Much) in [A-Za-z ]+$/i;

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* optional */
  }
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function baseName(name) {
  return String(name || "").replace(BUYER_SUFFIX_RE, "").trim();
}

function shortLabel(name) {
  // Prefer compound before dose/paren clutter for natural questions
  const base = baseName(name);
  const withoutPrivate = base.replace(/\s*\(Private\)\s*/i, " ").trim();
  return withoutPrivate;
}

function extractFactSentence(description, label) {
  const plain = stripHtml(description);
  if (!plain) {
    return `${label} is a research-grade catalog SKU for qualified laboratory use.`;
  }
  // Drop sentences that are already buyer-intent rewrites
  const cleaned = plain
    .replace(/Looking for where can i buy[\s\S]*?\?/gi, " ")
    .replace(/How to buy[\s\S]*?:/gi, " ")
    .replace(/How much for[\s\S]*?\?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && !/research use only/i.test(s));
  if (sentences[0]) {
    return sentences[0].length > 280
      ? sentences[0].slice(0, 277).replace(/\s+\S*$/, "") + "."
      : sentences[0];
  }
  return `${label} is supplied as research-grade material for qualified laboratory workflows.`;
}

function buildName(product, index) {
  const base = baseName(product.name);
  const loc = LOCATIONS[index % LOCATIONS.length];
  const suffixFn = NAME_SUFFIXES[index % NAME_SUFFIXES.length];
  return `${base} — ${suffixFn(loc)}`;
}

function buildDescription(product, index) {
  const label = shortLabel(product.name);
  const fact = extractFactSentence(product.description, label);
  const triple = STATE_TRIPLES[index % STATE_TRIPLES.length];
  const extras = EXTRA_STATES[index % EXTRA_STATES.length];
  const locPrimary = LOCATIONS[index % LOCATIONS.length];

  const p1 = `Looking for <strong>where can I buy ${label} in USA</strong>? BioLongevity Labs lists this research SKU for qualified laboratory use, with fulfillment across the United States. ${fact}`;

  const p2 = `<strong>How to buy ${label} in ${triple[0]}, ${triple[1]}, or ${triple[2]}:</strong> choose your option on this page, complete research-use-only checkout, and we ship to research buyers nationwide. Labs in ${extras[0]}, ${extras[1]}, and ${extras[2]} use the same catalog flow.`;

  const p3 = `<strong>How much for ${label} in ${locPrimary === "USA" ? "USA" : locPrimary}?</strong> Pricing is listed on this page and updates with batch availability—compare options before you order. For research use only. Not for human consumption. Review the COA on the product page before procurement.`;

  return [
    `<p class="whitespace-normal break-words">${p1}</p>`,
    `<p class="whitespace-normal break-words">${p2}</p>`,
    `<p class="whitespace-normal break-words">${p3}</p>`,
  ].join("");
}

/** Keep the approved sample SKU suffix stable across re-runs. */
const PINNED = {
  prod_105727: {
    name: "Regeno Blend (BPC-157, TB-500, Cartalax) 30mg — How to Buy in USA",
    description: [
      '<p class="whitespace-normal break-words">Looking for <strong>where can I buy Regeno Blend in USA</strong>? BioLongevity Labs supplies this research-grade BPC-157, TB-500, and Cartalax blend (10mg each, 30mg total) for qualified laboratory use, with fulfillment across the United States.</p>',
      '<p class="whitespace-normal break-words"><strong>How to buy Regeno Blend in California, Texas, or Florida:</strong> choose your vial option, complete checkout, and we ship to research buyers nationwide. Institutional and independent labs in New York, Illinois, and Arizona use the same catalog flow.</p>',
      '<p class="whitespace-normal break-words"><strong>How much for Regeno Blend in USA?</strong> Pricing is listed on this page and updates with batch availability—compare options before you order. For research use only. Not for human consumption. Review the COA on the product page before procurement.</p>',
    ].join(""),
  },
};

function rewriteProduct(product, index) {
  const pinned = PINNED[product.id];
  if (pinned) {
    return { ...product, ...pinned };
  }
  return {
    ...product,
    name: buildName(product, index),
    description: buildDescription(product, index),
  };
}

loadEnvLocal();

const products = JSON.parse(readFileSync(PRODUCTS_JSON, "utf8"));
if (!Array.isArray(products) || products.length === 0) {
  console.error("No products found in", PRODUCTS_JSON);
  process.exit(1);
}

const rewritten = products.map((p, i) => rewriteProduct(p, i));

console.log(`Prepared ${rewritten.length} products`);
console.log("Sample:", rewritten[0].name);
console.log("Regeno:", rewritten.find((p) => p.id === "prod_105727")?.name);

if (DRY_RUN) {
  console.log("Dry run — no files or Supabase writes.");
  process.exit(0);
}

writeFileSync(PRODUCTS_JSON, JSON.stringify(rewritten, null, 4) + "\n", "utf8");
console.log("Wrote", PRODUCTS_JSON);

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.warn("Supabase env missing — JSON updated only.");
  process.exit(0);
}

const supabase = createClient(url, key);
let ok = 0;
let fail = 0;
for (const p of rewritten) {
  const { error } = await supabase
    .from("products")
    .update({ name: p.name, description: p.description })
    .eq("id", p.id);
  if (error) {
    fail += 1;
    console.error("Fail", p.id, error.message);
  } else {
    ok += 1;
  }
}
console.log(`Supabase updated: ${ok} ok, ${fail} failed`);
