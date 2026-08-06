export const BITCOIN_WALLET_ADDRESS = '1CED26bTSz4JVWzrQCe3vCoxYfAwj95bFN';

export const BITCOIN_PAYMENT_METHOD_ID = 'bitcoin';

/** Orders below this total (USD) may only pay via cryptocurrency. */
export const CRYPTO_ONLY_ORDER_MAX = 100;

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
