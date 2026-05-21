import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { productPath } from '@/lib/product-slug';
import type { Product } from '@/data/products';
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

        const xmlItems = products.map((p: any) => {
            const id = p.id;
            const title = String(p.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            const description = String(p.description || '').replace(/<[^>]*>?/gm, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').trim();
            const link = `${BASE_URL}${productPath({
                id: p.id,
                name: p.name || "",
                slug: p.slug,
            } as Pick<Product, "id" | "name" | "slug">)}`;
            const imageLink = (p.image_url || p.image || '').replace(/&/g, '&amp;');
            const price = `${p.price || 0} USD`;
            const availability = p.stock_status === 'In Stock' ? 'in_stock' : 'out_of_stock';
            const brand = 'BioLongevity Labs';
            const condition = 'new';

            return `
        <item>
            <g:id>${id}</g:id>
            <g:title>${title}</g:title>
            <g:description>${description}</g:description>
            <g:link>${link}</g:link>
            <g:image_link>${imageLink}</g:image_link>
            <g:condition>${condition}</g:condition>
            <g:availability>${availability}</g:availability>
            <g:price>${price}</g:price>
            <g:brand>${brand}</g:brand>
            <g:google_product_category>Health &amp; Beauty &gt; Health Care</g:google_product_category>
        </item>`;
        }).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title>BioLongevity Labs Product Feed</title>
        <link>${BASE_URL}</link>
        <description>High-purity research peptides and bioregulators</description>
        ${xmlItems}
    </channel>
</rss>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('XML Feed Error:', error);
        return new Response('Error generating feed', { status: 500 });
    }
}
