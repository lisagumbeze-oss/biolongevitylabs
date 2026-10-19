#!/usr/bin/env node
/**
 * Merge approved sourced images/descriptions into the ZYBIO import CSV.
 *
 * Usage:
 *   node execution/merge_sourced_assets_into_csv.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const csvPath = path.join(root, 'public', 'imports', 'zybio_missing_products.csv');
const sourcedPath = path.join(root, '.tmp', 'product_asset_sourced.json');
const outPath = path.join(root, 'public', 'imports', 'zybio_missing_products.enriched.csv');

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rows = [];
  for (const line of lines) {
    const fields = [];
    let cur = '';
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (q && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = !q;
      } else if (c === ',' && !q) {
        fields.push(cur);
        cur = '';
      } else cur += c;
    }
    fields.push(cur);
    rows.push(fields);
  }
  return rows;
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

if (!fs.existsSync(csvPath) || !fs.existsSync(sourcedPath)) {
  console.error('Need import CSV and product_asset_sourced.json');
  process.exit(1);
}

const table = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const header = table[0];
const nameIdx = header.findIndex((h) => h.toLowerCase() === 'name');
const descIdx = header.findIndex((h) => h.toLowerCase() === 'description');
const imageIdx = header.findIndex((h) => h.toLowerCase() === 'image');

const sourced = JSON.parse(fs.readFileSync(sourcedPath, 'utf8'));
const byName = new Map(sourced.results.map((r) => [r.importName, r]));

let updated = 0;
for (let i = 1; i < table.length; i++) {
  const name = table[i][nameIdx];
  const hit = byName.get(name);
  if (!hit) continue;
  const image = hit.localImage || hit.imageUrl || '';
  if (image && !table[i][imageIdx]) {
    table[i][imageIdx] = image;
    updated++;
  }
  if (hit.descriptionDraft && hit.descriptionSource !== 'template') {
    table[i][descIdx] = hit.descriptionDraft;
  }
}

const out = table.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n';
fs.writeFileSync(outPath, out);
console.log(`✅ Enriched CSV: ${outPath}`);
console.log(`   rows with new images: ${updated}`);
console.log(`   sourced records: ${sourced.results.length}`);
