import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const COUPONS_JSON = path.join(process.cwd(), 'src/data/coupons.json');

function readCouponsLocal() {
    if (!fs.existsSync(COUPONS_JSON)) {
        return [];
    }
    const content = fs.readFileSync(COUPONS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeCouponsLocal(coupons: any) {
    fs.writeFileSync(COUPONS_JSON, JSON.stringify(coupons, null, 4));
}

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return NextResponse.json(data);
        }

        const coupons = readCouponsLocal();
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Coupons GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const coupon = await request.json();

        if (supabase) {
            // Map frontend fields (camelCase often) to Supabase fields (snake_case) if necessary
            // But looking at the schema I created, I used snake_case. 
            // In the UI they might be using camelCase. Let's be safe and map them.
            const dbData = {
                id: coupon.id || `cpn_${Date.now()}`,
                code: coupon.code,
                discount_type: coupon.discountType || coupon.discount_type,
                discount_value: coupon.discountValue || coupon.discount_value,
                min_amount: coupon.minAmount || coupon.min_amount || null,
                is_active: coupon.isActive !== undefined ? coupon.isActive : (coupon.is_active !== undefined ? coupon.is_active : true)
            };

            const { data, error } = await supabase
                .from('coupons')
                .upsert(dbData)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, coupon: data });
        } else {
            const coupons = readCouponsLocal();
            const index = coupons.findIndex((c: any) => c.id === coupon.id);
            if (index > -1) {
                coupons[index] = { ...coupons[index], ...coupon };
            } else {
                if (!coupon.id) coupon.id = 'cpn_' + Date.now();
                coupons.push(coupon);
            }
            writeCouponsLocal(coupons);
            return NextResponse.json({ success: true, coupon });
        }
    } catch (error) {
        console.error('Coupons POST Error:', error);
        return NextResponse.json({ error: 'Failed to save coupon' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
        }

        if (supabase) {
            const { error } = await supabase.from('coupons').delete().eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            let coupons = readCouponsLocal();
            coupons = coupons.filter((c: any) => c.id !== id);
            writeCouponsLocal(coupons);
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error('Coupons DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
