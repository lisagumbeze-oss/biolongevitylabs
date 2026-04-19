#!/usr/bin/env node
/**
 * BioLongevity Labs — Quick Supabase Push Utility
 * 
 * Takes data from src/data/products.json and uploads/upserts it to Supabase.
 * Use this to quickly populate your database once your .env.local is set up.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PRODUCTS_JSON = path.join(PROJECT_ROOT, 'src/data/products.json');
const ENV_PATH = path.join(PROJECT_ROOT, '.env.local');

async function main() {
    console.log('\n🚀 BioLongevity Labs — Quick Push to Supabase');
    console.log('═'.repeat(50));

    // 1. Load Credentials
    if (!fs.existsSync(ENV_PATH)) {
        console.error('❌ Error: .env.local not found. Please create it first.');
        process.exit(1);
    }

    const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    const env = {};
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove surrounding quotes if present
            value = value.replace(/^(['"])(.*)\1$/, '$2');
            env[key] = value;
        }
    });

    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
        console.log('Keys found in .env.local:', Object.keys(env).join(', '));
        process.exit(1);
    }

    // 2. Load Products
    if (!fs.existsSync(PRODUCTS_JSON)) {
        console.error(`❌ Error: ${PRODUCTS_JSON} not found. Run the scraper first.`);
        process.exit(1);
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
    console.log(`📦 Loaded ${products.length} products from JSON`);

    // 3. Initialize Supabase
    let supabase;
    try {
        const { createClient } = await import('@supabase/supabase-js');
        supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    } catch (e) {
        console.error('❌ Error: Could not load @supabase/supabase-js. Run: npm install @supabase/supabase-js');
        process.exit(1);
    }

    // 4. Upsert Loop
    let success = 0;
    let failed = 0;

    for (const product of products) {
        process.stdout.write(`⏳ Uploading: ${product.name.substring(0, 30)}... `);
        
        try {
            // Upsert main product
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

            // Clean existing variables/variations for this product
            await supabase.from('product_variables').delete().eq('product_id', product.id);
            await supabase.from('product_variations').delete().eq('product_id', product.id);

            // Re-insert variables
            if (product.variables?.length > 0) {
                await supabase.from('product_variables').insert(
                    product.variables.map(v => ({
                        product_id: product.id,
                        name: v.name,
                        options: v.options
                    }))
                );
            }

            // Re-insert variations
            if (product.variations?.length > 0) {
                await supabase.from('product_variations').insert(
                    product.variations.map(v => ({
                        id: v.id,
                        product_id: product.id,
                        attributes: v.attributes,
                        price: v.price,
                        stock_status: v.stockStatus || 'In Stock'
                    }))
                );
            }

            console.log('✅');
            success++;
        } catch (err) {
            console.log('❌');
            console.error(`   Error details: ${err.message}`);
            failed++;
        }
    }

    console.log('═'.repeat(50));
    console.log(`✨ Done! ${success} uploaded, ${failed} failed.`);
    if (failed > 0) {
        console.log('⚠️ Some products failed. Usually this means the database tables do not exist.');
        console.log('👉 Make sure you ran the SQL migration: execution/migrations/001_scrape_sources.sql');
    }
}

main().catch(err => {
    console.error('💥 Fatal Error:', err);
    process.exit(1);
});
