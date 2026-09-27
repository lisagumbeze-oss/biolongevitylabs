export const BITCOIN_PAYMENT_METHOD_ID = 'bitcoin';

/** Orders below this total (USD) may only pay via cryptocurrency. */
export const CRYPTO_ONLY_ORDER_MAX = 100;

export interface CryptoWallet {
    id: string;
    name: string;
    symbol: string;
    /** CoinGecko id used to price this coin in USD. */
    priceId: string;
    address: string;
    qrSrc?: string;
}

/**
 * Wallet addresses shown after a cryptocurrency order is confirmed.
 * Add the next currency here when a new address is provided.
 */
export const CRYPTO_WALLETS: CryptoWallet[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        priceId: 'bitcoin',
        address: 'bc1qzsn5djk2pklr49hepvpu4ckzwj9tujkxtdlqma',
        qrSrc: '/crypto/bitcoin-qr.png',
    },
    {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        priceId: 'ethereum',
        address: '0x5fad5A80927C763C4037A7c07051910747E8179d',
        qrSrc: '/crypto/ethereum-qr.png',
    },
    {
        id: 'bch',
        name: 'Bitcoin Cash',
        symbol: 'BCH',
        priceId: 'bitcoin-cash',
        address: 'qptpfw320hvdrk0xutpg2kdhauruwle65uxzz7p57v',
        qrSrc: '/crypto/bitcoin-cash-qr.png',
    },
];

export const CRYPTO_PAYMENT_LABEL = 'Cryptocurrency';

/** Percent off the product total when the order is paid in cryptocurrency. Shipping is excluded. */
export const CRYPTO_DISCOUNT_PERCENT = 10;

export const CRYPTO_DISCOUNT_NOTICE =
    'Pay with cryptocurrency and save 10% on the product total. Shipping is not discounted.';

export function roundMoney(amount: number): number {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function cryptoDiscountAmount(merchandiseAfterOtherDiscounts: number): number {
    if (merchandiseAfterOtherDiscounts <= 0) return 0;
    return roundMoney(merchandiseAfterOtherDiscounts * (CRYPTO_DISCOUNT_PERCENT / 100));
}

export const CRYPTO_CHECKOUT_INSTRUCTIONS =
    'Cryptocurrency payment includes a 10% discount on the product total. After you confirm this order, wallet addresses appear below the success message. Send the discounted order total to one of those addresses and include your order number in the memo if your wallet supports it.';

export interface PaymentMethodConfig {
    id: string;
    name: string;
    instructions: string;
    enabled: boolean;
    type?: string;
    walletAddress?: string;
}

export function getAvailablePaymentMethods(
    paymentMethods: PaymentMethodConfig[],
    orderTotal: number
): PaymentMethodConfig[] {
    const enabled = paymentMethods.filter((pm) => pm.enabled);
    if (orderTotal < CRYPTO_ONLY_ORDER_MAX) {
        return enabled.filter((pm) => pm.type === 'crypto');
    }
    return enabled;
}
