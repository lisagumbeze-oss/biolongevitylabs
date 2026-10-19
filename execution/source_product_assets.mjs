#!/usr/bin/env node
/**
 * Source product images + description drafts for the ZYBIO import queue.
 *
 * Phase 1 (default): match against owned WooCommerce catalog.
 * Phase 2 (--phase2): probe configured public reference domains for candidate
 *   product pages / og:image URLs (facts + images only; copy must be rewritten).
 *
 * Usage:
 *   node execution/source_product_assets.mjs
 *   node execution/source_product_assets.mjs --phase2
 *   node execution/source_product_assets.mjs --download
 *   node execution/source_product_assets.mjs --priority high
 *   node execution/source_product_assets.mjs --limit 20
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const PHASE2 = args.includes('--phase2');
const DOWNLOAD = args.includes('--download');
const priorityFilter = (() => {
  const i = args.indexOf('--priority');
  return i >= 0 ? args[i + 1] : null;
})();
const limit = (() => {
  const i = args.indexOf('--limit');
  return i >= 0 ? Number(args[i + 1]) : Infinity;
})();

const queuePath = path.join(root, '.tmp', 'product_asset_queue.json');
const configPath = path.join(root, 'config', 'product-asset-sources.json');
const outPath = path.join(root, '.tmp', 'product_asset_sourced.json');

if (!fs.existsSync(queuePath)) {
  console.error('Missing asset queue. Run: node execution/build_zybio_import.mjs');
  process.exit(1);
}
if (!fs.existsSync(configPath)) {
  console.error('Missing config/product-asset-sources.json');
  process.exit(1);
}

const queueDoc = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/&#8211;/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function fetchText(url, redirects = 4) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent': config.imagePolicy?.userAgent || 'BioLongevityLabsAssetSourcer/1.0',
          Accept: 'text/html,application/json,*/*',
        },
        timeout: 20000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
          const next = new URL(res.headers.location, url).toString();
          return fetchText(next, redirects - 1).then(resolve);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            url,
            body: Buffer.concat(chunks).toString('utf8'),
            contentType: res.headers['content-type'] || '',
          });
        });
      }
    );
    req.on('error', () => resolve({ status: 0, url, body: '', contentType: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, url, body: '', contentType: '' });
    });
  });
}

function fetchBuffer(url, redirects = 4) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: { 'User-Agent': config.imagePolicy?.userAgent || 'BioLongevityLabsAssetSourcer/1.0' },
        timeout: 30000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
          const next = new URL(res.headers.location, url).toString();
          return fetchBuffer(next, redirects - 1).then(resolve);
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            buffer: Buffer.concat(chunks),
            contentType: res.headers['content-type'] || '',
            finalUrl: url,
          })
        );
      }
    );
    req.on('error', () => resolve({ status: 0, buffer: Buffer.alloc(0), contentType: '', finalUrl: url }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, buffer: Buffer.alloc(0), contentType: '', finalUrl: url });
    });
  });
}

async function loadOwnedCatalog() {
  const api = config.ownedSources[0].productApi;
  let page = 1;
  let totalPages = 1;
  const products = [];
  while (page <= totalPages) {
    const res = await fetchText(`${api}?per_page=100&page=${page}`);
    if (res.status !== 200) break;
    try {
      const batch = JSON.parse(res.body);
      if (!Array.isArray(batch) || !batch.length) break;
      products.push(...batch);
    } catch {
      break;
    }
    // Store API may not expose total pages in this helper; stop when short page
    if (!res.body.includes('"id"')) break;
    const parsed = JSON.parse(res.body);
    if (parsed.length < 100) break;
    page++;
    await sleep(400);
  }
  return products;
}

function matchOwned(item, owned) {
  const primary = norm(item.zybioName || item.importName);
  const targets = [item.importName, item.zybioName].map(norm).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const p of owned) {
    const pn = norm(p.name);
    for (const t of targets) {
      let score = 0;
      if (pn === t) score = 100;
      else if (pn.startsWith(t + ' ') || pn.includes(' ' + t + ' ')) score = 90;
      else if (pn.includes(t) && t.length >= 6) score = 75;
      else {
        const tokens = t.split(' ').filter((x) => x.length >= 4 && !['peptide', 'human', 'acetate', 'capsule'].includes(x));
        const hit = tokens.filter((tok) => pn.includes(tok)).length;
        if (tokens.length && hit === tokens.length) score = 65;
      }

      // Penalize blend / strip / subscription false friends
      if (score && /blend|strips|subscription|private|bundle/.test(pn) && !/blend|strips|subscription|bundle/.test(primary)) {
        score -= 40;
      }
      // Plain Selank/Semax should not steal NA-acetyl variants
      if (score && /n acetyl|na selank|na semax/.test(pn) && !/n acetyl|na[- ]?selank|na[- ]?semax/.test(primary)) {
        score -= 35;
      }
      // 5-amino alone should not match only via NAD blend
      if (score && /blend/.test(pn) && /5 amino|1mq/.test(primary) && !/blend|nad/.test(primary)) {
        score -= 40;
      }

      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
  }
  return bestScore >= 65 ? { product: best, score: bestScore } : null;
}

function rewriteDescription(name, rawHtml) {
  const text = String(rawHtml || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);

  const facts = text
    ? `Public reference materials describe ${name} in research contexts involving peptide characterization and assay development.`
    : `Research-grade ${name} for laboratory procurement programs.`;

  return `<p>${facts}</p><p>Material is supplied for controlled laboratory and analytical use under institutional SOPs. Verify identity and purity against the batch COA before experimental work.</p><p>For laboratory research use only (RUO)—not for human or veterinary consumption, diagnosis, or treatment.</p>`;
}

function extractOg(html) {
  const img =
    html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i)?.[1] ||
    null;
  const desc =
    html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/content=["']([^"']+)["']\s+property=["']og:description["']/i)?.[1] ||
    null;
  const title =
    html.match(/property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<title>([^<]+)<\/title>/i)?.[1] ||
    null;
  return { img, desc, title };
}

function extractProductLinks(html, baseUrl) {
  const links = new Set();
  const re = /href=["']([^"']*(?:product|products)[^"']*)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const abs = new URL(m[1], baseUrl).toString();
      if (abs.startsWith(baseUrl)) links.add(abs.split('#')[0]);
    } catch {
      /* ignore */
    }
  }
  return [...links].slice(0, 8);
}

async function probeReference(item) {
  const candidates = [];
  const domains = (config.referenceDomains || []).filter((d) => d.enabled);
  const query = encodeURIComponent((item.zybioName || item.importName || '').split('/')[0].trim());

  for (const domain of domains) {
    const searchUrl = `${domain.baseUrl}${domain.searchPath.replace('{query}', query)}`;
    const search = await fetchText(searchUrl);
    await sleep(700);
    if (search.status !== 200 || !search.body) {
      candidates.push({ domain: domain.id, searchUrl, status: search.status, error: 'search_failed' });
      continue;
    }
    const productLinks = extractProductLinks(search.body, domain.baseUrl);
    if (!productLinks.length) {
      candidates.push({ domain: domain.id, searchUrl, status: search.status, error: 'no_product_links' });
      continue;
    }
    const pageUrl = productLinks[0];
    const page = await fetchText(pageUrl);
    await sleep(700);
    const og = extractOg(page.body || '');
    candidates.push({
      domain: domain.id,
      searchUrl,
      pageUrl,
      status: page.status,
      ogImage: og.img,
      ogTitle: og.title,
      ogDescription: og.desc,
    });
    if (og.img) break; // first usable reference is enough
  }
  return candidates;
}

async function downloadImage(imageUrl, slug) {
  const dir = path.join(root, config.imagePolicy.downloadDir || 'public/uploads/sourced');
  fs.mkdirSync(dir, { recursive: true });
  const res = await fetchBuffer(imageUrl);
  if (res.status !== 200 || !res.buffer.length) return null;
  if (res.buffer.length > (config.imagePolicy.maxBytes || 5_000_000)) return null;
  const ext =
    res.contentType.includes('webp') ? 'webp' :
    res.contentType.includes('png') ? 'png' :
    res.contentType.includes('jpeg') || res.contentType.includes('jpg') ? 'jpg' :
    path.extname(new URL(imageUrl).pathname).replace('.', '') || 'jpg';
  const hash = createHash('sha1').update(res.buffer).digest('hex').slice(0, 8);
  const fileName = `${slug}-${hash}.${ext}`;
  const abs = path.join(dir, fileName);
  fs.writeFileSync(abs, res.buffer);
  return `/uploads/sourced/${fileName}`;
}

function slugify(name) {
  return norm(name).replace(/\s+/g, '-').slice(0, 60) || 'product';
}

async function main() {
  console.log('\n📦 Product asset sourcing');
  console.log('═'.repeat(50));
  console.log(`Phase 1: owned WooCommerce`);
  if (PHASE2) console.log(`Phase 2: public reference domains`);
  if (DOWNLOAD) console.log(`Download: enabled`);

  const owned = await loadOwnedCatalog();
  console.log(`Owned catalog products: ${owned.length}`);

  let items = queueDoc.queue.filter((q) => q.status === 'needs_assets');
  if (priorityFilter) items = items.filter((q) => q.priority === priorityFilter);
  items = items.slice(0, limit);

  const results = [];
  let ownedHits = 0;
  let refHits = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    process.stdout.write(`[${i + 1}/${items.length}] ${item.importName} ... `);

    const hit = matchOwned(item, owned);
    let record = {
      ...item,
      sourcedAt: new Date().toISOString(),
      ownedMatch: null,
      referenceCandidates: [],
      imageUrl: null,
      localImage: null,
      descriptionDraft: rewriteDescription(item.importName),
      descriptionSource: 'template',
    };

    if (hit) {
      ownedHits++;
      const img =
        hit.product.images?.[0]?.src ||
        hit.product.images?.[0]?.thumbnail ||
        null;
      const rawDesc = hit.product.description || hit.product.short_description || '';
      record.ownedMatch = {
        id: hit.product.id,
        name: hit.product.name,
        slug: hit.product.slug,
        permalink: hit.product.permalink,
        score: hit.score,
        price:
          Number(hit.product.prices?.price || 0) /
          Math.pow(10, Number(hit.product.prices?.currency_minor_unit || 2)),
      };
      record.imageUrl = img;
      record.descriptionDraft = rewriteDescription(item.importName, rawDesc);
      record.descriptionSource = 'owned-wp-rewritten';
      console.log(`owned:${hit.product.slug}`);
    } else if (PHASE2) {
      const candidates = await probeReference(item);
      record.referenceCandidates = candidates;
      const withImg = candidates.find((c) => c.ogImage);
      if (withImg) {
        refHits++;
        record.imageUrl = withImg.ogImage;
        record.descriptionDraft = rewriteDescription(item.importName, withImg.ogDescription || '');
        record.descriptionSource = `reference:${withImg.domain}-rewritten`;
        console.log(`ref:${withImg.domain}`);
      } else {
        console.log('no-match');
      }
    } else {
      console.log('no-owned-match');
    }

    if (DOWNLOAD && record.imageUrl) {
      record.localImage = await downloadImage(record.imageUrl, slugify(item.importName));
      await sleep(300);
    }

    results.push(record);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    options: { PHASE2, DOWNLOAD, priorityFilter, limit },
    summary: {
      processed: results.length,
      ownedHits,
      referenceHits: refHits,
      withImage: results.filter((r) => r.imageUrl).length,
      downloaded: results.filter((r) => r.localImage).length,
    },
    nextSteps: [
      'Review .tmp/product_asset_sourced.json',
      'Approve rewritten descriptions (edit if needed)',
      'Merge image + description into public/imports/zybio_missing_products.csv',
      'Import via Admin → Products CSV (stock stays Coming Soon until QA)',
      'Run again with --phase2 --priority high for remaining gaps',
    ],
    results,
  };

  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('\nSummary:', report.summary);
  console.log('Saved:', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
