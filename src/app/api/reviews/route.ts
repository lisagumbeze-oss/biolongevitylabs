import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const REVIEWS_JSON = path.join(process.cwd(), 'src/data/reviews.json');
const ORDERS_JSON = path.join(process.cwd(), 'src/data/orders.json');

function readLocal(filePath: string) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

function writeLocal(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        if (supabase) {
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const reviews = readLocal(REVIEWS_JSON);
            const filtered = reviews.filter((r: any) => r.product_id === productId && r.status === 'approved');
            return NextResponse.json(filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
    } catch (error) {
        console.error('Reviews API Error (GET):', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, rating, comment, authorName, authorEmail } = body;

        if (!productId || !rating || !comment || !authorName || !authorEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Logic-based Verification Check
        let isVerified = false;

        if (supabase) {
            // Check for completed orders with matching email and product
            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('id, order_items(product_id)')
                .eq('customer_email', authorEmail);

            if (!orderError && orders) {
                isVerified = orders.some(order => 
                    order.order_items && (order.order_items as any[]).some(item => item.product_id === productId)
                );
            }

            const { data: review, error: reviewError } = await supabase
                .from('product_reviews')
                .insert({
                    product_id: productId,
                    rating,
                    comment,
                    author_name: authorName,
                    author_email: authorEmail,
                    is_verified: isVerified,
                    status: 'approved' // Auto-approve for now, could be 'pending' for moderation
                })
                .select()
                .single();

            if (reviewError) throw reviewError;
            return NextResponse.json(review, { status: 201 });
        } else {
            const orders = readLocal(ORDERS_JSON);
            isVerified = orders.some((order: any) => 
                order.email === authorEmail && 
                (order.full_items || order.items || []).some((item: any) => (item.product_id || item.id) === productId)
            );

            const reviews = readLocal(REVIEWS_JSON);
            const newReview = {
                id: crypto.randomUUID(),
                product_id: productId,
                rating,
                comment,
                author_name: authorName,
                author_email: authorEmail,
                is_verified: isVerified,
                status: 'approved',
                created_at: new Date().toISOString()
            };
            reviews.push(newReview);
            writeLocal(REVIEWS_JSON, reviews);
            return NextResponse.json(newReview, { status: 201 });
        }
    } catch (error) {
        console.error('Reviews API Error (POST):', error);
        return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
    }
}
