import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manually load env from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      return [key, value];
    })
);

const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Adding Category: SARMS');
  const { error: catError } = await supabase
    .from('categories')
    .upsert({ name: 'SARMS', slug: 'sarms', description: 'Selective Androgen Receptor Modulators' });

  if (catError) {
    console.error('Error adding category:', catError);
    return;
  }
  console.log('Category added');

  console.log('Adding Product: MK-677');
  const { error: prodError } = await supabase
    .from('products')
    .upsert({
      id: "prod_mk677_10mg_50tab",
      name: "MK-677 (10MG) (50 TABLETS)",
      price: 100.0,
      min_price: 100.0,
      max_price: 100.0,
      image_url: "/uploads/mk-677-10mg-50tablets.jpg",
      category_name: "SARMS",
      form: "Capsule", 
      description: "<p>MK-677 (Ibutamoren) is a potent, non-peptide, orally active growth hormone secretagogue. Research-grade tablets for investigational use.</p>",
      stock_status: "In Stock",
      is_variable: false,
      is_sale: false,
      is_bestseller: false,
      is_new: true
    });

  if (prodError) {
    console.error('Error adding product:', prodError);
  } else {
    console.log('Product added successfully');
  }
}

run();
