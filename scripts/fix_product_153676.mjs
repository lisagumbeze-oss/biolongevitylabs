/**
 * Fixes prod_153676 in Supabase: pair-only quantity options and tiered variation prices.
 * Run: node scripts/fix_product_153676.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

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
if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const PRODUCT_ID = "prod_153676";

const PAIR_OPTIONS = [
    "3 Pairs (6 Vials)",
    "6 Pairs (12 Vials) - Save 5%",
    "12 Pairs (24 Vials) - Save 10%",
    "18 Pairs (36 Vials) - Save 15%",
    "24 Pairs (48 Vials) - Save 20%",
    "48 Pairs (96 Vials) - Save 25%",
];

const VARIATION_PRICES = {
    "3-pairs": 2397,
    "6-pairs": 4794,
    "12-pairs": 9588,
    "18-pairs": 14382,
    "24-pairs": 19176,
    "48-pairs": 28764,
};

async function run() {
    console.log("Updating product row…");
    const { error: pErr } = await supabase
        .from("products")
        .update({
            name: "Follistatin (FLGR242) (10mg) (Private)",
            min_price: 2397,
            max_price: 28764,
            is_variable: true,
            stock_status: "In Stock",
        })
        .eq("id", PRODUCT_ID);

    if (pErr) throw pErr;

    console.log("Updating quantity variable options…");
    const { error: vErr } = await supabase
        .from("product_variables")
        .update({ options: PAIR_OPTIONS })
        .eq("product_id", PRODUCT_ID)
        .eq("name", "Quantity");

    if (vErr) throw vErr;

    const { data: variations, error: listErr } = await supabase
        .from("product_variations")
        .select("id, attributes")
        .eq("product_id", PRODUCT_ID);

    if (listErr) throw listErr;

    for (const v of variations || []) {
        const slug = v.attributes?.Quantity;
        const price = VARIATION_PRICES[slug];
        if (price == null) continue;
        const { error } = await supabase
            .from("product_variations")
            .update({ price, stock_status: "In Stock" })
            .eq("id", v.id);
        if (error) throw error;
        console.log(`  ${slug} → $${price}`);
    }

    console.log("Done.");
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
