import fs from 'fs';
import https from 'https';
import path from 'path';

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

function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").trim();
}

async function run() {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    console.log("Fetching all products...");
    while (hasMore) {
        console.log(`Fetching page ${page}...`);
        const products = await fetchJson(`https://biolongevitylabs.com/wp-json/wc/store/products?per_page=100&page=${page}`);
        if (Array.isArray(products) && products.length > 0) {
            allProducts = allProducts.concat(products);
            if (products.length < 100) hasMore = false;
            else page++;
        } else {
            hasMore = false;
        }
    }

    console.log(`Total products fetched: ${allProducts.length}`);

    const mappedProducts = [];

    const categoryMap = {
        'peptide-capsules': { name: 'Peptide Capsules', form: 'Capsule' },
        'peptides': { name: 'Peptide Vials', form: 'Vial' },
        'bioregulators': { name: 'Bioregulator Capsules', form: 'Capsule' },
        'bioregulators-creams': { name: 'Bioregulator Creams', form: 'Cream' },
        'non-oral-bioregulators': { name: 'Bioregulator Vials', form: 'Vial' }
    };

    for (const product of allProducts) {
        // Find matching category
        let matchedCategory = null;
        let fallbackCategory = null;

        if (product.categories) {
            for (const cat of product.categories) {
                if (categoryMap[cat.slug]) {
                    matchedCategory = categoryMap[cat.slug];
                    break;
                }
            }
        }

        if (!matchedCategory) continue; // Skip if it doesn't match the required 5 categories.

        const id = product.id.toString();
        const name = stripHtml(product.name);
        // Parse price
        const priceStr = product.prices?.price || product.prices?.regular_price || "0";
        const price = parseFloat(priceStr) / (10 ** (product.prices?.currency_minor_unit || 2));

        // original price
        const originalPriceStr = product.prices?.regular_price;
        const originalPrice = parseFloat(originalPriceStr) / (10 ** (product.prices?.currency_minor_unit || 2));

        const image = product.images?.[0]?.src || "";
        // short description preferred, else full
        let description = stripHtml(product.short_description || product.description || "");
        // Truncate description slightly if it's too long
        if (description.length > 250) {
            description = description.substring(0, 247) + "...";
        }

        mappedProducts.push({
            id: "prod_" + id,
            name,
            price: price > 0 ? price : 99, // default to 99 if missing
            originalPrice: (originalPrice > price) ? originalPrice : undefined,
            image,
            category: matchedCategory.name,
            form: matchedCategory.form,
            description,
            isSale: product.on_sale,
            stockStatus: product.is_in_stock ? "In Stock" : "Out of Stock"
        });
    }

    console.log(`Filtered and mapped ${mappedProducts.length} matching products.`);

    // Generate TS
    let tsOutput = `export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: "Peptide Vials" | "Peptide Capsules" | "Bioregulator Capsules" | "Bioregulator Creams" | "Bioregulator Vials";
    form: 'Vial' | 'Capsule' | 'Cream' | 'Solution';
    description: string;
    attributes?: { label: string; value: string }[];
    isSale?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Coming Soon';
}

export const products: Product[] = ${JSON.stringify(mappedProducts, null, 4)};

export const categories = [
    "Peptide Vials",
    "Peptide Capsules",
    "Bioregulator Capsules",
    "Bioregulator Creams",
    "Bioregulator Vials"
];

export const forms = ["Vial", "Capsule", "Cream", "Solution"];
`;

    fs.writeFileSync('src/data/products.ts', tsOutput);
    console.log("Successfully wrote products to src/data/products.ts");

    // Fetch about info
    console.log("\nFetching About Us page...");
    const about = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=about-us');
    if (Array.isArray(about) && about.length > 0) {
        const title = about[0].title?.rendered || "About Us";
        let contentHtml = about[0].content?.rendered || "";
        // Save it temporarily so we can embed it
        const aboutTs = `export const aboutContent = {
          title: ${JSON.stringify(title)},
          contentHtml: ${JSON.stringify(contentHtml)}
      };`;
        fs.writeFileSync('src/data/about.ts', aboutTs);
        console.log("Successfully wrote about content to src/data/about.ts");
    } else {
        console.log("Failed to fetch about us.");
    }
}

run();
