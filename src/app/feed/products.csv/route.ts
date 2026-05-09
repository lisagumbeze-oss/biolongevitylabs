import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PRODUCTS_JSON = path.join(process.cwd(), 'src/data/products.json');
const BASE_URL = 'https://biolongevitylabss.com';

function readProductsLocal() {
    if (!fs.existsSync(PRODUCTS_JSON)) return [];
    const content = fs.readFileSync(PRODUCTS_JSON, 'utf-8');
    return JSON.parse(content);
}

function escapeCsv(val: any) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function GET() {
    try {
        let products = [];
        if (supabase) {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_variations(*)');
            if (error) throw error;
            products = data || [];
        } else {
            products = readProductsLocal();
        }

        const headers = ['id', 'title', 'description', 'link', 'image_link', 'availability', 'price', 'brand', 'condition', 'category'];
        const rows = products.map((p: any) => {
            const description = (p.description || '').replace(/<[^>]*>?/gm, '').trim();
            return [
                p.id,
                p.name,
                description,
                `${BASE_URL}/product/${p.id}`,
                p.image_url || p.image || '',
                p.stock_status === 'In Stock' ? 'in_stock' : 'out_of_stock',
                `${p.price || 0} USD`,
                'BioLongevity Labs',
                'new',
                p.category_name || p.category || ''
            ].map(escapeCsv).join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('CSV Feed Error:', error);
        return new Response('Error generating feed', { status: 500 });
    }
}
