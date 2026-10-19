#!/usr/bin/env node
/**
 * BioLongevity Labs — Image Migration to Supabase Storage
 *
 * Downloads Optimole/WordPress (and local /uploads) images, uploads them to the
 * public `media` bucket, then rewrites products.json, Supabase rows, and content files.
 *
 * Usage:
 *   node execution/migrate_images.mjs                  # Full migrate
 *   node execution/migrate_images.mjs --dry-run         # Preview only
 *   node execution/migrate_images.mjs --products-only   # Catalog only
 *   node execution/migrate_images.mjs --content-only    # Hardcoded content URLs only
 *   node execution/migrate_images.mjs --local-only      # Rewrite JSON/files, skip Supabase DB
 *   node execution/migrate_images.mjs --setup-bucket    # Ensure media bucket exists then exit
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const MEDIA_BUCKET = 'media';
const PRODUCTS_JSON = path.join(PROJECT_ROOT, 'src/data/products.json');
const ENV_PATH = path.join(PROJECT_ROOT, '.env.local');
const TMP_DIR = path.join(PROJECT_ROOT, '.tmp/image-migration');
const PUBLIC_UPLOADS = path.join(PROJECT_ROOT, 'public/uploads');

/** Only match image/asset URLs (wp-content uploads, Optimole wrappers, or image extensions). */
const EXTERNAL_HOST_RE =
    /https?:\/\/(?:mlavgymrtxzc\.i\.optimole\.com\/[^\s"'`)\\\]]+|biolongevitylabs?s?\.com\/wp-content\/uploads\/[^\s"'`)\\\]]+|(?:biolongevitylabs?s?\.com\/[^\s"'`)\\\]]+\.(?:jpg|jpeg|png|webp|gif|svg|pdf)))/gi;

const CONTENT_FILES = [
    { file: 'src/components/HomePage.tsx', section: 'home' },
    { file: 'src/data/researchPosts.ts', section: 'research' },
    { file: 'src/data/researchPostsBrand.ts', section: 'research' },
    { file: 'src/data/researchPostsSprintC.ts', section: 'research' },
    { file: 'src/data/researchPostsSprintC2.ts', section: 'research' },
    { file: 'src/app/peptide-guide/page.tsx', section: 'peptide-guide' },
    { file: 'src/app/about/layout.tsx', section: 'about' },
    { file: 'src/data/posts.ts', section: 'posts' },
    { file: 'src/data/posts.json', section: 'posts' },
    { file: 'src/data/about.ts', section: 'about' },
    { file: 'src/data/peptideGuide.ts', section: 'peptide-guide' },
    { file: 'src/data/peptideCalculator.ts', section: 'peptide-guide' },
    { file: 'src/app/support/page.tsx', section: 'support' },
];

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PRODUCTS_ONLY = args.includes('--products-only');
const CONTENT_ONLY = args.includes('--content-only');
const LOCAL_ONLY = args.includes('--local-only');
const SETUP_BUCKET = args.includes('--setup-bucket');

const log = {
    entries: [],
    startTime: Date.now(),
    add(level, message, data = {}) {
        const entry = { timestamp: new Date().toISOString(), level, message, ...data };
        this.entries.push(entry);
        const prefix =
            level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'SUCCESS' ? '✅' : 'ℹ️';
        console.log(`${prefix} ${message}`, Object.keys(data).length ? JSON.stringify(data) : '');
    },
    save() {
        const logDir = path.join(PROJECT_ROOT, '.tmp');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const stamp = new Date().toISOString().replace(/[:.T]/g, '-').replace('Z', '');
        const logFile = path.join(logDir, `migrate_images_${stamp}.json`);
        fs.writeFileSync(
            logFile,
            JSON.stringify(
                {
                    duration_ms: Date.now() - this.startTime,
                    dry_run: DRY_RUN,
                    total_entries: this.entries.length,
                    errors: this.entries.filter((e) => e.level === 'ERROR').length,
                    entries: this.entries,
                },
                null,
                2
            )
        );
        console.log(`\n📄 Log saved to: ${logFile}`);
        return logFile;
    },
};

function loadEnv() {
    if (!fs.existsSync(ENV_PATH)) {
        throw new Error('.env.local not found');
    }
    const env = {};
    fs.readFileSync(ENV_PATH, 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (!match) return;
            const key = match[1].trim();
            let value = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
            env[key] = value;
        });
    return env;
}

function isOwnedUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return url.includes('.supabase.co/storage/v1/object/public/');
}

function isExternalOrLocalUpload(url) {
    if (!url || typeof url !== 'string') return false;
    if (isOwnedUrl(url)) return false;
    if (url.startsWith('/uploads/')) return true;
    if (!looksLikeImageUrl(url)) return false;
    return (
        url.includes('optimole.com') ||
        url.includes('biolongevitylabs.com') ||
        url.includes('biolongevitylabss.com')
    );
}

/** Strip Optimole CDN wrapper → underlying origin URL */
function normalizeSourceUrl(url) {
    if (!url) return url;
    // Content extractors sometimes leave trailing escapes
    url = url.replace(/[\\]+$/g, '').replace(/\/+$/, '');
    if (url.startsWith('/uploads/')) return url;

    const optimoleIdx = url.indexOf('optimole.com');
    if (optimoleIdx !== -1) {
        const nested = url.match(
            /https?:\/\/(?:biolongevitylabs\.com|biolongevitylabss\.com)\/wp-content\/uploads\/[^\s"'`)\\\]]+/i
        );
        if (nested) return nested[0].replace(/[\\]+$/g, '').replace(/\/+$/, '');
    }
    return url.split('?')[0];
}

function candidateDownloadUrls(url) {
    const cleaned = url.replace(/[\\]+$/g, '').replace(/\/+$/, '');
    const normalized = normalizeSourceUrl(cleaned);
    const out = [];
    // Prefer Optimole (often less 403-prone) when available
    if (cleaned.includes('optimole.com')) out.push(cleaned);
    if (normalized && !out.includes(normalized)) out.push(normalized);
    if (cleaned !== normalized && !out.includes(cleaned)) out.push(cleaned);
    // Common Optimole wrapper used by this site
    if (
        normalized.includes('biolongevitylabs.com/wp-content/') &&
        !cleaned.includes('optimole.com')
    ) {
        out.unshift(
            `https://mlavgymrtxzc.i.optimole.com/cb:572_.56b/w:auto/h:auto/q:mauto/f:best/${normalized}`
        );
    }
    return [...new Set(out)];
}

function looksLikeImageUrl(url) {
    if (!url) return false;
    const cleaned = url.replace(/[\\]+$/g, '');
    if (cleaned.startsWith('/uploads/')) return true;
    if (cleaned.includes('/wp-content/uploads/')) return true;
    if (cleaned.includes('optimole.com') && cleaned.includes('/wp-content/uploads/')) return true;
    return /\.(jpg|jpeg|png|webp|gif|svg|pdf)(\?|$)/i.test(cleaned);
}

function safeFilenameFromUrl(url) {
    try {
        const u = new URL(normalizeSourceUrl(url).startsWith('http') ? normalizeSourceUrl(url) : `https://local${url}`);
        const base = path.basename(u.pathname) || 'image.bin';
        return base.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    } catch {
        return `image-${crypto.randomBytes(4).toString('hex')}.bin`;
    }
}

function mimeFromFilename(filename) {
    const ext = path.extname(filename).toLowerCase();
    const map = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
    };
    return map[ext] || 'application/octet-stream';
}

function downloadOnce(source, redirectsLeft = 5) {
    return new Promise((resolve, reject) => {
        if (source.startsWith('/uploads/')) {
            const localPath = path.join(PUBLIC_UPLOADS, path.basename(source));
            if (!fs.existsSync(localPath)) {
                reject(new Error(`Local upload missing: ${localPath}`));
                return;
            }
            resolve(fs.readFileSync(localPath));
            return;
        }

        const client = source.startsWith('https') ? https : http;
        const req = client.get(
            source,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; BioLongevityLabsImageMigrator/1.1)',
                    Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                    Referer: 'https://biolongevitylabs.com/',
                },
                timeout: 30000,
            },
            (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
                    const next = res.headers.location.startsWith('http')
                        ? res.headers.location
                        : new URL(res.headers.location, source).href;
                    res.resume();
                    downloadOnce(next, redirectsLeft - 1).then(resolve).catch(reject);
                    return;
                }
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode} for ${source}`));
                    res.resume();
                    return;
                }
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }
        );
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Timeout downloading ${source}`));
        });
    });
}

async function downloadBuffer(url) {
    const candidates = candidateDownloadUrls(url);
    let lastError;
    for (const source of candidates) {
        try {
            return await downloadOnce(source);
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error(`Failed to download ${url}`);
}

function collectFromProducts(products) {
    /** @type {Map<string, { urls: Set<string>, productId?: string, section?: string }>} */
    const jobs = new Map();

    for (const product of products) {
        const urls = [product.image, ...(product.gallery || [])].filter(Boolean);
        for (const url of urls) {
            if (!isExternalOrLocalUpload(url)) continue;
            const key = normalizeSourceUrl(url);
            if (!jobs.has(key)) {
                jobs.set(key, { urls: new Set(), productId: product.id, section: 'products' });
            }
            jobs.get(key).urls.add(url);
            jobs.get(key).productId = product.id;
        }
    }
    return jobs;
}

function collectFromContentFiles() {
    const jobs = new Map();
    for (const { file, section } of CONTENT_FILES) {
        const full = path.join(PROJECT_ROOT, file);
        if (!fs.existsSync(full)) continue;
        const text = fs.readFileSync(full, 'utf-8');
        const matches = text.match(EXTERNAL_HOST_RE) || [];
        for (const raw of matches) {
            const url = raw.replace(/[)\\]'"]+$/, '').replace(/[\\]+$/g, '');
            if (!isExternalOrLocalUpload(url)) continue;
            const key = normalizeSourceUrl(url);
            if (!jobs.has(key)) {
                jobs.set(key, { urls: new Set(), section });
            }
            jobs.get(key).urls.add(url);
        }
    }
    return jobs;
}

function mergeJobs(a, b) {
    for (const [key, job] of b) {
        if (!a.has(key)) {
            a.set(key, job);
            continue;
        }
        for (const u of job.urls) a.get(key).urls.add(u);
        if (!a.get(key).productId && job.productId) a.get(key).productId = job.productId;
        if (!a.get(key).section && job.section) a.get(key).section = job.section;
    }
    return a;
}

async function ensureBucket(supabase) {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;
    const exists = (buckets || []).some((b) => b.name === MEDIA_BUCKET || b.id === MEDIA_BUCKET);
    if (exists) {
        log.add('INFO', `Bucket '${MEDIA_BUCKET}' already exists`);
        return;
    }
    if (DRY_RUN) {
        log.add('INFO', `[dry-run] Would create bucket '${MEDIA_BUCKET}'`);
        return;
    }
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
            'application/pdf',
        ],
    });
    if (error && !String(error.message || '').toLowerCase().includes('already')) {
        throw error;
    }
    log.add('SUCCESS', `Created bucket '${MEDIA_BUCKET}'`);
}

function buildObjectPath(buffer, sourceUrl, meta) {
    const filename = safeFilenameFromUrl(sourceUrl);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    if (meta.productId) {
        return `products/${meta.productId}/${hash}-${filename}`;
    }
    const section = meta.section || 'content';
    return `content/${section}/${hash}-${filename}`;
}

function rewriteTextWithMap(text, urlMap) {
    let out = text;
    // Replace longer URLs first to avoid partial collisions
    const entries = [...urlMap.entries()].sort((a, b) => b[0].length - a[0].length);
    for (const [oldUrl, newUrl] of entries) {
        if (oldUrl === newUrl) continue;
        out = out.split(oldUrl).join(newUrl);
    }
    // If a shorter WP URL was replaced inside an Optimole wrapper, unwrap it
    out = out.replace(
        /https?:\/\/mlavgymrtxzc\.i\.optimole\.com\/[^"'\\\s]*?(https:\/\/[^"'\\\s]*\.supabase\.co\/storage\/v1\/object\/public\/media\/[^"'\\\s]+)/gi,
        '$1'
    );
    return out;
}

async function main() {
    console.log('\n🖼️  BioLongevity Labs — Image Migration → Supabase Storage');
    console.log('═'.repeat(60));
    if (DRY_RUN) console.log('🏜️  DRY RUN — no uploads or rewrites\n');
    if (PRODUCTS_ONLY) console.log('📦 PRODUCTS ONLY\n');
    if (CONTENT_ONLY) console.log('📝 CONTENT ONLY\n');
    if (LOCAL_ONLY) console.log('💾 LOCAL ONLY — skip Supabase product updates\n');

    const env = loadEnv();
    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    await ensureBucket(supabase);
    if (SETUP_BUCKET) {
        log.save();
        return;
    }

    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

    /** @type {Map<string, string>} oldUrl → newUrl */
    const urlMap = new Map();
    const hashToPublicUrl = new Map();

    let products = [];
    if (!CONTENT_ONLY) {
        if (!fs.existsSync(PRODUCTS_JSON)) {
            throw new Error(`Missing ${PRODUCTS_JSON}`);
        }
        products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
        log.add('INFO', `Loaded ${products.length} products from JSON`);
    }

    let jobs = new Map();
    if (!CONTENT_ONLY) {
        jobs = mergeJobs(jobs, collectFromProducts(products));
    }
    if (!PRODUCTS_ONLY) {
        jobs = mergeJobs(jobs, collectFromContentFiles());
    }

    // Also pull product image URLs from Supabase if available
    if (!CONTENT_ONLY && !LOCAL_ONLY) {
        const { data: rows, error } = await supabase.from('products').select('id, image_url, gallery');
        if (error) {
            log.add('WARN', 'Could not read products from Supabase (gallery column may be missing)', {
                error: error.message,
            });
        } else if (rows) {
            for (const row of rows) {
                const urls = [row.image_url, ...(Array.isArray(row.gallery) ? row.gallery : [])].filter(Boolean);
                for (const u of urls) {
                    if (!isExternalOrLocalUpload(u)) continue;
                    const key = normalizeSourceUrl(u);
                    if (!jobs.has(key)) {
                        jobs.set(key, { urls: new Set(), productId: row.id, section: 'products' });
                    }
                    jobs.get(key).urls.add(u);
                }
            }
            log.add('INFO', `Merged Supabase product image URLs (${rows.length} rows)`);
        }
    }

    log.add('INFO', `Unique images to migrate: ${jobs.size}`);

    let uploaded = 0;
    let failed = 0;
    let skipped = 0;

    for (const [sourceKey, meta] of jobs) {
        const representativeUrl = [...meta.urls][0] || sourceKey;
        try {
            if (isOwnedUrl(representativeUrl)) {
                skipped++;
                continue;
            }

            const buffer = await downloadBuffer(representativeUrl);
            const contentHash = crypto.createHash('sha256').update(buffer).digest('hex');

            let publicUrl = hashToPublicUrl.get(contentHash);
            if (!publicUrl) {
                const objectPath = buildObjectPath(buffer, representativeUrl, meta);
                const filename = path.basename(objectPath);
                const tmpFile = path.join(TMP_DIR, filename);
                fs.writeFileSync(tmpFile, buffer);

                if (DRY_RUN) {
                    publicUrl = `${url}/storage/v1/object/public/${MEDIA_BUCKET}/${objectPath}`;
                    log.add('INFO', `[dry-run] Would upload ${objectPath}`, { bytes: buffer.length });
                } else {
                    const contentType = mimeFromFilename(filename);
                    const { error: upError } = await supabase.storage
                        .from(MEDIA_BUCKET)
                        .upload(objectPath, buffer, {
                            contentType,
                            upsert: true,
                            cacheControl: '31536000',
                        });
                    if (upError) throw upError;
                    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
                    publicUrl = data.publicUrl;
                    uploaded++;
                    log.add('SUCCESS', `Uploaded ${objectPath}`, { bytes: buffer.length });
                }
                hashToPublicUrl.set(contentHash, publicUrl);
            } else {
                skipped++;
            }

            // Map every variant of the old URL (Optimole + WP + local)
            urlMap.set(sourceKey, publicUrl);
            for (const old of meta.urls) {
                urlMap.set(old, publicUrl);
            }
            // Also map Optimole form if we only had WP (and vice versa)
            if (!representativeUrl.includes('optimole') && sourceKey.includes('biolongevity')) {
                // common Optimole wrapper prefix used in this project
                const wrapped = `https://mlavgymrtxzc.i.optimole.com/cb:572_.56b/w:auto/h:auto/q:mauto/f:best/${sourceKey}`;
                urlMap.set(wrapped, publicUrl);
            }
        } catch (err) {
            failed++;
            log.add('ERROR', `Failed to migrate ${representativeUrl}`, { error: err.message });
        }
    }

    log.add('INFO', `Upload summary`, { uploaded, failed, skipped, mapped: urlMap.size });

    if (urlMap.size === 0) {
        log.add('WARN', 'No URL mappings produced — nothing to rewrite');
        log.save();
        return;
    }

    // Rewrite products.json
    if (!CONTENT_ONLY && products.length) {
        const rewritten = products.map((p) => {
            const next = { ...p };
            if (next.image && urlMap.has(next.image)) next.image = urlMap.get(next.image);
            else if (next.image && urlMap.has(normalizeSourceUrl(next.image))) {
                next.image = urlMap.get(normalizeSourceUrl(next.image));
            }
            if (Array.isArray(next.gallery)) {
                next.gallery = next.gallery.map((g) => urlMap.get(g) || urlMap.get(normalizeSourceUrl(g)) || g);
            }
            return next;
        });

        if (DRY_RUN) {
            log.add('INFO', `[dry-run] Would rewrite products.json (${rewritten.length} products)`);
        } else {
            fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(rewritten, null, 4));
            log.add('SUCCESS', `Rewrote ${PRODUCTS_JSON}`);
        }
        products = rewritten;

        // Upsert image_url + gallery to Supabase
        if (!LOCAL_ONLY && !DRY_RUN) {
            let dbOk = 0;
            let dbFail = 0;
            for (const product of products) {
                const payload = {
                    image_url: product.image || null,
                    gallery: product.gallery || [],
                };
                const { error } = await supabase.from('products').update(payload).eq('id', product.id);
                if (error) {
                    // Retry without gallery if column missing
                    if (String(error.message || '').includes('gallery')) {
                        const { error: e2 } = await supabase
                            .from('products')
                            .update({ image_url: product.image || null })
                            .eq('id', product.id);
                        if (e2) {
                            dbFail++;
                            log.add('ERROR', `DB update failed for ${product.id}`, { error: e2.message });
                        } else {
                            dbOk++;
                            log.add(
                                'WARN',
                                'Updated image_url only — run execution/migrations/004_media_storage.sql to add gallery column'
                            );
                        }
                    } else {
                        dbFail++;
                        log.add('ERROR', `DB update failed for ${product.id}`, { error: error.message });
                    }
                } else {
                    dbOk++;
                }
            }
            log.add('SUCCESS', `Supabase product image updates: ${dbOk} ok, ${dbFail} failed`);
        }
    }

    // Rewrite content source files
    if (!PRODUCTS_ONLY) {
        for (const { file } of CONTENT_FILES) {
            const full = path.join(PROJECT_ROOT, file);
            if (!fs.existsSync(full)) continue;
            const original = fs.readFileSync(full, 'utf-8');
            const updated = rewriteTextWithMap(original, urlMap);
            if (updated === original) continue;
            if (DRY_RUN) {
                log.add('INFO', `[dry-run] Would rewrite ${file}`);
            } else {
                fs.writeFileSync(full, updated, 'utf-8');
                log.add('SUCCESS', `Rewrote ${file}`);
            }
        }
    }

    // Persist URL map for auditing
    const mapPath = path.join(PROJECT_ROOT, '.tmp/image_url_map.json');
    if (!DRY_RUN) {
        fs.writeFileSync(mapPath, JSON.stringify(Object.fromEntries(urlMap), null, 2));
        log.add('SUCCESS', `URL map saved to ${mapPath}`);
    }

    log.save();
    console.log('\nDone.');
}

main().catch((err) => {
    console.error('❌ Fatal:', err.message || err);
    log.add('ERROR', 'Fatal', { error: String(err.message || err) });
    log.save();
    process.exit(1);
});
