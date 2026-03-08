import fs from 'fs';
import https from 'https';

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ error: e.message, data: data.substring(0, 200) });
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log("Fetching Posts (Research Blog)...");
    const posts = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/posts?per_page=10');
    if (Array.isArray(posts)) {
        console.log(`Found ${posts.length} posts. Sample:`, posts[0]?.title?.rendered);
    }

    console.log("Fetching Peptide Guide...");
    const guide = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=peptide-guide');
    if (Array.isArray(guide) && guide.length > 0) {
        console.log(`Found Peptide Guide. Length: ${guide[0]?.content?.rendered?.length}`);
    }

    console.log("Fetching Peptide Calculator...");
    const calc = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=peptide-calculator');
    if (Array.isArray(calc) && calc.length > 0) {
        console.log(`Found Peptide Calculator. Length: ${calc[0]?.content?.rendered?.length}`);
    }

    console.log("Checking Product Data Structure for Variations/Gallery...");
    const products = await fetchJson('https://biolongevitylabs.com/wp-json/wc/store/products?per_page=5');
    if (Array.isArray(products)) {
        const sample = products.find(p => p.has_options || p.type === 'variable') || products[0];
        console.log("Product Sample:", {
            id: sample.id,
            name: sample.name,
            type: sample.type,
            has_options: sample.has_options,
            prices: sample.prices,
            images_count: sample.images?.length,
            attributes: sample.attributes?.length
        });
    }
}

run();
