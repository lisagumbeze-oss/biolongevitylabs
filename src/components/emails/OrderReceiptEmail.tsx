import React from 'react';
import { Text, Section, Heading, Img } from '@react-email/components';
import EmailLayout from './shared/EmailLayout';
import { OrderTable, InfoBlock, HeroHeader } from './shared/EmailComponents';
import { CRYPTO_WALLETS, CRYPTO_DISCOUNT_PERCENT } from '@/config/payments';
import { SITE_URL } from '@/lib/site';
import type { CryptoQuote } from '@/lib/crypto-quotes';

interface OrderReceiptEmailProps {
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        variationString?: string;
    }>;
    total: number;
    paymentMethod: string;
    paymentWalletAddress?: string;
    paymentType?: string;
    cryptoQuotes?: CryptoQuote[];
}

export const OrderReceiptEmail = ({
    orderId = '#ORD-123456',
    customerName = 'Jane Doe',
    customerEmail = 'jane@example.com',
    items = [
        { id: '1', name: 'BPC-157', price: 59.99, quantity: 2, variationString: '5mg Vial' }
    ],
    total = 119.98,
    paymentMethod = 'Zelle',
    paymentType,
    cryptoQuotes,
}: OrderReceiptEmailProps) => {
    return (
        <EmailLayout previewText={`Receipt: Order ${orderId} - BioLongevity Labs`}>
            <HeroHeader 
                title="Order Received" 
                subtitle={`Verification of acquisition for ${customerName}. Your research materials are being prepared pending final payment verification.`}
            />

            <OrderTable items={items} total={total} />

            <InfoBlock title="Payment Protocol" iconColor="#137fec">
                <Text className="m-0 font-bold text-slate-900">Method: {paymentMethod}</Text>
                {paymentType === 'crypto' && (
                    <div style={{ marginTop: '16px' }}>
                        <Text className="text-emerald-700 text-[13px] font-bold m-0 mb-3">
                            A {CRYPTO_DISCOUNT_PERCENT}% cryptocurrency discount is included in the total above.
                        </Text>
                        <Text className="text-slate-500 text-[12px] m-0 mb-3">
                            Send the exact amount shown for one currency. Each amount equals <strong>${total.toFixed(2)}</strong>. Include order ID <strong>{orderId}</strong> in the memo if your wallet supports it.
                        </Text>
                        {CRYPTO_WALLETS.map((wallet) => {
                            const quote = cryptoQuotes?.find((item) => item.id === wallet.id);
                            return (
                            <div key={wallet.id} style={{ marginTop: '12px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-2">{wallet.name} ({wallet.symbol})</Text>
                                {quote && (
                                    <Text className="text-slate-900 text-[18px] font-black m-0 mb-3">Send exactly {quote.amount} {wallet.symbol}</Text>
                                )}
                                {wallet.qrSrc && (
                                    <Img
                                        src={`${SITE_URL}${wallet.qrSrc}`}
                                        alt={`${wallet.name} wallet QR code`}
                                        width="160"
                                        height="160"
                                        style={{ margin: '0 0 12px', borderRadius: '12px' }}
                                    />
                                )}
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest m-0 mb-2">Wallet Address</Text>
                                <Text className="text-slate-900 text-[14px] font-black m-0" style={{ wordBreak: 'break-all' }}>{wallet.address}</Text>
                            </div>
                            );
                        })}
                    </div>
                )}
                <Text className="mt-2 m-0 text-slate-600">
                    Your order is currently in <strong>PENDING</strong> status. Please ensure the manual transfer is completed as per the instructions provided at checkout. Use your Order ID <strong>{orderId}</strong> as the reference.
                </Text>
            </InfoBlock>

            <Section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-solid">
                <Heading as="h4" className="text-[11px] font-black uppercase tracking-[0.2em] m-0 mb-3 text-slate-400">
                    Next Phases
                </Heading>
                <table className="w-full">
                    <tr>
                        <td className="pr-4 py-2" style={{ width: '20%' }}>
                            <div className="bg-primary text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">1</div>
                        </td>
                        <td className="py-2">
                            <Text className="text-[13px] font-bold text-slate-900 m-0">Payment Verification</Text>
                            <Text className="text-[12px] text-slate-500 m-0">Our financial team verifies your transfer (typically 12-24 hours).</Text>
                        </td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-2">
                            <div className="bg-slate-200 text-slate-500 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">2</div>
                        </td>
                        <td className="py-2">
                            <Text className="text-[13px] font-bold text-slate-400 m-0">Laboratory Selection</Text>
                            <Text className="text-[12px] text-slate-400 m-0">Items are pulled from temperature-controlled storage and inspected.</Text>
                        </td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-2">
                            <div className="bg-slate-200 text-slate-500 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">3</div>
                        </td>
                        <td className="py-2">
                            <Text className="text-[13px] font-bold text-slate-400 m-0">Global Logistics</Text>
                            <Text className="text-[12px] text-slate-400 m-0">Dispatched via secure courier with real-time tracking IDs.</Text>
                        </td>
                    </tr>
                </table>
            </Section>

            <Text className="text-slate-400 text-[11px] text-center mt-10 font-mono">
                REFERENCE: {orderId} // {customerEmail.toUpperCase()}
            </Text>
        </EmailLayout>
    );
};

export default OrderReceiptEmail;
