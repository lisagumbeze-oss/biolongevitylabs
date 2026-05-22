import { readFileSync } from "fs";

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

function valuesMatch(attr, sel) {
  if (!attr || !sel) return false;
  if (attr === sel) return true;
  if (normalizeVariationValue(attr) === normalizeVariationValue(sel)) return true;
  return variationOptionKey(attr) === variationOptionKey(sel);
}

function getAttr(attrs, name) {
  const key = Object.keys(attrs).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(attrs[key] ?? "") : "";
}

function findVar(product, variableName, opt) {
  return (product.variations || []).find((v) =>
    valuesMatch(getAttr(v.attributes, variableName), opt)
  );
}

const products = JSON.parse(readFileSync("src/data/products.json", "utf-8"));
let fail = 0;
let duplicatePrices = 0;
const samples = [];

for (const p of products) {
  if (!p.isVariable || !p.variations?.length) continue;
  for (const v of p.variables || []) {
    const seen = new Map();
    for (const opt of v.options || []) {
      const match = findVar(p, v.name, opt);
      if (!match) {
        fail++;
        samples.push({ id: p.id, opt, attrs: p.variations.map((x) => getAttr(x.attributes, v.name)) });
      } else {
        const key = variationOptionKey(opt);
        if (seen.has(key) && seen.get(key) !== match.price) duplicatePrices++;
        seen.set(key, match.price);
      }
    }
  }
}

const privateProd = products.find((p) => p.id === "prod_153676");
const opts = privateProd?.variables?.[0]?.options || [];
const prices = opts.map((o) => findVar(privateProd, "Quantity", o)?.price);

console.log(
  JSON.stringify(
    {
      unmatchedOptions: fail,
      prod_153676_prices: prices,
      failSamples: samples.slice(0, 5),
    },
    null,
    2
  )
);
