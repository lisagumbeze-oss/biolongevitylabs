import { NextResponse } from 'next/server';
import { getCryptoQuotes } from '@/lib/crypto-quotes';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const usd = Number(new URL(request.url).searchParams.get('usd'));

    if (!Number.isFinite(usd) || usd <= 0) {
        return NextResponse.json({ error: 'A positive usd total is required' }, { status: 400 });
    }

    try {
        const quotes = await getCryptoQuotes(usd);
        return NextResponse.json({ usd: usd.toFixed(2), quotes });
    } catch (error) {
        console.error('Crypto quote error:', error);
        return NextResponse.json({ error: 'Could not calculate cryptocurrency amounts' }, { status: 502 });
    }
}
