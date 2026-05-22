/**
 * Align variable product options with catalog variations and sync prices to Supabase.
 * Run: node scripts/normalize_variable_products.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";

const PRODUCTS_JSON = "src/data/products.json";

function normalizeVariationValue(val) {
  if (!val) return "";
  return String(val)
    .toLowerCase()
    .split(/\s+[-–]\s+/)[0]
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function variationOptionKey(val) {
  const n = normalizeVariationValue(val);
  if (!n) return "";
  const numMatch = n.match(/^(\d+)/);
  if (!numMatch) return n;
  const num = numMatch[1];
  if (/pai|pair/.test(n)) return `${num}-pair`;
  if (/month/.test(n)) return `${num}-month`;
  if (/vial/.test(n) && !/pai|pair/.test(n)) return `${num}-vial`;
  if (/mg|mcg|iu|tab|capsule|dose/.test(n)) return n;
  const rest = n.slice(num.length).replace(/^-+/, "").split("-")[0];
  if (rest) {
    const base = rest.replace(/s$/, "").replace(/-?new$/, "");
    return `${num}-${base}`;
  }
  return n;
}

function getAttr(attrs, name) {
  const key = Object.keys(attrs).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(attrs[key] ?? "") : "";
}

function valuesMatch(attr, sel) {
  if (!attr || !sel) return false;
  if (attr === sel) return true;
  if (normalizeVariationValue(attr) === normalizeVariationValue(sel)) return true;
  return variationOptionKey(attr) === variationOptionKey(sel);
}

function findVariation(product, variableName, optionLabel) {
  return (product.variations || []).find((v) =>
    valuesMatch(getAttr(v.attributes, variableName), optionLabel)
  );
}

/** Prefer existing human label; otherwise build from attribute slug */
function labelForVariation(attrSlug, existingOptions) {
  const key = variationOptionKey(attrSlug);
  const hit = existingOptions.find((o) => variationOptionKey(o) === key);
  if (hit) return hit;

  const m = attrSlug.match(/^(\d+)-?(pair|pairs|month|vial)/i);
  if (m) {
    const n = m[1];
    const unit = m[2].toLowerCase();
    if (unit.startsWith("pair")) {
      const vials = Number(n) * 2;
      return `${n} Pair${n === "1" ? "" : "s"} (${vials} Vial${vials === 1 ? "" : "s"})`;
    }
    if (unit === "month") return `${n} Month Supply`;
  }
  return attrSlug.replace(/-/g, " ");
}

function loadEnv() {
  try {
    const envFile = readFileSync(".env.local", "utf8");
    return Object.fromEntries(
      envFile
        .split("\n")
        .filter((line) => line.includes("=") && !line.startsWith("#"))
        .map((line) => {
          const [key, ...rest] = line.split("=");
          return [key.trim(), rest.join("=").trim()];
        })
    );
  } catch {
    return {};
  }
}

const products = JSON.parse(readFileSync(PRODUCTS_JSON, "utf8"));
let optionsFixed = 0;

for (const p of products) {
  if (!p.isVariable || !p.variations?.length || !p.variables?.length) continue;

  for (const variable of p.variables) {
    const existing = variable.options || [];
    const rebuilt = [];

    for (const v of p.variations) {
      const slug = getAttr(v.attributes, variable.name);
      if (!slug) continue;
      const label = labelForVariation(slug, existing);
      if (!rebuilt.some((l) => variationOptionKey(l) === variationOptionKey(label))) {
        rebuilt.push(label);
      }
    }

    rebuilt.sort((a, b) => {
      const na = parseInt(variationOptionKey(a), 10) || 0;
      const nb = parseInt(variationOptionKey(b), 10) || 0;
      return na - nb;
    });

    if (JSON.stringify(rebuilt) !== JSON.stringify(existing)) {
      variable.options = rebuilt;
      optionsFixed++;
    }
  }

  const prices = p.variations.map((v) => Number(v.price)).filter((n) => n > 0);
  if (prices.length) {
    p.minPrice = Math.min(...prices);
    p.maxPrice = Math.max(...prices);
    p.price = Math.min(...prices);
  }
}

writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4) + "\n");
console.log(`Updated products.json (${optionsFixed} variable option lists rebuilt)`);

const env = loadEnv();
const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Skipping Supabase sync (no credentials in .env.local)");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);
let varUpdates = 0;
let prodUpdates = 0;

for (const p of products) {
  if (!p.isVariable || !p.variations?.length) continue;

  const { error: pErr } = await supabase
    .from("products")
    .update({
      price: p.price,
      min_price: p.minPrice ?? null,
      max_price: p.maxPrice ?? null,
      is_variable: true,
    })
    .eq("id", p.id);

  if (pErr) {
    console.warn(`Product ${p.id}:`, pErr.message);
    continue;
  }
  prodUpdates++;

  for (const variable of p.variables || []) {
    await supabase
      .from("product_variables")
      .upsert(
        { product_id: p.id, name: variable.name, options: variable.options },
        { onConflict: "product_id,name" }
      );
  }

  for (const v of p.variations) {
    const { error } = await supabase
      .from("product_variations")
      .upsert(
        {
          id: v.id,
          product_id: p.id,
          attributes: v.attributes,
          price: v.price,
          stock_status: v.stockStatus || "In Stock",
        },
        { onConflict: "id" }
      );
    if (!error) varUpdates++;
    else console.warn(`Variation ${v.id}:`, error.message);
  }
}

console.log(`Supabase: ${prodUpdates} products, ${varUpdates} variations synced`);
