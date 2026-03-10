import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COUPONS_JSON = path.join(process.cwd(), 'src/data/coupons.json');

function readCoupons() {
    if (!fs.existsSync(COUPONS_JSON)) {
        return [];
    }
    const content = fs.readFileSync(COUPONS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeCoupons(coupons: any) {
    fs.writeFileSync(COUPONS_JSON, JSON.stringify(coupons, null, 4));
}

export async function GET() {
    try {
        const coupons = readCoupons();
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const coupon = await request.json();
        const coupons = readCoupons();

        // Add new coupon or update existing
        const index = coupons.findIndex((c: any) => c.id === coupon.id);
        if (index > -1) {
            coupons[index] = { ...coupons[index], ...coupon };
        } else {
            // Assign a unique ID if not present
            if (!coupon.id) coupon.id = 'cpn_' + Date.now();
            coupons.push(coupon);
        }

        writeCoupons(coupons);
        return NextResponse.json({ success: true, coupon });
    } catch (error) {
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

        let coupons = readCoupons();
        coupons = coupons.filter((c: any) => c.id !== id);
        writeCoupons(coupons);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
