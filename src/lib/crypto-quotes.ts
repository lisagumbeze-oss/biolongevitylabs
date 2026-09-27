import { CRYPTO_WALLETS } from '@/config/payments';

/** Decimal places shown for each send amount. One unit is a satoshi-sized slice. */
const CRYPTO_AMOUNT_DECIMALS = 8;

const RATE_CACHE_MS = 60_000;

export interface CryptoQuote {
    id: string;
    name: string;
    symbol: string;
    /** Exact amount to send, rounded up so it covers the USD total. */
    amount: string;
    usd: string;
    /** USD price of one coin used for this quote. */
    usdPrice: string;
}

interface ScaledInt {
    int: bigint;
    scale: number;
}

let priceCache: { at: number; prices: Record<string, number> } | null = null;

function toScaledInt(value: string): ScaledInt {
    const trimmed = value.trim();
    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
        throw new Error(`Invalid decimal: ${value}`);
    }
    const [whole, fraction = ''] = trimmed.split('.');
    return {
        int: BigInt(whole + fraction),
        scale: fraction.length,
    };
}

function formatScaled(value: bigint, scale: number): string {
    const negative = value < BigInt(0);
    const abs = negative ? -value : value;
    const digits = abs.toString().padStart(scale + 1, '0');
    const split = digits.length - scale;
    const formatted = `${digits.slice(0, split)}.${digits.slice(split)}`;
    return negative ? `-${formatted}` : formatted;
}

/**
 * Divides two decimal strings and rounds up to `scale` decimal places.
 * Rounding up keeps the crypto payment from landing short of the USD total.
 */
export function divideDecimalCeil(numerator: string, denominator: string, scale = CRYPTO_AMOUNT_DECIMALS): string {
    const n = toScaledInt(numerator);
    const d = toScaledInt(denominator);
    if (d.int === BigInt(0)) throw new Error('Cannot divide by zero');

    const num = n.int * (BigInt(10) ** BigInt(d.scale + scale));
    const den = d.int * (BigInt(10) ** BigInt(n.scale));
    const quotient = num / den;
    const remainder = num % den;
    const rounded = remainder === BigInt(0) ? quotient : quotient + BigInt(1);
    return formatScaled(rounded, scale);
}

function priceToDecimal(price: number): string {
    if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Invalid coin price');
    }
    return price.toFixed(8).replace(/\.?0+$/, '');
}

async function fetchUsdPrices(): Promise<Record<string, number>> {
    if (priceCache && Date.now() - priceCache.at < RATE_CACHE_MS) {
        return priceCache.prices;
    }

    const ids = CRYPTO_WALLETS.map((wallet) => wallet.priceId).join(',');
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`,
        { cache: 'no-store' }
    );

    if (!response.ok) {
        throw new Error(`Price request failed (${response.status})`);
    }

    const data = await response.json() as Record<string, { usd?: number }>;
    const prices: Record<string, number> = {};

    for (const wallet of CRYPTO_WALLETS) {
        const usd = data[wallet.priceId]?.usd;
        if (typeof usd !== 'number' || !(usd > 0)) {
            throw new Error(`Missing USD price for ${wallet.symbol}`);
        }
        prices[wallet.id] = usd;
    }

    priceCache = { at: Date.now(), prices };
    return prices;
}

export async function getCryptoQuotes(usdTotal: number): Promise<CryptoQuote[]> {
    if (!Number.isFinite(usdTotal) || usdTotal <= 0) {
        throw new Error('Order total must be greater than zero');
    }

    const usd = usdTotal.toFixed(2);
    const prices = await fetchUsdPrices();

    return CRYPTO_WALLETS.map((wallet) => {
        const usdPrice = prices[wallet.id];
        return {
            id: wallet.id,
            name: wallet.name,
            symbol: wallet.symbol,
            amount: divideDecimalCeil(usd, priceToDecimal(usdPrice)),
            usd,
            usdPrice: usdPrice.toFixed(2),
        };
    });
}
