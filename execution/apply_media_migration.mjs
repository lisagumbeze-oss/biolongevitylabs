#!/usr/bin/env node
/**
 * Applies what we can of 004_media_storage without direct Postgres access:
 * - Creates the public `media` bucket via Storage API
 * - Probes whether `products.gallery` exists (prints SQL reminder if not)
 *
 * For full DDL (gallery column + storage.objects policies), run
 * execution/migrations/004_media_storage.sql in the Supabase SQL Editor.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(PROJECT_ROOT, '.env.local');
const MEDIA_BUCKET = 'media';

function loadEnv() {
    const env = {};
    fs.readFileSync(ENV_PATH, 'utf-8')
        .split(/\r?\n/)
        .forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (!match) return;
            env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
        });
    return env;
}

async function main() {
    const env = loadEnv();
    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing Supabase credentials in .env.local');

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = (buckets || []).some((b) => b.id === MEDIA_BUCKET || b.name === MEDIA_BUCKET);
    if (exists) {
        console.log(`✅ Bucket '${MEDIA_BUCKET}' already exists`);
    } else {
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
        if (error) throw error;
        console.log(`✅ Created public bucket '${MEDIA_BUCKET}'`);
    }

    // Probe gallery column
    const { error: galleryError } = await supabase.from('products').select('gallery').limit(1);
    if (galleryError) {
        console.log('\n⚠️  products.gallery column is missing.');
        console.log('   Open Supabase SQL Editor and run:');
        console.log('   execution/migrations/004_media_storage.sql');
        console.log(`   Error: ${galleryError.message}`);
        process.exitCode = 2;
    } else {
        console.log('✅ products.gallery column is present');
    }
}

main().catch((err) => {
    console.error('❌', err.message || err);
    process.exit(1);
});
