#!/usr/bin/env node
/**
 * Build admin-import CSV + sourcing queue from ZYBIO gap report.
 *
 * Usage:
 *   node execution/build_zybio_import.mjs
 *
 * Outputs:
 *   public/imports/zybio_missing_products.csv
 *   .tmp/product_asset_queue.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gapPath = path.join(root, '.tmp', 'zybio_gap_report.json');
const outDir = path.join(root, 'public', 'imports');
const csvPath = path.join(outDir, 'zybio_missing_products.csv');
const queuePath = path.join(root, '.tmp', 'product_asset_queue.json');

if (!fs.existsSync(gapPath)) {
  console.error('Missing .tmp/zybio_gap_report.json — run compare_zybio.mjs first');
  process.exit(1);
}

const gap = JSON.parse(fs.readFileSync(gapPath, 'utf8'));

const RUO =
  'For laboratory research use only (RUO)—not for human or veterinary consumption, diagnosis, or treatment.';

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function retailFromKit(kitPrice) {
  const perVial = Number(kitPrice) / 10;
  const retail = Math.max(perVial * 5.5, 29.97);
  return Math.round(retail) - 0.03; // x.97 style
}

function classify(item) {
  const n = item.name.toLowerCase();
  if (n.includes('capsule') || n.includes('orforglipron') || n.includes('tesofensine') || n.includes('bam15 +')) {
    return { category: 'Peptide Capsules', form: 'Capsule' };
  }
  if (n.includes('bac water') || n.includes('acetic acid')) {
    return { category: 'Peptide Vials', form: 'Solution' };
  }
  if (n.includes('cream') || n.includes('lemon bottle') || n.includes('lipo-c') || n.includes('lc526')) {
    return { category: 'Peptide Vials', form: 'Solution' };
  }
  return { category: 'Peptide Vials', form: 'Vial' };
}

function primarySpec(specs = []) {
  // Prefer a common mid strength when multiple
  const preferred = ['10mg', '5mg', '20mg', '2mg', '50mg', '1mg'];
  for (const p of preferred) {
    if (specs.some((s) => String(s).toLowerCase() === p.toLowerCase())) return p;
  }
  return specs[0] || '';
}

function displayName(item) {
  const spec = primarySpec(item.specs);
  const base = item.name
    .replace(/\s*\(capsule\)/i, '')
    .replace(/\s*\/\s*/g, ' / ')
    .trim();
  if (!spec) return base;
  if (/\d+\s*(mg|mcg|iu|ml)/i.test(base)) return base;
  // Capsule pack sizes stay as-is in variations
  if (/capsule/i.test(item.name) || String(spec).includes('*')) {
    return base;
  }
  return `${base} (${spec})`;
}

function stubDescription(name) {
  return `<p>Research-grade ${name} supplied for controlled laboratory and analytical use. Each batch is intended for identity, purity, and assay development workflows under institutional SOPs.</p><p>${RUO}</p>`;
}

function buildVariations(item) {
  const specs = item.specs || [];
  const prices = Array.isArray(item.kitPriceUsd) ? item.kitPriceUsd : [item.kitPriceUsd];
  if (specs.length <= 1) return { price: retailFromKit(prices[0] || 100), variations: '[]' };

  const vars = specs.map((spec, i) => ({
    option: String(spec),
    price: retailFromKit(prices[Math.min(i, prices.length - 1)] || prices[0]),
  }));
  return {
    price: vars[0].price,
    variations: JSON.stringify(vars),
  };
}

// High-priority research vials first (skip cosmetic/toxin/unclear SKUs from auto-import)
const DEFER = new Set([
  'Botulinum toxin',
  'Lemon Bottle',
  'Lipo-C',
  'LC526',
  'HCG',
  'HMG',
]);

const rows = [];
const queue = [];

for (const item of gap.notOnSiteYet) {
  if (DEFER.has(item.name)) {
    queue.push({
      status: 'deferred',
      reason: 'Needs manual compliance/catalog review before import',
      ...item,
    });
    continue;
  }

  const { category, form } = classify(item);
  const { price, variations } = buildVariations(item);
  const name = displayName(item);
  const description = stubDescription(name);

  rows.push({
    name,
    category,
    form,
    price: price.toFixed(2),
    description,
    image: '',
    stockStatus: 'Coming Soon',
    variations,
    zybioCode: item.code,
    zybioName: item.name,
    specs: item.specs,
  });

  queue.push({
    status: 'needs_assets',
    priority: scorePriority(item.name),
    importName: name,
    zybioCode: item.code,
    zybioName: item.name,
    specs: item.specs,
    category,
    form,
    draftRetailPrice: Number(price.toFixed(2)),
    searchQueries: buildQueries(item.name),
    referenceCandidates: [],
    imageUrl: null,
    descriptionSource: null,
  });
}

function scorePriority(name) {
  const n = name.toLowerCase();
  const high = [
    'bpc', 'tb-500', 'epithalon', 'ara-290', 'dsip', 'ghk', 'ipamorelin', 'mots', 'nad',
    'll-37', 'foxo4', 'cjc', 'kisspeptin', 'oxytocin', 'tesamorelin', 'selank', 'semax',
    'retatrutide', 'semaglutide', 'tirzepatide', 'bac water', '5-amino',
  ];
  if (high.some((h) => n.includes(h))) return 'high';
  if (n.includes('capsule') || n.includes('blend')) return 'medium';
  return 'medium';
}

function buildQueries(name) {
  const clean = name.replace(/\(capsule\)/i, '').trim();
  return [
    `${clean} research peptide vial`,
    `${clean} peptide for research`,
    `buy ${clean} research use only`,
  ];
}

// Also queue dosage updates as update tasks
for (const gapItem of gap.dosageOrVariantUpdates || []) {
  queue.push({
    status: 'needs_update',
    priority: 'medium',
    importName: gapItem.product,
    onSite: gapItem.onSite,
    zybioSpecs: gapItem.zybioSpecs,
    specsNotClearlyOnSite: gapItem.specsNotClearlyOnSite,
    searchQueries: buildQueries(gapItem.product),
  });
}

rows.sort((a, b) => a.name.localeCompare(b.name));
queue.sort((a, b) => {
  const rank = { high: 0, medium: 1, low: 2 };
  return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9) || String(a.importName || a.zybioName).localeCompare(String(b.importName || b.zybioName));
});

fs.mkdirSync(outDir, { recursive: true });
const header = 'name,category,form,price,description,image,stockStatus,variations';
const csvLines = [
  header,
  ...rows.map((r) =>
    [
      csvEscape(r.name),
      csvEscape(r.category),
      csvEscape(r.form),
      csvEscape(r.price),
      csvEscape(r.description),
      csvEscape(r.image),
      csvEscape(r.stockStatus),
      csvEscape(r.variations),
    ].join(',')
  ),
];
fs.writeFileSync(csvPath, csvLines.join('\n') + '\n', 'utf8');

const queueDoc = {
  generatedAt: new Date().toISOString(),
  source: 'ZYBIO Price.pdf gap vs Supabase',
  importCsv: 'public/imports/zybio_missing_products.csv',
  counts: {
    importRows: rows.length,
    deferred: queue.filter((q) => q.status === 'deferred').length,
    needsAssets: queue.filter((q) => q.status === 'needs_assets').length,
    needsUpdate: queue.filter((q) => q.status === 'needs_update').length,
  },
  sourcingPlan: {
    phase1: 'Pull images + descriptions from owned WooCommerce (biolongevitylabs.com) where SKU already exists',
    phase2: 'Resolve remaining SKUs via configured public reference domains (search product page → image + short facts)',
    phase3: 'Rewrite descriptions in BioLongevity RUO voice (never paste competitor copy verbatim); store images under public/uploads/sourced/',
    phase4: 'Human QA → set stock In Stock and final retail price → admin CSV re-import or Supabase update',
  },
  queue,
};

fs.writeFileSync(queuePath, JSON.stringify(queueDoc, null, 2));

console.log(`✅ Import CSV: ${csvPath} (${rows.length} products)`);
console.log(`✅ Asset queue: ${queuePath}`);
console.log(`   deferred: ${queueDoc.counts.deferred}`);
console.log(`   needs assets: ${queueDoc.counts.needsAssets}`);
console.log(`   needs update: ${queueDoc.counts.needsUpdate}`);
