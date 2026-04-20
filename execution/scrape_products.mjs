#!/usr/bin/env node
/**
 * BioLongevity Labs — Production Product Scraper
 * 
 * Scrapes full product data (descriptions, variables, variation prices, galleries)
 * from biolongevitylabs.com via WooCommerce Store API + WP REST API.
 * 
 * Usage:
 *   node execution/scrape_products.mjs                  # Full scrape → Supabase + local JSON
 *   node execution/scrape_products.mjs --dry-run        # Preview without writing
 *   node execution/scrape_products.mjs --local-only     # Write to local JSON only
 *   node execution/scrape_products.mjs --descriptions   # Also fetch full HTML descriptions
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ─── Configuration ──────────────────────────────────────────────────────────────
const CONFIG = {
    baseUrl: 'https://biolongevitylabs.com',
    storeApiBase: '/wp-json/wc/store/products',
    wpApiBase: '/wp-json/wp/v2',
    perPage: 100,
    requestDelay: 500,       // ms between requests (rate limiting)
    maxRetries: 3,
    retryDelay: 2000,        // ms between retries
    outputJsonPath: path.join(PROJECT_ROOT, 'src/data/products.json'),
    logDir: path.join(PROJECT_ROOT, '.tmp'),
    categoryMap: {
        'peptide-capsules': { name: 'Peptide Capsules', form: 'Capsule' },
        'peptides': { name: 'Peptide Vials', form: 'Vial' },
        'bioregulators': { name: 'Bioregulator Capsules', form: 'Capsule' },
        'bioregulators-creams': { name: 'Bioregulator Creams', form: 'Cream' },
        'non-oral-bioregulators': { name: 'Bioregulator Vials', form: 'Vial' },
    }
};

// ─── CLI Flags ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LOCAL_ONLY = args.includes('--local-only');
const FETCH_DESCRIPTIONS = args.includes('--descriptions');

// ─── Logging ────────────────────────────────────────────────────────────────────
const log = {
    entries: [],
    startTime: Date.now(),
    add(level, message, data = {}) {
        const entry = { timestamp: new Date().toISOString(), level, message, ...data };
        this.entries.push(entry);
        const prefix = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'SUCCESS' ? '✅' : 'ℹ️';
        console.log(`${prefix} ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
    },
    save() {
        if (!fs.existsSync(CONFIG.logDir)) fs.mkdirSync(CONFIG.logDir, { recursive: true });
        const logFile = path.join(CONFIG.logDir, `scrape_log_${new Date().toISOString().replace(/[:.T]/g, '-').replace('Z', '')}.json`);
        const summary = {
            duration_ms: Date.now() - this.startTime,
            total_entries: this.entries.length,
            errors: this.entries.filter(e => e.level === 'ERROR').length,
            entries: this.entries,
        };
        fs.writeFileSync(logFile, JSON.stringify(summary, null, 2));
        console.log(`\n📄 Log saved to: ${logFile}`);
    }
};

// ─── HTTP Helpers ───────────────────────────────────────────────────────────────
function fetchJson(url, retries = CONFIG.maxRetries) {
    return new Promise((resolve, reject) => {
        const fullUrl = url.startsWith('http') ? url : `${CONFIG.baseUrl}${url}`;
        https.get(fullUrl, { headers: { 'User-Agent': 'BioLongevityLabsScraper/2.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    if (retries > 0) {
                        log.add('WARN', `JSON parse failed, retrying... (${retries} left)`, { url: fullUrl });
                        setTimeout(() => fetchJson(url, retries - 1).then(resolve).catch(reject), CONFIG.retryDelay);
                    } else {
                        log.add('ERROR', 'JSON parse failed after all retries', { url: fullUrl, preview: data.substring(0, 200) });
                        resolve(null);
                    }
                }
            });
        }).on('error', (err) => {
            if (retries > 0) {
                log.add('WARN', `Request failed, retrying... (${retries} left)`, { url: fullUrl, error: err.message });
                setTimeout(() => fetchJson(url, retries - 1).then(resolve).catch(reject), CONFIG.retryDelay);
            } else {
                log.add('ERROR', 'Request failed after all retries', { url: fullUrl, error: err.message });
                resolve(null);
            }
        });
    });
}

function fetchHtml(url, retries = CONFIG.maxRetries) {
    return new Promise((resolve, reject) => {
        const fullUrl = url.startsWith('http') ? url : `${CONFIG.baseUrl}${url}`;
        https.get(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml'
            }
        }, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchHtml(res.headers.location, retries).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => {
            if (retries > 0) {
                setTimeout(() => fetchHtml(url, retries - 1).then(resolve).catch(reject), CONFIG.retryDelay);
            } else {
                resolve(null);
            }
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function contentHash(obj) {
    return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').substring(0, 16);
}

// ─── Supabase Client (dynamic import to avoid issues if not needed) ─────────
async function getSupabaseClient() {
    if (LOCAL_ONLY || DRY_RUN) return null;

    // Read .env.local for Supabase credentials
    const envPath = path.join(PROJECT_ROOT, '.env.local');
    if (!fs.existsSync(envPath)) {
        log.add('WARN', '.env.local not found, falling back to local-only mode');
        return null;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    });

    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        log.add('WARN', 'Supabase credentials not found in .env.local');
        return null;
    }

    try {
        const { createClient } = await import('@supabase/supabase-js');
        return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    } catch (e) {
        log.add('WARN', 'Could not import @supabase/supabase-js, using local-only mode');
        return null;
    }
}

// ─── Step 1: Fetch All Products from WC Store API ──────────────────────────────
async function fetchAllProducts() {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    log.add('INFO', 'Starting product fetch from WC Store API...');

    while (hasMore) {
        const url = `${CONFIG.storeApiBase}?per_page=${CONFIG.perPage}&page=${page}`;
        const products = await fetchJson(url);

        if (Array.isArray(products) && products.length > 0) {
            allProducts = allProducts.concat(products);
            log.add('INFO', `Page ${page}: fetched ${products.length} products (total: ${allProducts.length})`);
            if (products.length < CONFIG.perPage) hasMore = false;
            else page++;
            await sleep(CONFIG.requestDelay);
        } else {
            hasMore = false;
        }
    }

    log.add('SUCCESS', `Fetched ${allProducts.length} raw products`);
    return allProducts;
}

// ─── Step 2: Fetch Variation Details ────────────────────────────────────────────
async function fetchVariationPrices(productId) {
    const url = `${CONFIG.storeApiBase}/${productId}/variations`;
    const variations = await fetchJson(url);
    if (!Array.isArray(variations)) return [];
    return variations;
}

// ─── Step 3: Fetch Full Description from WP REST API ───────────────────────────
async function fetchFullDescription(productId) {
    // Try the WooCommerce product endpoint first
    const url = `${CONFIG.baseUrl}/wp-json/wc/store/products/${productId}`;
    const product = await fetchJson(url);

    if (product && product.description) {
        return product.description;
    }

    return null;
}

// ─── Step 4: Fetch Full Description via DOM Scraping (Fallback) ─────────────────
async function fetchDescriptionFromPage(permalink) {
    if (!permalink) return null;

    const html = await fetchHtml(permalink);
    if (!html) return null;

    // Try to extract the product description from the page
    // WooCommerce typically puts it in .woocommerce-product-details__short-description
    // or in a tab with id description
    const patterns = [
        // Full description tab content
        /<div[^>]*class="[^"]*woocommerce-Tabs-panel--description[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
        // Product description div
        /<div[^>]*class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
        // Entry content
        /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1] && match[1].trim().length > 50) {
            return match[1].trim();
        }
    }

    return null;
}

// ─── Step 5: Map Raw Product to Our Schema ──────────────────────────────────────
async function mapProduct(rawProduct, index, total) {
    // Match category
    let matchedCategory = null;
    if (rawProduct.categories) {
        for (const cat of rawProduct.categories) {
            if (CONFIG.categoryMap[cat.slug]) {
                matchedCategory = CONFIG.categoryMap[cat.slug];
                break;
            }
        }
    }
    if (!matchedCategory) return null;

    const id = rawProduct.id.toString();
    const name = rawProduct.name
        ? rawProduct.name.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '–').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&amp;/g, '&').trim()
        : '';

    log.add('INFO', `[${index + 1}/${total}] Processing: ${name}`);

    // ── Pricing ──
    const minorUnit = 10 ** (rawProduct.prices?.currency_minor_unit || 2);
    let price = 0;
    let minPrice = null;
    let maxPrice = null;

    if (rawProduct.prices?.price_range) {
        minPrice = parseFloat(rawProduct.prices.price_range.min_amount) / minorUnit;
        maxPrice = parseFloat(rawProduct.prices.price_range.max_amount) / minorUnit;
        price = minPrice;
    } else {
        const priceStr = rawProduct.prices?.price || rawProduct.prices?.regular_price || '0';
        price = parseFloat(priceStr) / minorUnit;
    }

    // ── Gallery Images ──
    const gallery = rawProduct.images ? rawProduct.images.map(img => img.src).filter(Boolean) : [];
    const image = gallery.length > 0 ? gallery[0] : '';

    // ── Variables (attributes) ──
    const variables = rawProduct.attributes ? rawProduct.attributes.map(attr => ({
        name: attr.name,
        options: attr.terms ? attr.terms.map(t => t.name) : (attr.options || [])
    })).filter(v => v.options.length > 0) : [];

    // ── Variations with prices ──
    let variations = [];
    const isVariable = rawProduct.has_options || rawProduct.type === 'variable';

    if (isVariable) {
        const rawVariations = await fetchVariationPrices(rawProduct.id);
        if (rawVariations.length > 0) {
            variations = rawVariations.map(v => {
                const varPrice = v.prices?.price ? parseFloat(v.prices.price) / (10 ** (v.prices?.currency_minor_unit || 2)) : price;
                return {
                    id: v.id,
                    attributes: v.attributes ? v.attributes.reduce((acc, attr) => {
                        acc[attr.name] = attr.value;
                        return acc;
                    }, {}) : {},
                    price: varPrice,
                    stockStatus: v.is_in_stock ? 'In Stock' : 'Out of Stock'
                };
            });

            // Recalculate min/max from actual variation prices
            const varPrices = variations.map(v => v.price).filter(p => !isNaN(p) && p > 0);
            if (varPrices.length > 0) {
                minPrice = Math.min(...varPrices);
                maxPrice = Math.max(...varPrices);
                price = minPrice;
            }

            log.add('INFO', `  → ${variations.length} variations found (${minPrice}–${maxPrice} USD)`);
        }
        await sleep(CONFIG.requestDelay);
    }

    // ── Description ──
    let description = '';

    if (FETCH_DESCRIPTIONS) {
        // Try WC Store API single product first (has full description)
        description = await fetchFullDescription(rawProduct.id);
        await sleep(CONFIG.requestDelay);

        // Fallback: scrape from product page
        if (!description || description.length < 50) {
            const permalink = rawProduct.permalink || rawProduct.link;
            if (permalink) {
                const scraped = await fetchDescriptionFromPage(permalink);
                if (scraped) description = scraped;
                await sleep(CONFIG.requestDelay);
            }
        }

        if (description) {
            log.add('INFO', `  → Full description fetched (${description.length} chars)`);
        }
    }

    // Fall back to short description from Store API
    if (!description || description.length < 20) {
        description = rawProduct.short_description || rawProduct.description || '';
    }

    // ── Sale detection ──
    const isSale = rawProduct.on_sale || false;

    return {
        id: `prod_${id}`,
        name,
        price: price > 0 ? price : 0,
        minPrice,
        maxPrice,
        image,
        gallery: gallery.length > 1 ? gallery.slice(1) : [],  // First image is thumbnail
        category: matchedCategory.name,
        form: matchedCategory.form,
        description,
        isSale,
        stockStatus: rawProduct.is_in_stock ? 'In Stock' : 'Out of Stock',
        isVariable,
        variables,
        variations,
        // Metadata for source tracking
        _sourceUrl: rawProduct.permalink || `${CONFIG.baseUrl}/?p=${id}`,
        _contentHash: null, // Will be set after mapping
    };
}

// ─── Step 6: Upsert to Supabase ────────────────────────────────────────────────
async function upsertToSupabase(supabase, products) {
    log.add('INFO', `Upserting ${products.length} products to Supabase...`);
    let success = 0;
    let failed = 0;

    for (const product of products) {
        try {
            // Upsert product
            const { error: pError } = await supabase.from('products').upsert({
                id: product.id,
                name: product.name,
                price: product.price,
                min_price: product.minPrice,
                max_price: product.maxPrice,
                image_url: product.image,
                category_name: product.category,
                form: product.form,
                description: product.description,
                stock_status: product.stockStatus,
                is_variable: product.isVariable,
                is_sale: product.isSale,
                is_bestseller: false,
                is_new: false,
            }, { onConflict: 'id' });

            if (pError) throw pError;

            // Delete existing variables and variations, then re-insert
            await supabase.from('product_variables').delete().eq('product_id', product.id);
            await supabase.from('product_variations').delete().eq('product_id', product.id);

            // Insert variables
            if (product.variables?.length > 0) {
                const { error: vError } = await supabase.from('product_variables').insert(
                    product.variables.map(v => ({
                        product_id: product.id,
                        name: v.name,
                        options: v.options
                    }))
                );
                if (vError) log.add('WARN', `Variable insert warning for ${product.id}`, { error: vError.message });
            }

            // Insert variations
            if (product.variations?.length > 0) {
                const { error: varError } = await supabase.from('product_variations').insert(
                    product.variations.map(v => ({
                        id: v.id,
                        product_id: product.id,
                        attributes: v.attributes,
                        price: v.price,
                        stock_status: v.stockStatus || 'In Stock'
                    }))
                );
                if (varError) log.add('WARN', `Variation insert warning for ${product.id}`, { error: varError.message });
            }

            // Upsert source tracking (if table exists)
            try {
                await supabase.from('scrape_sources').upsert({
                    product_id: product.id,
                    source_url: product._sourceUrl,
                    source_type: 'wc_api',
                    content_hash: product._contentHash,
                    last_scraped_at: new Date().toISOString(),
                }, { onConflict: 'product_id' });
            } catch (e) {
                // scrape_sources table may not exist yet — silently skip
            }

            success++;
        } catch (err) {
            log.add('ERROR', `Failed to upsert product ${product.id}`, { error: err.message });
            failed++;
        }
    }

    log.add('SUCCESS', `Supabase upsert complete: ${success} succeeded, ${failed} failed`);
}

// ─── Step 7: Write Local JSON ───────────────────────────────────────────────────
function writeLocalJson(products) {
    // Strip internal metadata before saving
    const cleanProducts = products.map(({ _sourceUrl, _contentHash, ...rest }) => rest);
    fs.writeFileSync(CONFIG.outputJsonPath, JSON.stringify(cleanProducts, null, 4));
    log.add('SUCCESS', `Wrote ${cleanProducts.length} products to ${CONFIG.outputJsonPath}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🧬 BioLongevity Labs — Product Scraper v2.0');
    console.log('═'.repeat(50));
    if (DRY_RUN) console.log('🏜️  DRY RUN MODE — no data will be written\n');
    if (LOCAL_ONLY) console.log('💾 LOCAL ONLY MODE — no Supabase writes\n');
    if (FETCH_DESCRIPTIONS) console.log('📝 DESCRIPTIONS MODE — fetching full HTML descriptions\n');

    try {
        // 1. Fetch all products
        const rawProducts = await fetchAllProducts();

        // 2. Map and enrich
        const mappedProducts = [];
        for (let i = 0; i < rawProducts.length; i++) {
            const mapped = await mapProduct(rawProducts[i], i, rawProducts.length);
            if (mapped) {
                mapped._contentHash = contentHash({ name: mapped.name, price: mapped.price, variations: mapped.variations });
                mappedProducts.push(mapped);
            }
        }

        log.add('SUCCESS', `Mapped ${mappedProducts.length} products (${rawProducts.length - mappedProducts.length} skipped — uncategorized)`);

        if (DRY_RUN) {
            console.log('\n📊 Dry Run Summary:');
            mappedProducts.forEach(p => {
                console.log(`  • ${p.name} | ${p.category} | $${p.price} | ${p.variations.length} vars | ${p.stockStatus}`);
            });
            log.save();
            return;
        }

        // 3. Write local JSON
        writeLocalJson(mappedProducts);

        // 4. Upsert to Supabase
        const supabase = await getSupabaseClient();
        if (supabase) {
            await upsertToSupabase(supabase, mappedProducts);
        } else {
            log.add('INFO', 'Supabase client not available — local JSON only');
        }

        // 5. Summary
        const categories = [...new Set(mappedProducts.map(p => p.category))];
        console.log('\n📊 Final Summary:');
        console.log(`  Total products: ${mappedProducts.length}`);
        console.log(`  Categories: ${categories.join(', ')}`);
        console.log(`  Variable products: ${mappedProducts.filter(p => p.isVariable).length}`);
        console.log(`  Total variations: ${mappedProducts.reduce((acc, p) => acc + p.variations.length, 0)}`);
        console.log(`  In Stock: ${mappedProducts.filter(p => p.stockStatus === 'In Stock').length}`);

    } catch (err) {
        log.add('ERROR', 'Fatal scraper error', { error: err.message, stack: err.stack });
    } finally {
        log.save();
    }
}

main();
