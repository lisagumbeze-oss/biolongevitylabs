/**
 * Fix 6 bundle products: prices + images in Supabase and products.json
 * Run: node scripts/fix_bundle_products.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envFile = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const PRODUCTS_JSON = path.join("src", "data", "products.json");

const OPTIMOLE =
  "https://mlavgymrtxzc.i.optimole.com/cb:572_.56b/w:auto/h:auto/q:mauto/f:best/https://biolongevitylabs.com/wp-content/uploads/";

const FIXES = [
  {
    id: "prod_20948",
    price: 395.91,
    image: `${OPTIMOLE}2025/04/BC-bundle-small-1.jpg`,
    minPrice: 395.91,
    maxPrice: 395.91,
  },
  {
    id: "prod_44436",
    price: 449.97,
    image: `${OPTIMOLE}2025/06/M-bundle-sq-2.jpg`,
    minPrice: 449.97,
    maxPrice: 449.97,
  },
  {
    id: "prod_15365",
    price: 489.85,
    image: `${OPTIMOLE}2025/02/BR-Bundle-Anti-Aging-R-1.png`,
    minPrice: 489.85,
    maxPrice: 489.85,
  },
  {
    id: "prod_15359",
    price: 379.88,
    image: `${OPTIMOLE}2025/02/BR-Bundles-Eye-Health.png`,
    minPrice: 379.88,
    maxPrice: 379.88,
  },
  {
    id: "prod_15321",
    price: 474.88,
    image: `${OPTIMOLE}2025/02/Cardiovascular-Heart-Health.jpg`,
    minPrice: 474.88,
    maxPrice: 474.88,
  },
  {
    id: "prod_219498",
    price: 199.97,
    image: `${OPTIMOLE}2026/05/445575f0-4d6e-4c88-8498-4ad7f44ed366.jpg`,
    minPrice: 199.97,
    maxPrice: 199.97,
  },
];

function updateLocalJson() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, "utf8"));
  let updated = 0;
  for (const fix of FIXES) {
    const idx = products.findIndex((p) => p.id === fix.id);
    if (idx === -1) {
      console.log(`  [json] ${fix.id} not in products.json — skip`);
      continue;
    }
    products[idx].price = fix.price;
    products[idx].minPrice = fix.minPrice;
    products[idx].maxPrice = fix.maxPrice;
    products[idx].image = fix.image;
    updated++;
    console.log(`  [json] ${fix.id} → $${fix.price}`);
  }
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4));
  console.log(`Updated ${updated} products in products.json`);
}

async function updateSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.log("No Supabase credentials — skipped DB update");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);
  for (const fix of FIXES) {
    const { error } = await supabase
      .from("products")
      .update({
        price: fix.price,
        min_price: fix.minPrice,
        max_price: fix.maxPrice,
        image_url: fix.image,
      })
      .eq("id", fix.id);
    if (error) {
      console.error(`  [db] ${fix.id} ERROR:`, error.message);
    } else {
      console.log(`  [db] ${fix.id} → $${fix.price}`);
    }
  }
}

updateLocalJson();
await updateSupabase();
console.log("Done.");
