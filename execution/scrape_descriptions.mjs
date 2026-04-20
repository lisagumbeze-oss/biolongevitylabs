#!/usr/bin/env node
/**
 * BioLongevity Labs — Description Enrichment Script
 * 
 * Targeted enrichment for products with missing or short descriptions.
 * Fetches full HTML descriptions from individual product pages.
 * 
 * Usage:
 *   node execution/scrape_descriptions.mjs              # Enrich all products with short descriptions
 *   node execution/scrape_descriptions.mjs --all        # Re-fetch ALL descriptions
 *   node execution/scrape_descriptions.mjs --dry-run    # Preview without writing
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PRODUCTS_JSON = path.join(PROJECT_ROOT, 'src/data/products.json');
const MIN_DESCRIPTION_LENGTH = 100; // Characters — below this, we consider it "short"
const REQUEST_DELAY = 600; // ms between requests

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ENRICH_ALL = args.includes('--all');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJson(url, retries = 3) {
    return new Promise((resolve) => {
        const fullUrl = url.startsWith('http') ? url : `https://biolongevitylabs.com${url}`;
        https.get(fullUrl, { headers: { 'User-Agent': 'BioLongevityLabsScraper/2.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { resolve(null); }
            });
        }).on('error', () => {
            if (retries > 0) setTimeout(() => fetchJson(url, retries - 1).then(resolve), 2000);
            else resolve(null);
        });
    });
}

async function main() {
    console.log('\n📝 BioLongevity Labs — Description Enrichment');
    console.log('═'.repeat(50));

    if (!fs.existsSync(PRODUCTS_JSON)) {
        console.error('❌ products.json not found. Run scrape_products.mjs first.');
        process.exit(1);
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
    console.log(`📦 Loaded ${products.length} products`);

    const toEnrich = ENRICH_ALL
        ? products
        : products.filter(p => !p.description || p.description.length < MIN_DESCRIPTION_LENGTH);

    console.log(`🔍 ${toEnrich.length} products need description enrichment\n`);

    let enriched = 0;
    let failed = 0;

    for (let i = 0; i < toEnrich.length; i++) {
        const product = toEnrich[i];
        const rawId = product.id.replace('prod_', '');
        console.log(`[${i + 1}/${toEnrich.length}] ${product.name} (${rawId})`);

        // Try WC Store API single product endpoint for full description
        const storeProduct = await fetchJson(`/wp-json/wc/store/products/${rawId}`);
        await sleep(REQUEST_DELAY);

        let newDescription = null;

        if (storeProduct && storeProduct.description && storeProduct.description.length > MIN_DESCRIPTION_LENGTH) {
            newDescription = storeProduct.description;
            console.log(`  ✅ Got description from Store API (${newDescription.length} chars)`);
        }

        if (!newDescription) {
            // Try the WP posts/pages API for product content
            // WooCommerce products are custom post types
            const wpProducts = await fetchJson(`/wp-json/wp/v2/product?include=${rawId}&_fields=content`);
            await sleep(REQUEST_DELAY);

            if (Array.isArray(wpProducts) && wpProducts.length > 0 && wpProducts[0].content?.rendered) {
                newDescription = wpProducts[0].content.rendered;
                console.log(`  ✅ Got description from WP API (${newDescription.length} chars)`);
            }
        }

        if (newDescription && newDescription.length > MIN_DESCRIPTION_LENGTH) {
            // Find and update the product in the main array
            const idx = products.findIndex(p => p.id === product.id);
            if (idx !== -1) {
                products[idx].description = newDescription;
                enriched++;
            }
        } else {
            console.log(`  ⚠️ No enrichment found, keeping existing`);
            failed++;
        }
    }

    console.log(`\n📊 Results: ${enriched} enriched, ${failed} unchanged`);

    if (!DRY_RUN && enriched > 0) {
        fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4));
        console.log(`✅ Updated ${PRODUCTS_JSON}`);
    } else if (DRY_RUN) {
        console.log('🏜️ Dry run — no files modified');
    }

    // Also update Supabase if credentials available
    if (!DRY_RUN && enriched > 0) {
        try {
            const envPath = path.join(PROJECT_ROOT, '.env.local');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf-8');
                const env = {};
                envContent.split('\n').forEach(line => {
                    const match = line.match(/^([^#=]+)=(.*)$/);
                    if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
                });

                const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
                const key = env.SUPABASE_SERVICE_ROLE_KEY;

                if (url && key) {
                    const { createClient } = await import('@supabase/supabase-js');
                    const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

                    for (const product of products.filter(p => toEnrich.some(t => t.id === p.id))) {
                        const { error } = await supabase.from('products')
                            .update({ description: product.description })
                            .eq('id', product.id);
                        if (error) console.log(`  ⚠️ Supabase update failed for ${product.id}: ${error.message}`);
                    }
                    console.log('✅ Supabase descriptions updated');
                }
            }
        } catch (e) {
            console.log(`⚠️ Supabase update skipped: ${e.message}`);
        }
    }
}

main();
