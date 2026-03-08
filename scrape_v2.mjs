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

function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').trim();
}

async function run() {
    // 1. PRODUCTS
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    console.log("Fetching all products (including variations & galleries)...");
    while (hasMore) {
        const products = await fetchJson(`https://biolongevitylabs.com/wp-json/wc/store/products?per_page=100&page=${page}`);
        if (Array.isArray(products) && products.length > 0) {
            allProducts = allProducts.concat(products);
            if (products.length < 100) hasMore = false;
            else page++;
        } else {
            hasMore = false;
        }
    }

    const categoryMap = {
        'peptide-capsules': { name: 'Peptide Capsules', form: 'Capsule' },
        'peptides': { name: 'Peptide Vials', form: 'Vial' },
        'bioregulators': { name: 'Bioregulator Capsules', form: 'Capsule' },
        'bioregulators-creams': { name: 'Bioregulator Creams', form: 'Cream' },
        'non-oral-bioregulators': { name: 'Bioregulator Vials', form: 'Vial' }
    };

    const mappedProducts = [];
    for (const product of allProducts) {
        let matchedCategory = null;
        if (product.categories) {
            for (const cat of product.categories) {
                if (categoryMap[cat.slug]) {
                    matchedCategory = categoryMap[cat.slug];
                    break;
                }
            }
        }
        if (!matchedCategory) continue;

        const id = product.id.toString();
        const name = stripHtml(product.name);

        // Pricing
        const minorUnit = 10 ** (product.prices?.currency_minor_unit || 2);
        let price = 99;
        let minPrice = null;
        let maxPrice = null;

        if (product.prices?.price_range) {
            minPrice = parseFloat(product.prices.price_range.min_amount) / minorUnit;
            maxPrice = parseFloat(product.prices.price_range.max_amount) / minorUnit;
            price = minPrice; // Default to min price for display
        } else {
            const priceStr = product.prices?.price || product.prices?.regular_price || "0";
            price = parseFloat(priceStr) / minorUnit;
        }

        const originalPriceStr = product.prices?.regular_price;
        const originalPrice = parseFloat(originalPriceStr) / minorUnit;

        // Gallery
        const gallery = product.images ? product.images.map(img => img.src) : [];
        const image = gallery.length > 0 ? gallery[0] : "";

        // Attributes (Variables)
        const variables = product.attributes ? product.attributes.map(attr => ({
            name: attr.name,
            options: attr.terms ? attr.terms.map(t => t.name) : []
        })) : [];

        let description = stripHtml(product.short_description || product.description || "");
        if (description.length > 250) description = description.substring(0, 247) + "...";

        mappedProducts.push({
            id: "prod_" + id,
            name,
            price: price > 0 ? price : 99,
            minPrice,
            maxPrice,
            originalPrice: (originalPrice > price && !minPrice) ? originalPrice : undefined,
            image,
            gallery,
            category: matchedCategory.name,
            form: matchedCategory.form,
            description,
            isSale: product.on_sale,
            stockStatus: product.is_in_stock ? "In Stock" : "Out of Stock",
            isVariable: product.has_options || product.type === 'variable',
            variables
        });
    }

    let tsOutput = `export interface ProductVariable {
    name: string;
    options: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    minPrice?: number | null;
    maxPrice?: number | null;
    originalPrice?: number;
    image: string;
    gallery?: string[];
    category: "Peptide Vials" | "Peptide Capsules" | "Bioregulator Capsules" | "Bioregulator Creams" | "Bioregulator Vials";
    form: 'Vial' | 'Capsule' | 'Cream' | 'Solution';
    description: string;
    attributes?: { label: string; value: string }[];
    isSale?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Coming Soon';
    isVariable?: boolean;
    variables?: ProductVariable[];
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
    console.log(`Wrote ${mappedProducts.length} enriched products to src/data/products.ts`);

    // 2. BLOG POSTS
    console.log("Fetching Blog Posts...");
    const posts = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/posts?per_page=20&_embed=true');
    if (Array.isArray(posts)) {
        const mappedPosts = posts.map(p => {
            // Find featured image if available
            let imageUrl = '';
            if (p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]) {
                imageUrl = p._embedded['wp:featuredmedia'][0].source_url;
            }
            return {
                id: p.id.toString(),
                title: stripHtml(p.title?.rendered),
                excerpt: stripHtml(p.excerpt?.rendered),
                content: p.content?.rendered,
                date: p.date,
                slug: p.slug,
                imageUrl,
                link: p.link
            };
        });

        const postsTs = `export interface BlogPost {
          id: string;
          title: string;
          excerpt: string;
          content: string;
          date: string;
          slug: string;
          imageUrl: string;
          link: string;
      }
      export const blogPosts: BlogPost[] = ${JSON.stringify(mappedPosts, null, 4)};`;
        fs.writeFileSync('src/data/posts.ts', postsTs);
        console.log(`Wrote ${mappedPosts.length} posts to src/data/posts.ts`);
    }

    // 3. PEPTIDE GUIDE
    console.log("Fetching Peptide Guide...");
    const guide = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=peptide-guide');
    if (Array.isArray(guide) && guide.length > 0) {
        const guideTs = `export const peptideGuide = {
          title: ${JSON.stringify(guide[0].title?.rendered)},
          contentHtml: ${JSON.stringify(guide[0].content?.rendered)}
      };`;
        fs.writeFileSync('src/data/peptideGuide.ts', guideTs);
        console.log("Wrote Peptide Guide to src/data/peptideGuide.ts");
    }

    // 4. PEPTIDE CALCULATOR
    console.log("Fetching Peptide Calculator...");
    const calc = await fetchJson('https://biolongevitylabs.com/wp-json/wp/v2/pages?slug=peptide-calculator');
    if (Array.isArray(calc) && calc.length > 0) {
        const calcTs = `export const peptideCalculator = {
          title: ${JSON.stringify(calc[0].title?.rendered)},
          contentHtml: ${JSON.stringify(calc[0].content?.rendered)}
      };`;
        fs.writeFileSync('src/data/peptideCalculator.ts', calcTs);
        console.log("Wrote Peptide Calculator to src/data/peptideCalculator.ts");
    }
}

run();
