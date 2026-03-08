import https from 'https';

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
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
    console.log("Fetching products API...");
    const products = await fetchJson('https://biolongevitylabs.com/wp-json/wc/store/products?per_page=100');

    if (Array.isArray(products)) {
        console.log(`Found ${products.length} products via store API.`);
        console.log("Sample product:");
        const sample = products[0];
        console.log({
            id: sample.id,
            name: sample.name,
            prices: sample.prices,
            images: sample.images?.length,
            categories: sample.categories?.map(c => c.name)
        });
    } else {
        console.log("Store API might be disabled or different format:", products);
    }

    console.log("\nFetching About Us page...");
    const about = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=about-us');
    if (Array.isArray(about) && about.length > 0) {
        console.log("About page found. Length of content:", about[0].content?.rendered?.length);
    }
}

run();
