import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const REVIEWS_JSON = path.join(process.cwd(), 'src/data/reviews.json');

function readReviewsLocal() {
    if (!fs.existsSync(REVIEWS_JSON)) return [];
    try {
        const content = fs.readFileSync(REVIEWS_JSON, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

function writeReviewsLocal(reviews: any[]) {
    fs.writeFileSync(REVIEWS_JSON, JSON.stringify(reviews, null, 4));
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const reviews = readReviewsLocal();
            return NextResponse.json(reviews.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, status } = await request.json();
        if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

        if (supabase) {
            const { data, error } = await supabase
                .from('product_reviews')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const reviews = readReviewsLocal();
            const index = reviews.findIndex((r: any) => r.id === id);
            if (index === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
            
            reviews[index].status = status;
            writeReviewsLocal(reviews);
            return NextResponse.json(reviews[index]);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        if (supabase) {
            const { error } = await supabase.from('product_reviews').delete().eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const reviews = readReviewsLocal();
            const filtered = reviews.filter((r: any) => r.id !== id);
            writeReviewsLocal(filtered);
            return NextResponse.json({ success: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
