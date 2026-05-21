import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncProduct() {
  const newProduct = {
    id: "prod_mk677_10mg_50tab",
    name: "MK-677 (10MG) (50 TABLETS)",
    price: 100.0,
    min_price: 100.0,
    max_price: 100.0,
    image_url: "/uploads/mk-677-10mg-50tablets.jpg",
    category_name: "SARMS",
    form: "Tablet",
    description: "<p>MK-677 (Ibutamoren) is a potent, non-peptide, orally active growth hormone secretagogue. Research-grade tablets for investigational use.</p>",
    stock_status: "In Stock",
    is_variable: false,
    is_sale: false,
    is_bestseller: false,
    is_new: true
  };

  console.log('Inserting product into Supabase...');
  const { data, error } = await supabase
    .from('products')
    .upsert(newProduct);

  if (error) {
    console.error('Error inserting product:', error);
  } else {
    console.log('Product inserted successfully');
  }
}

syncProduct();
