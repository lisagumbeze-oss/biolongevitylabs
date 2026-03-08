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
    const products = await fetchJson('https://biolongevitylabs.com/wp-json/wc/store/products?per_page=50');
    if (Array.isArray(products)) {
        const variableProduct = products.find(p => p.has_options || p.type === 'variable');
        if (variableProduct) {
            console.log(JSON.stringify({
                id: variableProduct.id,
                name: variableProduct.name,
                attributes: variableProduct.attributes,
                prices: variableProduct.prices,
                has_options: variableProduct.has_options,
                variations: variableProduct.variations // this might be present or undefined
            }, null, 2));
        }
    }
}

run();
