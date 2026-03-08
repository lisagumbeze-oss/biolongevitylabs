const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - These should be provided via environment variables
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (use service role for migration)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    console.log('Usage: SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/migrate-to-supabase.js');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    const productsPath = path.join(__dirname, '../src/data/products.json');
    if (!fs.existsSync(productsPath)) {
        console.error(`Error: products.json not found at ${productsPath}`);
        process.exit(1);
    }

    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`Found ${products.length} products to migrate.`);

    // 1. Extract Categories
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    console.log(`Extracting ${categories.length} categories...`);

    for (const catName of categories) {
        const slug = catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const { error } = await supabase
            .from('categories')
            .upsert({ name: catName, slug }, { onConflict: 'name' });
        if (error) console.error(`Error inserting category ${catName}:`, error.message);
    }

    // 2. Insert Products
    console.log('Inserting products...');
    for (const p of products) {
        const productData = {
            id: p.id,
            name: p.name,
            price: p.price,
            min_price: p.minPrice || null,
            max_price: p.maxPrice || null,
            image_url: p.image,
            category_name: p.category,
            form: p.form,
            description: p.description,
            stock_status: p.stockStatus,
            is_variable: !!p.isVariable,
            is_sale: !!p.isSale,
            is_bestseller: !!p.isBestseller,
            is_new: !!p.isNew
        };

        const { error: pError } = await supabase
            .from('products')
            .upsert(productData, { onConflict: 'id' });

        if (pError) {
            console.error(`Error inserting product ${p.id}:`, pError.message);
            continue;
        }

        // 3. Insert Variables (definitions)
        if (p.variables && p.variables.length > 0) {
            for (const v of p.variables) {
                const { error: vError } = await supabase
                    .from('product_variables')
                    .upsert({
                        product_id: p.id,
                        name: v.name,
                        options: v.options
                    }, { onConflict: 'product_id, name' }); // Assuming we might want to update
                if (vError) console.error(`Error inserting variable for ${p.id}:`, vError.message);
            }
        }

        // 4. Insert Variations (actual SKU instances)
        if (p.variations && p.variations.length > 0) {
            const variationsData = p.variations.map(v => ({
                id: v.id,
                product_id: p.id,
                attributes: v.attributes,
                price: v.price,
                stock_status: v.stockStatus
            }));

            const { error: varError } = await supabase
                .from('product_variations')
                .upsert(variationsData, { onConflict: 'id' });

            if (varError) console.error(`Error inserting variations for ${p.id}:`, varError.message);
        }
    }

    console.log('Migration completed!');
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
