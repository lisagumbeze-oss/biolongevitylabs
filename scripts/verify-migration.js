const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pcphezslywxavphlcdon.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Please set SUPABASE_SERVICE_ROLE_KEY environment variable.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log('--- Migration Verification ---');

    // 1. Categories
    const { data: catData, error: catError } = await supabase.from('categories').select('name');
    if (catError) console.error('Categories Error:', catError.message);
    else console.log('Categories:', catData.map(c => c.name).join(', '));

    // 2. Products
    const { count: prodCount, error: prodError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (prodError) console.error('Products Error:', prodError.message);
    else console.log('Total Products:', prodCount);

    // 3. Variables
    const { count: varCount, error: varError } = await supabase.from('product_variables').select('*', { count: 'exact', head: true });
    if (varError) console.error('Variables Error:', varError.message);
    else console.log('Total Variables:', varCount);

    // 4. Variations
    const { count: vnsCount, error: vnsError } = await supabase.from('product_variations').select('*', { count: 'exact', head: true });
    if (vnsError) console.error('Variations Error:', vnsError.message);
    else console.log('Total Variations:', vnsCount);

    if (prodCount > 0) {
        const { data: sample } = await supabase.from('products').select('name, price').limit(1);
        console.log('Sample Product:', sample?.[0]);
    }
}

verify().catch(console.error);
