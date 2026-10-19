#!/usr/bin/env node
/**
 * Import a products CSV into Supabase (same shape as Admin CSV import).
 *
 * Usage:
 *   node execution/import_csv_to_supabase.mjs
 *   node execution/import_csv_to_supabase.mjs --file public/imports/zybio_missing_products.enriched.csv
 *   node execution/import_csv_to_supabase.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const fileArgIdx = args.indexOf('--file');
const csvPath = path.resolve(
  root,
  fileArgIdx >= 0
    ? args[fileArgIdx + 1]
    : 'public/imports/zybio_missing_products.enriched.csv'
);

function loadEnv() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([^=]+)=(.*)$/);
    if (!m) continue;
    env[m[1].trim()] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
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
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, ''));
  return rows.slice(1).map((values) => {
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return {
      name: (row.name || row.productname || '').trim(),
      category: row.category || 'Peptide Vials',
      form: row.form || 'Vial',
      price: row.price || '0',
      description: (row.description || '')
        .replace(/â€”/g, '—')
        .replace(/â€“/g, '–'),
      image: row.image || row.imageurl || '',
      stockStatus: row.stockstatus || row.stock || 'Coming Soon',
      variations: row.variations || '[]',
    };
  });
}

function stableId(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48);
  const hash = createHash('sha1').update(name).digest('hex').slice(0, 8);
  return `prod_zybio_${slug}_${hash}`;
}

async function main() {
  console.log('\n📥 Import CSV → Supabase');
  console.log('═'.repeat(50));
  console.log('File:', csvPath);
  if (DRY_RUN) console.log('Mode: dry-run');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV not found');
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  console.log(`Rows: ${rows.length}`);

  const env = loadEnv();
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Existing names to avoid duplicates
  const existingNames = new Set();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id,name')
      .range(from, from + 999);
    if (error) throw error;
    for (const p of data || []) existingNames.add(String(p.name).toLowerCase().trim());
    if (!data || data.length < 1000) break;
    from += 1000;
  }
  console.log(`Existing products: ${existingNames.size}`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const label = row.name || `(row ${i + 2})`;
    process.stdout.write(`[${i + 1}/${rows.length}] ${label.slice(0, 48)} ... `);

    if (!row.name) {
      console.log('skip (no name)');
      skipped++;
      continue;
    }
    if (existingNames.has(row.name.toLowerCase())) {
      console.log('skip (exists)');
      skipped++;
      continue;
    }

    const price = parseFloat(row.price);
    if (Number.isNaN(price) || price < 0) {
      console.log('fail (bad price)');
      failed++;
      errors.push({ name: row.name, error: `Invalid price: ${row.price}` });
      continue;
    }

    let variations = [];
    let variables = [];
    let minPrice = null;
    let maxPrice = null;
    if (row.variations && row.variations.trim()) {
      try {
        const parsed = JSON.parse(row.variations);
        if (Array.isArray(parsed) && parsed.length) {
          variations = parsed.map((v, idx) => ({
            // Keep within signed 32-bit int range for Postgres integer PK
            id: Math.floor(Date.now() % 1_000_000_000) + i * 100 + idx,
            attributes: { Option: v.option || `Option ${idx + 1}` },
            price: Number(v.price) || price,
            stockStatus: row.stockStatus || 'Coming Soon',
          }));
          variables = [
            {
              name: 'Option',
              options: parsed.map((v, idx) => v.option || `Option ${idx + 1}`),
            },
          ];
          const prices = variations.map((v) => v.price).filter((p) => p > 0);
          if (prices.length) {
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);
          }
        }
      } catch (e) {
        console.log('fail (bad variations)');
        failed++;
        errors.push({ name: row.name, error: e.message });
        continue;
      }
    }

    const id = stableId(row.name);
    const payload = {
      id,
      name: row.name,
      price: minPrice ?? price,
      min_price: minPrice,
      max_price: maxPrice,
      image_url: row.image || '',
      category_name: row.category,
      form: row.form,
      description: row.description,
      stock_status: row.stockStatus || 'Coming Soon',
      is_variable: variations.length > 0,
      is_sale: false,
      is_bestseller: false,
      is_new: true,
    };

    if (DRY_RUN) {
      console.log(`dry-run (${id})`);
      imported++;
      continue;
    }

    try {
      let { error: pError } = await supabase.from('products').insert(payload);
      if (pError && String(pError.message || '').includes('gallery')) {
        // retry without optional fields if schema differs — already omitted
        ({ error: pError } = await supabase.from('products').insert(payload));
      }
      if (pError) throw pError;

      if (variables.length) {
        const { error: vErr } = await supabase.from('product_variables').insert(
          variables.map((v) => ({
            product_id: id,
            name: v.name,
            options: v.options,
          }))
        );
        if (vErr) console.log(`\n   warn variables: ${vErr.message}`);
      }

      if (variations.length) {
        const { error: vrErr } = await supabase.from('product_variations').insert(
          variations.map((v) => ({
            id: v.id,
            product_id: id,
            attributes: v.attributes,
            price: v.price,
            stock_status: v.stockStatus,
          }))
        );
        if (vrErr) console.log(`\n   warn variations: ${vrErr.message}`);
      }

      try {
        await supabase.from('scrape_sources').insert({
          product_id: id,
          source_url: `csv_import:${path.basename(csvPath)}`,
          source_type: 'csv_import',
        });
      } catch {
        /* optional */
      }

      existingNames.add(row.name.toLowerCase());
      imported++;
      console.log('ok');
    } catch (err) {
      failed++;
      errors.push({ name: row.name, error: err.message || String(err) });
      console.log('fail');
      console.error(`   ${err.message || err}`);
    }
  }

  const summary = {
    file: path.relative(root, csvPath),
    total: rows.length,
    imported,
    skipped,
    failed,
    dryRun: DRY_RUN,
    errors,
    at: new Date().toISOString(),
  };
  fs.mkdirSync(path.join(root, '.tmp'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.tmp', 'csv_import_result.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('═'.repeat(50));
  console.log(`Done. imported=${imported} skipped=${skipped} failed=${failed}`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
