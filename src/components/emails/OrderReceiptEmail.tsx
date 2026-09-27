import React from 'react';
import EmailLayout, { EMAIL_SUPPORT } from './shared/EmailLayout';
import { CryptoWalletList, EmailActions, EmailHeading, EmailParagraph, OrderTable } from './shared/EmailComponents';
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
    const supportHref = `mailto:${EMAIL_SUPPORT}?subject=${encodeURIComponent(`Order ${orderId}`)}`;

    return (
        <EmailLayout previewText={`Order ${orderId} received. Total due $${total.toFixed(2)}.`}>
            <EmailHeading
                eyebrow="Order received"
                title={`Thank you, ${customerName.split(' ')[0] || customerName}`}
                subtitle={`Order ${orderId} is waiting for payment. Send the total below and include the order number as the reference.`}
            />
            <EmailParagraph>
                Payment method: {paymentMethod}. We will email you again after the transfer is confirmed.
            </EmailParagraph>
            <OrderTable items={items} total={total} />
            {paymentType === 'crypto' && <CryptoWalletList quotes={cryptoQuotes} total={total} />}
            <EmailActions
                primary={{ href: supportHref, label: 'Email support about this order' }}
                secondary={{ href: SITE_URL, label: 'Visit the site' }}
            />
            <EmailParagraph>
                This message was sent to {customerEmail}.
            </EmailParagraph>
        </EmailLayout>
    );
};

export default OrderReceiptEmail;
