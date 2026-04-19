#!/usr/bin/env node
/**
 * BioLongevity Labs — COA Seeder
 * 
 * Links sample lab results (Certificates of Analysis) to products in Supabase.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(PROJECT_ROOT, '.env.local');

async function main() {
    console.log('\n🧪 BioLongevity Labs — COA Seeder');
    console.log('═'.repeat(50));

    // 1. Load Credentials
    if (!fs.existsSync(ENV_PATH)) {
        console.error('❌ .env.local not found');
        process.exit(1);
    }

    const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    const env = {};
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) env[match[1].trim()] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    });

    const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('❌ Missing credentials');
        process.exit(1);
    }

    // 2. Initialize Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    // 3. Define Sample COAs
    // Note: These IDs should match the 'prod_XXXX' format from the scraper
    const coas = [
        {
            product_id: 'prod_4691', // BPC-157 (this is a guess, let's try to find it)
            name_hint: 'BPC-157',
            lab_name: 'JanoShik Analytics',
            purity_percentage: 99.42,
            report_url: 'https://janoshik.com/tests/32415-BPC157_sample_report.pdf', // Example URL
            test_date: '2024-03-15',
            batch_number: 'BPC-2403-LX'
        },
        {
            product_id: 'prod_4695', // TB-500
            name_hint: 'TB-500',
            lab_name: 'MZ Biolabs',
            purity_percentage: 99.18,
            report_url: 'https://mzbiolabs.com/reports/TB500_Verified.pdf',
            test_date: '2024-04-02',
            batch_number: 'TB5-Q2-001'
        }
    ];

    console.log('🔍 Looking up products to link COAs...');

    for (const coa of coas) {
        // Try to find the actual ID by name if the guess is wrong
        const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${coa.name_hint}%`)
            .limit(1);

        if (products && products.length > 0) {
            const actualId = products[0].id;
            console.log(`🔗 Linking COA to: ${products[0].name} (${actualId})`);

            const { error } = await supabase.from('product_coas').upsert({
                product_id: actualId,
                lab_name: coa.lab_name,
                purity_percentage: coa.purity_percentage,
                report_url: coa.report_url,
                test_date: coa.test_date,
                batch_number: coa.batch_number
            }, { onConflict: 'product_id' });

            if (error) console.error(`   ❌ Failed: ${error.message}`);
            else console.log(`   ✅ Success`);
        } else {
            console.warn(`   ⚠️ Could not find product matching "${coa.name_hint}"`);
        }
    }

    console.log('\n✨ COA Seeding complete.');
}

main().catch(console.error);
